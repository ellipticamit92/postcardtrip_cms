import { Heading } from "@/components/atoms/Heading";
import { HotelForm } from "@/components/organisms/hotel/HotelForm";
import CityService from "@/services/city.service";
import { Hotel } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddCityPage() {
  const citits = await CityService.getNameId();

  return (
    <>
      <Heading
        text="Add New Hotel"
        href="/hotel"
        Icon={Hotel}
        subText="Add a new hotel to your listings"
      />
      <HotelForm cities={citits.data} />
    </>
  );
}
