import DestinationTable from "@/components/organisms/DeatinationTable";
import { getAllDestinations } from "@/services/destination.svc";

export default async function DestinationPage() {
  const destinationsData = await getAllDestinations(1);
  const { destinations, totalCount, totalPages, currentPage } =
    destinationsData;

  return (
    <>
      <h2 className="text-xl font-semibold mt-5">All Destinations</h2>
      <DestinationTable
        data={destinations ?? []}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </>
  );
}
