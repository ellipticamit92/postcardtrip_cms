import { Heading } from "@/components/atoms/Heading";
import { DestinationAIForm } from "@/components/organisms/destinations/DestinationAIForm";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddDestinationPage() {
  return (
    <>
      <Heading text="Create Destination" href="/destination" Icon={MapPin} />
      <DestinationAIForm />
    </>
  );
}
