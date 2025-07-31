import { prisma } from "@/lib/prisma";
import { UsersResponse } from "@/types/type";

export async function getUsers() {
  const users: UsersResponse = await prisma.user.findMany();
  return users;
}
