import PackageGrid from "@/components/organisms/packages/PackageGrid";
import PackageTable from "@/components/organisms/packages/PackageTable";
import PageHeader from "@/components/organisms/PageHeader";
import ViewLayout from "@/components/templates/ViewLayout";
import PackageService from "@/services/package.service";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

interface PackagePageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PacakgesPage({ searchParams }: PackagePageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const packageData = await PackageService.getAll({ page });
  const { data, pagination } = packageData;

  return (
    <>
      <PageHeader
        title="Packages"
        description="Create and manage travel packages"
        Icon={Package}
        href="/package/add"
        aiHref="/package/ai"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey={"name"}
        GridComponent={PackageGrid}
        ListComponent={PackageGrid}
        TableComponent={PackageTable}
      />
    </>
  );
}
