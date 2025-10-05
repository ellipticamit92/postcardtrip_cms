import CityGrid from "@/components/organisms/city/CityGrid";
import CityTable from "@/components/organisms/city/CityTable";
import PageHeader from "@/components/organisms/PageHeader";
import ViewLayout from "@/components/templates/ViewLayout";
import cityService from "@/services/city.service";
import { SearchPageProps } from "@/types/type";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CityPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const cityData = await cityService.getAll({ page, limit: 12 });
  const { data, pagination } = cityData;

  return (
    <>
      <PageHeader
        title="Cities"
        description="Manage cities"
        Icon={Building2}
        href="/city/add"
        aiHref="/city/ai"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey="name"
        GridComponent={CityGrid}
        ListComponent={CityTable}
        TableComponent={CityTable}
      />
    </>
  );
}
