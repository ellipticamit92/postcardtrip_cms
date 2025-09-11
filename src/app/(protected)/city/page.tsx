import { Heading } from "@/components/atoms/Heading";
import CityTable from "@/components/organisms/CityTable";
import cityService from "@/services/city.service";

export const dynamic = "force-dynamic";

export default async function CityPage() {
  const cityData = await cityService.getAll();

  return (
    <>
      <Heading text="All Cities" href="/" />
      <CityTable data={cityData?.data ?? []} />
    </>
  );
}
