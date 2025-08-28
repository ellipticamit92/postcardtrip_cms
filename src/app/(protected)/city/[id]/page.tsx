import { Heading } from "@/components/atoms/Heading";
import { CityForm } from "@/components/organisms/CityForm";
import CityService from "@/services/city.service";
import DestinationService from "@/services/destination.service";

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const destinationsData = await DestinationService.getNameId();
  const { id: idString } = await params;
  const id = Number(idString);
  const cityData = await CityService.getById(id);

  console.log("cityData DATA", cityData);

  const updateCity = {
    name: cityData?.name ?? "",
    description: cityData?.description ?? "",
    destinationId: cityData?.destinationId.toString() ?? "",
    imageUrl: cityData?.imageUrl ?? "",
  };

  return (
    <>
      <Heading text="Add New City" />
      <CityForm
        destinations={destinationsData?.data}
        initialData={updateCity}
        cityId={id}
      />
    </>
  );
}
