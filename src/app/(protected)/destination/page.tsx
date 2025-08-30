import { Heading } from "@/components/atoms/Heading";
import DestinationTable from "@/components/organisms/DestinationTable";
import { DestinationService } from "@/services/destination.service";

export default async function DestinationPage() {
  const destinationsData = await DestinationService.getAll();
  const { data, pagination } = destinationsData;

  return (
    <>
      <Heading text="All Destinations" />
      <DestinationTable data={data ?? []} pagination={pagination} />
    </>
  );
}
