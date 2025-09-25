import { prisma } from "@/lib/prisma";
import { Inquiry } from "@prisma/client";

export class InquiryService {
  static async create(data: Inquiry) {
    try {
      return await prisma.inquiry.create({
        data,
      });
    } catch (error) {
      throw new Error(`Failed to create inquiry: ${error}`);
    }
  }
}

export default InquiryService;
