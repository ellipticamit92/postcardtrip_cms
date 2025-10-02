import { Heading } from "@/components/atoms/Heading";
import { PackageAIForm } from "@/components/organisms/packages/PackageAIForm";
import CityService from "@/services/city.service";
import DestinationService from "@/services/destination.service";
import ExclusionService from "@/services/exclusion.service";
import HighlightService from "@/services/highlight.service";
import InclusionService from "@/services/inclusion.service";
import TourService from "@/services/tours.service";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddAIPakcagePage() {
  const destinationOptions = await DestinationService.getNameId();
  const toursOptions = await TourService.getNameId();
  const cityOptions = await CityService.getNameId();
  const hlOptions = await HighlightService.getNameId();
  const inclusionOptions = await InclusionService.getNameId();
  const exclusionOptions = await ExclusionService.getNameId();
  return (
    <>
      <Heading text="Create Package" href="/package" Icon={Package} />
      <PackageAIForm
        destinations={destinationOptions.data}
        toursOptions={toursOptions.data}
        cityOptions={cityOptions.data}
        highlightOptions={hlOptions.data}
        inclusionOptions={inclusionOptions.data}
        exclusionOptions={exclusionOptions.data}
      />
    </>
  );
}
