import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";

export default async function AddHighlightPage() {
  return (
    <>
      <Heading text="Add Highlight" />
      <IEHForm type="highlight" />
    </>
  );
}
