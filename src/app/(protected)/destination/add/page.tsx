import { Heading } from "@/components/atoms/Heading";
import { DestinationForm } from "@/components/organisms/destinations/DestinationForm";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddDestinationPage() {
  return (
    <>
      <Heading text="Create Destination" href="/destination" Icon={MapPin} />
      <DestinationForm />
    </>
  );
}
