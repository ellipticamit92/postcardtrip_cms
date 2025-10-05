import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEH/IEHForm";
import { Siren } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddHighlightPage() {
  return (
    <>
      <Heading text="Add Highlight" href="/" Icon={Siren} />
      <IEHForm type="highlight" />
    </>
  );
}
