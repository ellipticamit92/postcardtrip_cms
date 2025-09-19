import ItineraryGrid from "@/components/organisms/itineraries/ItineraryGrid";
import ItineraryTable from "@/components/organisms/itineraries/ItineraryTable";
import PageHeader from "@/components/organisms/PageHeader";
import ViewLayout from "@/components/templates/ViewLayout";
import ItineraryService from "@/services/itinerary.service";
import { Map } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  const { data, pagination } =
    await ItineraryService.getGroupedItineraryPackage();

  return (
    <>
      <PageHeader
        title="Itinearies"
        description="Manage travel package itinearies"
        Icon={Map}
        href="/itineraries/add"
      />

      <ViewLayout
        data={Object.values(data ?? {})}
        pagination={pagination}
        GridComponent={ItineraryGrid}
        ListComponent={ItineraryTable}
        TableComponent={ItineraryTable}
        filterKey={"itineraries"}
      />
    </>
  );
}
