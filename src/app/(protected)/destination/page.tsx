import { Heading } from "@/components/atoms/Heading";
//import DestinationTable from "@/components/organisms/DeatinationTable";
// import { getAllDestinations } from "@/services/destination.svc";

export default async function DestinationPage() {
  // const destinationsData = await getAllDestinations(1);
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
      /> */}
    </>
  );
}
