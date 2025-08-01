import { MyTable } from "@/components/molecules/MyTable";
import DestinationTable from "@/components/organisms/DeatinationTable";
import { getAllDestinations } from "@/services/destination.svc";

export default async function DestinationPage() {
  const destinations = await getAllDestinations(1);

  return (
    <>
      <h2 className="text-xl font-semibold mt-10">All Destinations</h2>
      <DestinationTable />
    </>
  );
}
