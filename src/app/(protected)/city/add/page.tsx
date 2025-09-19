import { Heading } from "@/components/atoms/Heading";
import { CityForm } from "@/components/organisms/city/CityForm";
import DestinationService from "@/services/destination.service";
import { Building } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddCityPage() {
  const destinationsData = await DestinationService.getNameId();
  return (
    <>
      <Heading
        text="Add New City"
        href="/city"
        subText="Manage city"
        Icon={Building}
      />
      <CityForm destinations={destinationsData?.data} />
    </>
  );
}
