import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";

export default async function InclusionAddPage() {
  return (
    <>
      <Heading text="Add Inclusion" />
      <IEHForm type="inclusion" />
    </>
  );
}
