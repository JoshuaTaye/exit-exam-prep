// Seeds the database from data/blueprint.json + data/questions.json.
// Everything is deterministic: classification uses lib/classifier (no LLM).
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";
import {
  buildTopicAssigner,
  classifyType,
  computeDifficulty,
  makeExplanation,
  topicBloomScore,
} from "../lib/classifier";
import { slugify } from "../lib/utils";
import { NOTES } from "../lib/notes-content";
import { DEFAULT_USER_EMAIL } from "../lib/constants";

const prisma = new PrismaClient();

interface BPTopic { name: string; items: number; bloom: Record<string, number> }
interface BPCourse {
  no: number; themeNo: number; name: string; creditHours: number;
  items: number; generalObjective: string; topics: BPTopic[];
}
interface Blueprint {
  exam: any;
  themes: { no: number; name: string; weight: number }[];
  courses: BPCourse[];
}
interface RawQ {
  courseNo: number; courseName: string; qnum: number;
  stem: string; options: Record<string, string>; answer: string;
}

async function main() {
  const dataDir = join(process.cwd(), "data");
  const bp: Blueprint = JSON.parse(readFileSync(join(dataDir, "blueprint.json"), "utf-8"));
  const questions: RawQ[] = JSON.parse(readFileSync(join(dataDir, "questions.json"), "utf-8"));

  // ---- Themes ----
  console.log("Upserting themes…");
  const themeIdByNo = new Map<number, number>();
  for (const t of bp.themes) {
    const row = await prisma.theme.upsert({
      where: { no: t.no },
      update: { name: t.name, weight: t.weight },
      create: { no: t.no, name: t.name, weight: t.weight },
    });
    themeIdByNo.set(t.no, row.id);
  }

  // ---- Courses + Topics + Notes ----
  console.log("Upserting courses, topics and notes…");
  const courseIdByNo = new Map<number, number>();
  // courseNo -> array of {id, name, items, bloom, slug} aligned to blueprint order
  const topicsByCourse = new Map<number, { id: number; name: string; items: number; bloom: Record<string, number>; slug: string }[]>();

  for (const c of bp.courses) {
    const course = await prisma.course.upsert({
      where: { no: c.no },
      update: {
        name: c.name,
        creditHours: c.creditHours,
        items: c.items,
        generalObjective: c.generalObjective,
        themeId: themeIdByNo.get(c.themeNo)!,
      },
      create: {
        no: c.no,
        name: c.name,
        creditHours: c.creditHours,
        items: c.items,
        generalObjective: c.generalObjective,
        themeId: themeIdByNo.get(c.themeNo)!,
      },
    });
    courseIdByNo.set(c.no, course.id);

    const courseTopicItems = c.topics.reduce((s, t) => s + t.items, 0) || 1;
    const courseNotes = NOTES[c.no] ?? [];
    const topicList: { id: number; name: string; items: number; bloom: Record<string, number>; slug: string }[] = [];

    for (let i = 0; i < c.topics.length; i++) {
      const t = c.topics[i];
      const slug = slugify(t.name);
      const topic = await prisma.topic.upsert({
        where: { courseId_slug: { courseId: course.id, slug } },
        update: {
          name: t.name,
          items: t.items,
          importance: t.items / courseTopicItems,
          bloom: JSON.stringify(t.bloom),
        },
        create: {
          name: t.name,
          slug,
          items: t.items,
          importance: t.items / courseTopicItems,
          bloom: JSON.stringify(t.bloom),
          courseId: course.id,
        },
      });
      topicList.push({ id: topic.id, name: t.name, items: t.items, bloom: t.bloom, slug });

      // Note for this topic (authored content aligned by index).
      const nc = courseNotes[i];
      if (nc) {
        const noteData = {
          title: t.name,
          slug,
          overview: nc.overview,
          keyConcepts: JSON.stringify(nc.keyConcepts),
          definitions: JSON.stringify(nc.definitions),
          examples: JSON.stringify(nc.examples),
          diagram: nc.diagram ?? "",
          examTips: JSON.stringify(nc.examTips),
          commonMistakes: JSON.stringify(nc.commonMistakes),
          orderIndex: i,
        };
        await prisma.note.upsert({
          where: { topicId: topic.id },
          update: noteData,
          create: { ...noteData, courseId: course.id, topicId: topic.id },
        });
      }
    }
    topicsByCourse.set(c.no, topicList);
  }

  // ---- Questions ----
  console.log(`Classifying and upserting ${questions.length} questions…`);
  const diffCount: Record<string, number> = {};
  const typeCount: Record<string, number> = {};

  for (const c of bp.courses) {
    const courseQs = questions.filter((q) => q.courseNo === c.no);
    const topicList = topicsByCourse.get(c.no)!;
    const assign = buildTopicAssigner(
      topicList.map((t) => ({ name: t.name, slug: t.slug, items: t.items, bloom: t.bloom })),
    );
    const courseId = courseIdByNo.get(c.no)!;

    for (const q of courseQs) {
      const topicIdx = assign(q.stem, q.options);
      const topic = topicList[topicIdx];
      const bloomScore = topicBloomScore(topic.bloom);
      const { difficulty, base, concepts } = computeDifficulty(q.stem, q.options, bloomScore);
      const questionType = classifyType(q.stem);
      diffCount[difficulty] = (diffCount[difficulty] ?? 0) + 1;
      typeCount[questionType] = (typeCount[questionType] ?? 0) + 1;

      const externalId = `C${q.courseNo}-Q${q.qnum}`;
      const data = {
        qnum: q.qnum,
        stem: q.stem,
        optionA: q.options.A ?? "",
        optionB: q.options.B ?? "",
        optionC: q.options.C ?? "",
        optionD: q.options.D ?? "",
        answer: q.answer,
        explanation: makeExplanation(q.answer, q.options, c.name, topic.name),
        difficulty,
        questionType,
        conceptCount: concepts,
        baseDifficulty: base,
        courseId,
        topicId: topic.id,
      };

      await prisma.question.upsert({
        where: { externalId },
        update: data,
        create: { externalId, ...data },
      });
    }
  }

  // ---- Default user ----
  console.log("Ensuring default user exists…");
  await prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: {},
    create: { name: "Student", email: DEFAULT_USER_EMAIL },
  });

  // ---- Summary ----
  const totalQ = await prisma.question.count();
  console.log("\n✔ Seed complete");
  console.log(`  themes:    ${bp.themes.length}`);
  console.log(`  courses:   ${bp.courses.length}`);
  console.log(`  topics:    ${await prisma.topic.count()}`);
  console.log(`  notes:     ${await prisma.note.count()}`);
  console.log(`  questions: ${totalQ}`);
  console.log(`  difficulty mix: ${JSON.stringify(diffCount)}`);
  console.log(`  type mix:       ${JSON.stringify(typeCount)}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
