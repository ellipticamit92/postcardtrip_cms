import { Heading } from "@/components/atoms/Heading";
import { CityForm } from "@/components/organisms/CityForm";
import { getDestinationDropdown } from "@/lib/helper";
import { getPaginationDestinations } from "@/services/destination.svc";

export default async function AddCityPage() {
  const destinationsData = await getPaginationDestinations({});
  const { destinations } = destinationsData;

  return (
    <>
      <Heading text="Create City" />
      <CityForm destinations={getDestinationDropdown(destinations)} />
    </>
  );
}
