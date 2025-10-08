import { Heading } from "@/components/atoms/Heading";
import ItinerariesAIForm from "@/components/organisms/itineraries/ItinerariesAIForm";
import PackageService from "@/services/package.service";
import { Map } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddAIItineraryPage() {
  const packages = await PackageService.getNameId();
  return (
    <>
      <Heading text="Create AI Itineraries" href="/itineraries" Icon={Map} />
      <ItinerariesAIForm packages={packages.data} />
    </>
  );
}
