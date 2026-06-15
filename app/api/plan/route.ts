import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";
import { regeneratePlan } from "@/lib/study-planner";

// POST /api/plan → regenerate the study plan from current mastery + mistakes.
export async function POST() {
  const user = await getCurrentUser();
  const plan = await regeneratePlan(user.id);
  return NextResponse.json(plan);
}
