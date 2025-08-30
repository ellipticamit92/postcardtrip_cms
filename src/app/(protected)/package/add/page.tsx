import { Heading } from "@/components/atoms/Heading";
import { PackageForm } from "@/components/organisms/PackageForm";
import CityService from "@/services/city.service";
import DestinationService from "@/services/destination.service";
import ExclusionService from "@/services/exclusion.service";
import HighlightService from "@/services/highlight.service";
import InclusionService from "@/services/inclusion.service";
import TourService from "@/services/tours.service";

export default async function AddDestinationPage() {
  const destinationsData = await DestinationService.getNameId();
  const toursOptions = await TourService.getNameId();
  const cityOptions = await CityService.getNameId();
  const hlOptions = await HighlightService.getNameId();
  const inclusionOptions = await InclusionService.getNameId();
  const exclusionOptions = await ExclusionService.getNameId();

  return (
    <>
      <Heading text="Create Package" />
      <PackageForm
        destinations={destinationsData.data}
        toursOptions={toursOptions.data}
        cityOptions={cityOptions.data}
        highlightOptions={hlOptions.data}
        inclusionOptions={inclusionOptions.data}
        exclusionOptions={exclusionOptions.data}
      />
    </>
  );
}
