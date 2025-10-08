import { Heading } from "@/components/atoms/Heading";
import { CityForm } from "@/components/organisms/city/CityForm";
import CityService from "@/services/city.service";
import DestinationService from "@/services/destination.service";

export const dynamic = "force-dynamic";

export default async function EditCityPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const cityData = await CityService.getById(id);
  const destinations = await DestinationService.getNameId();

  const updateCity = {
    name: cityData.name,
    description: cityData.description ?? "",
    imageUrl: cityData.imageUrl ?? "",
  };

  return (
    <>
      <Heading href="/" text="Create Tour" />
      <CityForm
        destinations={destinations.data}
        cityId={id}
        initialData={updateCity}
      />
    </>
  );
}
