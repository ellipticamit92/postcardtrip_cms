import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";

export const dynamic = "force-dynamic";

export default async function AddHighlightPage() {
  return (
    <>
      <Heading text="Add Highlight" href="/" />
      <IEHForm type="highlight" />
    </>
  );
}
