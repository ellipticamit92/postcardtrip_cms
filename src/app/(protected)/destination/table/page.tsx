import { Heading } from "@/components/atoms/Heading";
import PageHeader from "@/components/molecules/PageHeader";
import Destinations from "@/components/organisms/destinations";
import DestinationTable from "@/components/organisms/DestinationTable";
import { DestinationService } from "@/services/destination.service";

export const dynamic = "force-dynamic";

export default async function DestinationPage() {
  const destinationsData = await DestinationService.getAll();
  const { data, pagination } = destinationsData;

  return (
    <>
      <PageHeader
        title="Destinations"
        description="Manage travel destinations and locations"
      />
      <DestinationTable data={data ?? []} pagination={pagination} />
    </>
  );
}
