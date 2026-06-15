#!/usr/bin/env python3
"""Parse the MoE SE Exit-Exam question bank (.docx) into clean JSON.

Output: data/questions.json  ->  list of
  { courseNo, courseName, qnum, stem, options:{A,B,C,D}, answer }
No LLM involved; pure structural parsing of the Word XML.
"""
import re, html, json, sys, os

SRC = "/tmp/qbank_extract/word/document.xml"
OUT = os.path.join(os.path.dirname(__file__), "questions.json")

xml = open(SRC, encoding="utf-8").read()
paras = re.findall(r"<w:p[ >].*?</w:p>", xml, re.S)

def text_of(p):
    runs = re.findall(r"<w:t[^>]*>(.*?)</w:t>", p, re.S)
    return html.unescape("".join(runs)).strip()

ne = [t for t in (text_of(p) for p in paras) if t]

# locate the answer key
ak_start = next(i for i, t in enumerate(ne) if t == "ANSWER KEY")
body = ne[:ak_start]
key = ne[ak_start:]

course_re = re.compile(r"^Course\s+(\d+)\s*:\s*(.+)$")
q_re = re.compile(r"^Q(\d+)\.\s*(.*)$")
opt_re = re.compile(r"^([A-D])\)\s*(.*)$")

# ---- parse body questions, grouped by course ----
courses = {}          # courseNo -> {name, questions:{qnum: {...}}}
cur = None
i = 0
while i < len(body):
    t = body[i]
    m = course_re.match(t)
    if m:
        cur = int(m.group(1))
        courses.setdefault(cur, {"name": m.group(2).strip(), "questions": {}})
        i += 1
        continue
    mq = q_re.match(t)
    if mq and cur is not None:
        qnum = int(mq.group(1))
        stem = mq.group(2).strip()
        opts = {}
        j = i + 1
        while j < len(body):
            mo = opt_re.match(body[j])
            if mo:
                opts[mo.group(1)] = mo.group(2).strip()
                j += 1
            else:
                break
        courses[cur]["questions"][qnum] = {"stem": stem, "options": opts}
        i = j
        continue
    i += 1

# ---- parse answer key, grouped by course ----
answers = {}          # courseNo -> {qnum: letter}
cur = None
qlabels = []          # pending question labels for current course
letters = []
def flush(c):
    if c is None:
        return
    answers.setdefault(c, {})
    for lbl, let in zip(qlabels, letters):
        answers[c][lbl] = let

i = 0
while i < len(key):
    t = key[i]
    m = course_re.match(t)
    if m:
        flush(cur)
        qlabels, letters = [], []
        cur = int(m.group(1))
        i += 1
        continue
    ml = re.match(r"^Q(\d+)$", t)
    if ml:
        qlabels.append(int(ml.group(1)))
        i += 1
        continue
    if re.match(r"^[A-D]$", t):
        letters.append(t)
        i += 1
        continue
    i += 1
flush(cur)

# ---- merge ----
out = []
problems = []
for cno in sorted(courses):
    cname = courses[cno]["name"]
    qs = courses[cno]["questions"]
    aks = answers.get(cno, {})
    for qnum in sorted(qs):
        q = qs[qnum]
        ans = aks.get(qnum)
        if len(q["options"]) != 4:
            problems.append(f"C{cno} Q{qnum}: {len(q['options'])} options")
        if ans is None:
            problems.append(f"C{cno} Q{qnum}: no answer")
        out.append({
            "courseNo": cno,
            "courseName": cname,
            "qnum": qnum,
            "stem": q["stem"],
            "options": q["options"],
            "answer": ans,
        })

json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
print(f"parsed {len(out)} questions across {len(courses)} courses -> {OUT}")
print("answer coverage:", sum(1 for x in out if x['answer']), "/", len(out))
print("4-option coverage:", sum(1 for x in out if len(x['options'])==4), "/", len(out))
if problems:
    print(f"\n{len(problems)} problems (first 20):")
    for p in problems[:20]:
        print("  ", p)
