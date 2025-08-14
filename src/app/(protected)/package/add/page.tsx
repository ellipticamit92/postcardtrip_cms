import { Heading } from "@/components/atoms/Heading";
import { PackageForm } from "@/components/organisms/PackageForm";
import DestinationService from "@/services/destination.service";

export default async function AddDestinationPage() {
  const destinationsData = await DestinationService.getNameId();
  return (
    <>
      <Heading text="Create Package" />
      <PackageForm destinations={destinationsData.data} />
    </>
  );
}
