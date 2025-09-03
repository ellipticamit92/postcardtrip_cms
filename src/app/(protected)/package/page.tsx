import { Heading } from "@/components/atoms/Heading";
import PackageTable from "@/components/organisms/PackageTable";
import PackageService from "@/services/package.service";

export const dynamic = "force-dynamic";

export default async function PacakgesPage() {
  const packageData = await PackageService.getAll();
  const { data, pagination } = packageData;

  return (
    <>
      <Heading text="All Packages" />
      <PackageTable data={data} pagination={pagination} />
    </>
  );
}
