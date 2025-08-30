import { Heading } from "@/components/atoms/Heading";
import ItinerariesForm from "@/components/organisms/ItinerariesForm";
import CityService from "@/services/city.service";
import HighlightService from "@/services/highlight.service";
import PackageService from "@/services/package.service";

export default async function AddItinerariesage() {
  const packages = await PackageService.getNameId();
  const cityOptions = await CityService.getNameId();
  const hlOptions = await HighlightService.getNameId();
  return (
    <>
      <Heading text="Create Itineraries" />
      <ItinerariesForm
        packages={packages?.data}
        cityOptions={cityOptions.data}
        highlightOptions={hlOptions.data}
      />
    </>
  );
}
