import { Heading } from "@/components/atoms/Heading";
import { HotelForm } from "@/components/organisms/HotelForm";
import CityService from "@/services/city.service";

export const dynamic = "force-dynamic";

export default async function AddCityPage() {
  const citits = await CityService.getNameId();

  return (
    <>
      <Heading text="Add New Hotel" href="/" />
      <HotelForm cities={citits.data} />
    </>
  );
}
