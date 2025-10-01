import { Heading } from "@/components/atoms/Heading";
import { PackageAIForm } from "@/components/organisms/packages/PackageAIForm";
import DestinationService from "@/services/destination.service";
import TourService from "@/services/tours.service";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddAIPakcagePage() {
  const destinationOptions = await DestinationService.getNameId();
  const toursOptions = await TourService.getNameId();
  return (
    <>
      <Heading text="Create Package" href="/package" Icon={Package} />
      <PackageAIForm
        destinations={destinationOptions.data}
        toursOptions={toursOptions.data}
      />
    </>
  );
}
