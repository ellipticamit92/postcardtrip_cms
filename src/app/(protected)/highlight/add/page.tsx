import { Heading } from "@/components/atoms/Heading";
import { HighlightForm } from "@/components/organisms/highlights/HighlightForm";
import DestinationService from "@/services/destination.service";
import { Siren } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddHighlightPage() {
  const destinations = await DestinationService.getNameId();
  return (
    <>
      <Heading text="Add Highlight" href="/" Icon={Siren} />
      <HighlightForm destinations={destinations.data} />
    </>
  );
}
