import { Heading } from "@/components/atoms/Heading";
import { CityForm } from "@/components/organisms/city/CityForm";
import DestinationService from "@/services/destination.service";

export const dynamic = "force-dynamic";

export default async function AddCityPage() {
  const destinationsData = await DestinationService.getNameId();
  return (
    <>
      <Heading text="Add New City" href="/" />
      <CityForm destinations={destinationsData?.data} />
    </>
  );
}
