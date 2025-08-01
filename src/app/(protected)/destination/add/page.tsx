import { Heading } from "@/components/atoms/Heading";
import { DestinationForm } from "@/components/organisms/DestinationForm";

export default async function AddDestinationPage() {
  return (
    <>
      <Heading text="Create Destination" />
      <DestinationForm />
    </>
  );
}
