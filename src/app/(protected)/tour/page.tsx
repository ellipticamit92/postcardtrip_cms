import { Heading } from "@/components/atoms/Heading";
import TourTable from "@/components/organisms/TourTable";
import TourService from "@/services/tours.service";

export default async function TourPage() {
  const destinationsData = await TourService.getAll();
  const { data, pagination } = destinationsData;

  return (
    <>
      <Heading text="All Tour" />
      <TourTable data={data ?? []} pagination={pagination} />
    </>
  );
}
