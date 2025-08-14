import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";

export default async function ExclusionAddPage() {
  return (
    <>
      <Heading text="Add Exclusion" />
      <IEHForm type="exclusion" />
    </>
  );
}
