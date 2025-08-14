import { Heading } from "@/components/atoms/Heading";
import ItinerariesForm from "@/components/organisms/ItinerariesForm";
import PackageService from "@/services/package.service";

export default async function AddItinerariesage() {
  const packages = await PackageService.getNameId();
  return (
    <>
      <Heading text="Create Itineraries" />
      <ItinerariesForm packages={packages?.data} />
    </>
  );
}
