import { Heading } from "@/components/atoms/Heading";
import { HotelImageForm } from "@/components/organisms/HotelImageForm";
import HotelService from "@/services/hotel.service";
import HotelImageService from "@/services/hotelImage.service";

export const dynamic = "force-dynamic";

export default async function EditHotelImagePage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const hotelsData = await HotelService.getNameId();
  const { id: idString } = await params;
  const id = Number(idString);
  const hotelImage = await HotelImageService.getById(id);

  const updateHotelImage = {
    caption: hotelImage?.caption ?? "",
    url: hotelImage?.url ?? "",
    hotelId: String(hotelImage?.hotelId) ?? "1",
  };

  return (
    <>
      <Heading text="Edit Hotel Image" href="/" />
      <HotelImageForm
        hotels={hotelsData.data}
        hotelImageId={id}
        initialData={updateHotelImage}
      />
    </>
  );
}
