import PageHeader from "@/components/molecules/PageHeader";
import ItineraryGrid from "@/components/organisms/itineraries/ItineraryGrid";
import ViewLayout from "@/components/templates/ViewLayout";
import ItineraryService from "@/services/itinerary.service";
import { Map } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  const itineraryData = await ItineraryService.getAll();
  const { data, pagination } = itineraryData;

  return (
    <>
      <PageHeader
        title="Itinearries"
        description="Manage travel package itinearies"
        Icon={Map}
        href="/itineraries/add"
      />

      {/* <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey={"title"}
        GridComponent={ItineraryGrid}
        ListComponent={ItineraryGrid}
        TableComponent={ItineraryTable}
      /> */}
    </>
  );
}
