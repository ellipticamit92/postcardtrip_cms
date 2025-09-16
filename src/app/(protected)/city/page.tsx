import PageHeader from "@/components/molecules/PageHeader";
import CityCard from "@/components/organisms/city/CityCard";
import CityTable from "@/components/organisms/city/CityTable";
import ViewLayout from "@/components/templates/ViewLayout";
import cityService from "@/services/city.service";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface CityPageProps {
  searchParams: { page?: string };
}

export default async function CityPage({ searchParams }: CityPageProps) {
  const page = Number(searchParams.page) || 1;
  const cityData = await cityService.getAll({
    page,
  });
  const { data, pagination } = cityData;

  console.log("DATA debug = ", data);
  console.log("DEBUG pagination = ", pagination);
  return (
    <>
      <PageHeader
        title="Cities"
        description="Manage cities"
        Icon={Building2}
        href="/reviews/add"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey={"name"}
        GridComponent={CityCard}
        ListComponent={CityTable}
        TableComponent={CityTable}
      />
    </>
  );
}
