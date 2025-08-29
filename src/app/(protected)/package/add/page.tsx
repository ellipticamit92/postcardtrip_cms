import { Heading } from "@/components/atoms/Heading";
import { PackageForm } from "@/components/organisms/PackageForm";
import DestinationService from "@/services/destination.service";
import TourService from "@/services/tours.service";

export default async function AddDestinationPage() {
  const destinationsData = await DestinationService.getNameId();
  const toursOptions = await TourService.getNameId();
  return (
    <>
      <Heading text="Create Package" />
      <PackageForm
        destinations={destinationsData.data}
        toursOptions={toursOptions.data}
      />
    </>
  );
}
