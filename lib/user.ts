import { prisma } from "./db";
import { DEFAULT_USER_EMAIL } from "./constants";

// Single-user personal platform: resolve (or lazily create) the default user.
export async function getCurrentUser() {
  let user = await prisma.user.findUnique({ where: { email: DEFAULT_USER_EMAIL } });
  if (!user) {
    user = await prisma.user.create({ data: { name: "Student", email: DEFAULT_USER_EMAIL } });
  }
  return user;
}
