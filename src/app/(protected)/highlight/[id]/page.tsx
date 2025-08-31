import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";
import IEHService from "@/services/ieh.service";

export const dynamic = "force-dynamic";

export default async function HighlightEditPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  const highlightData = await IEHService.getByid(id, "highlight");
  let highlightId: number | undefined;
  if (highlightData && "hlid" in highlightData) {
    highlightId = highlightData.hlid;
  }

  const updateData = {
    text: highlightData?.text ?? "",
  };
  return (
    <>
      <Heading text="Edit highlight" />
      <IEHForm type="highlight" initialData={updateData} id={highlightId} />
    </>
  );
}
