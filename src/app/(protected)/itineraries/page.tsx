import { Heading } from "@/components/atoms/Heading";
import ItineraryTable from "@/components/organisms/ItineraryTable";
import ItineraryService from "@/services/itinerary.service";

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  const itineraryData = await ItineraryService.getAll();
  const { data, pagination } = itineraryData;

  return (
    <>
      <Heading text="All Destinations" />
      <ItineraryTable data={data ?? []} pagination={pagination} />
    </>
  );
}
