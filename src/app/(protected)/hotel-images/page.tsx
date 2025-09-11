import { Heading } from "@/components/atoms/Heading";
import HotelImageTable from "@/components/organisms/HotelImageTable";
import { HotelImageService } from "@/services/hotelImage.service";

export default async function HotelImagePage() {
  const hotelImageData = await HotelImageService.getAll();
  return (
    <>
      <Heading text="All Hotel Images" href="/" />
      <HotelImageTable data={hotelImageData.data} />
    </>
  );
}
