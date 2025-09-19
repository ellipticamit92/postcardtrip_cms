import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class GenericService {
  static async getCount(model: Prisma.ModelName) {
    try {
      const selectedModel = (prisma as any)[model];
      if (!selectedModel?.count) {
        throw new Error(`Model "${model}" does not support count()`);
      }
      return await selectedModel.count();
    } catch (error) {
      throw new Error(`Failed to count ${String(model)}: ${error}`);
    }
  }
}
