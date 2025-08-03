import { Heading } from "@/components/atoms/Heading";
// import { getPaginationDestinations } from "@/services/destination.svc";
// import DestinationTable from "@/components/organisms/DeatinationTable";

export default async function DestinationPage() {
  // const destinationsData = await getPaginationDestinations({});
  // const { destinations, totalCount, totalPages, currentPage } =
  //   destinationsData;

  return (
    <>
      <Heading text="All Destinations" />
      {/* <DestinationTable
        data={destinations ?? []}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
      />
      */}
    </>
  );
}
