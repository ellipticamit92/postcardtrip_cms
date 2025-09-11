import { Heading } from "@/components/atoms/Heading";
import { HotelImageForm } from "@/components/organisms/HotelImageForm";
import HotelService from "@/services/hotel.service";

export default async function AddHotelImagesPage() {
  const hotelsData = await HotelService.getNameId();
  return (
    <>
      <Heading text="Add Hotel Image" href="/" />
      <HotelImageForm hotels={hotelsData.data} />
    </>
  );
}
