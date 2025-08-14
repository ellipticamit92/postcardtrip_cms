import { Heading } from "@/components/atoms/Heading";
import { HotelForm } from "@/components/organisms/HotelForm";
import CityService from "@/services/city.service";

export default async function AddCityPage() {
  const citits = await CityService.getNameId();
  return (
    <>
      <Heading text="Add New Hotel" />
      <HotelForm cities={citits.data} />
    </>
  );
}
