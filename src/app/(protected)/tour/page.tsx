import PageHeader from "@/components/organisms/PageHeader";
import TourTable from "@/components/organisms/tours/TourTable";
import TourService from "@/services/tours.service";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TourPage() {
  const destinationsData = await TourService.getAll();
  const { data, pagination } = destinationsData;

  return (
    <>
      <PageHeader
        title="Tours"
        description="Manage guided tours and experiences"
        Icon={Compass}
        href="/tour/add"
      />
      <TourTable data={data ?? []} pagination={pagination} />
    </>
  );
}
