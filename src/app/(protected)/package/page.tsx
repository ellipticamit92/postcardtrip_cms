import PackageGrid from "@/components/organisms/packages/PackageGrid";
import PackageTable from "@/components/organisms/packages/PackageTable";
import PageHeader from "@/components/organisms/PageHeader";
import ViewLayout from "@/components/templates/ViewLayout";
import PackageService from "@/services/package.service";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PacakgesPage() {
  const packageData = await PackageService.getAll();
  const { data, pagination } = packageData;

  return (
    <>
      <PageHeader
        title="Packages"
        description="Create and manage travel packages"
        Icon={Package}
        href="/package/add"
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
