import DestinationGrid from "@/components/organisms/destinations/DestinationGrid";
import DestinationList from "@/components/organisms/destinations/DestinationList";
import DestinationTable from "@/components/organisms/destinations/DestinationTable";
import PageHeader from "@/components/organisms/PageHeader";
import ViewLayout from "@/components/templates/ViewLayout";
import { DestinationService } from "@/services/destination.service";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DestinationPage() {
  const destinationsData = await DestinationService.getAll();
  const { data, pagination } = destinationsData;

  return (
    <>
      <PageHeader
        title="Destinations"
        description="Manage travel destinations and locations"
        Icon={MapPin}
        href="/destination/add"
        aiHref="/destination/ai"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey={"name"}
        GridComponent={DestinationGrid}
        ListComponent={DestinationList}
        TableComponent={DestinationTable}
      />
    </>
  );
}
