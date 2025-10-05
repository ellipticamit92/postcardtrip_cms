import { Heading } from "@/components/atoms/Heading";
import { HighlightAIForm } from "@/components/organisms/highlights/HighlightAIForm";
import DestinationService from "@/services/destination.service";
import { Building } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddAIHighlightPage() {
  const destinationsData = await DestinationService.getNameId(true);
  return (
    <>
      <Heading
        text="Add new Highlights"
        href="/highlight"
        subText="Manage Highligts"
        Icon={Building}
      />
      <HighlightAIForm destinations={destinationsData?.data} />
    </>
  );
}
