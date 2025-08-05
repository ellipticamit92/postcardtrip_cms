import { Heading } from "@/components/atoms/Heading";
import { HotelForm } from "@/components/organisms/HotelForm";
import DestinationService from "@/services/destination.service";

export default async function AddCityPage() {
  const destinationsData = await DestinationService.getNameId();
  return (
    <>
      <Heading text="Add New Hotel" />
      <HotelForm cities={[]} />
    </>
  );
}
