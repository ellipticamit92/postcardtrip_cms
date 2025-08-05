import { Heading } from "@/components/atoms/Heading";
import { CityForm } from "@/components/organisms/CityForm";
import DestinationService from "@/services/destination.service";

export default async function AddCityPage() {
  const destinationsData = await DestinationService.getNameId();
  return (
    <>
      <Heading text="Add New City" />
      <CityForm destinations={destinationsData?.data} />
    </>
  );
}
