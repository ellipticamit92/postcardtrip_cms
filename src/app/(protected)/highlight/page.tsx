import HighlightTable from "@/components/organisms/highlights/HighlightTable";
import PageHeader from "@/components/organisms/PageHeader";
import HighlightService from "@/services/highlight.service";
import { SearchPageProps } from "@/types/type";
import { Siren } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HighlightPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const highlightData = await HighlightService.getAll({ page, limit: 12 });
  const { data, pagination } = highlightData;

  return (
    <>
      <PageHeader
        title="Highlight"
        description="Manage reusable highlight for your packages"
        Icon={Siren}
        href="/highlight/add"
        aiHref="/highlight/ai"
      />

      <HighlightTable data={data} pagination={pagination} />
    </>
  );
}
