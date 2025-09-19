import { Heading } from "@/components/atoms/Heading";
import ItinerariesForm from "@/components/organisms/itineraries/ItinerariesForm";
import CityService from "@/services/city.service";
import HighlightService from "@/services/highlight.service";
import PackageService from "@/services/package.service";

export const dynamic = "force-dynamic";

export default async function AddItinerariesPage() {
  const packages = await PackageService.getNameId();
  const cityOptions = await CityService.getNameId();
  const hlOptions = await HighlightService.getNameId();
  return (
    <>
      <Heading text="Create Itineraries" href="/itineraries" />
      <ItinerariesForm
        packages={packages?.data}
        cityOptions={cityOptions.data}
        highlightOptions={hlOptions.data}
      />
    </>
  );
}
