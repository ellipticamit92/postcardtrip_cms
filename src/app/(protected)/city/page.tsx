import { Heading } from "@/components/atoms/Heading";
import CityTable from "@/components/organisms/CityTable";
import { cityService } from "@/services/city.svc";

export default async function CityPage() {
  const cityData = await cityService.getAllCities();
  return (
    <>
      <Heading text="All Cities" />
      <CityTable data={cityData?.data ?? []} />
    </>
  );
}
