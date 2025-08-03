import { Heading } from "@/components/atoms/Heading";
import { getPaginationDestinations } from "@/services/destination.svc";
import DestinationTable from "@/components/organisms/DeatinationTable";
import { HotelImageService } from "@/services/hotelImage.svc";

export default async function HotelImagePage() {
  const hotelImageData = await HotelImageService.getAll();
  console.log("DEBIG hotelImage  = ", hotelImageData);
  return (
    <>
      <Heading text="All Hotel Images" />
      {/* <DestinationTable
        data={destinations ?? []}
        totalCount={totalCount}
        totalPages={totalPages}
        currentPage={currentPage}
      /> */}
    </>
  );
}
