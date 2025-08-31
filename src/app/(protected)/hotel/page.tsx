import { Heading } from "@/components/atoms/Heading";
import HotelTable from "@/components/organisms/HotelTable";
import HotelService from "@/services/hotel.service";

export const dynamic = "force-dynamic";

export default async function HotelPage() {
  const hotelsData = await HotelService.getAll();

  return (
    <>
      <Heading text="All Hotels" />
      <HotelTable data={hotelsData.data} />
    </>
  );
}
