import InquiryTable from "@/components/organisms/InquiryTable";
import PageHeader from "@/components/organisms/PageHeader";
import InquiryService from "@/services/inquiry.service";
import { SearchPageProps } from "@/types/type";
import { MessageSquareText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InquiryPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  const inquiryData = await InquiryService.getAll({ page, limit: 12 });
  const { data, pagination } = inquiryData;
  console.log("DEBUG: ", data, pagination);

  return (
    <>
      <PageHeader
        title="Website Inquiry"
        description="Manage website inquiries and messages"
        Icon={MessageSquareText}
      />
      <InquiryTable data={data ?? []} pagination={pagination} />
    </>
  );
}
