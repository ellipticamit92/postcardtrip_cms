// src/app/(protected)/city/page.tsx
import CityCard from "@/components/organisms/city/CityCard";
import CityTable from "@/components/organisms/city/CityTable";
import PageHeader from "@/components/organisms/PageHeader";
import ViewLayout from "@/components/templates/ViewLayout";
import cityService from "@/services/city.service";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface CityPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CityPage({ searchParams }: CityPageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const cityData = await cityService.getAll({ page });
  const { data, pagination } = cityData;

  return (
    <>
      <PageHeader
        title="Cities"
        description="Manage cities"
        Icon={Building2}
        href="/city/add"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey="name"
        GridComponent={CityCard}
        ListComponent={CityTable}
        TableComponent={CityTable}
      />
    </>
  );
}
