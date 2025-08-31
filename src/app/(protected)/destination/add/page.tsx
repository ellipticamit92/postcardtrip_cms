import { Heading } from "@/components/atoms/Heading";
import { DestinationForm } from "@/components/organisms/DestinationForm";

export const dynamic = "force-dynamic";

export default async function AddDestinationPage() {
  return (
    <>
      <Heading text="Create Destination" />
      <DestinationForm />
    </>
  );
}
