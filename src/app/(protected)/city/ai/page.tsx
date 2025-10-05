import { Heading } from "@/components/atoms/Heading";
import { CityAIForm } from "@/components/organisms/city/CityAIForm";
import DestinationService from "@/services/destination.service";
import { Building } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddAICityPage() {
  const destinationsData = await DestinationService.getNameValue();
  return (
    <>
      <Heading
        text="Add New City"
        href="/city"
        subText="Manage city"
        Icon={Building}
      />
      <CityAIForm destinations={destinationsData?.data} />
    </>
  );
}
