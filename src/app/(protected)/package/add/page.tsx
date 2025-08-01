import { Heading } from "@/components/atoms/Heading";
import { DestinationForm } from "@/components/organisms/DestinationForm";

export default async function AddPackagePage() {
  return (
    <>
      <Heading text="Create Package" />
      <DestinationForm />
    </>
  );
}
