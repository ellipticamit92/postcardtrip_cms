import { Heading } from "@/components/atoms/Heading";
import { HighlightForm } from "@/components/organisms/highlights/HighlightForm";
import { IEHForm } from "@/components/organisms/IEH/IEHForm";
import HighlightService from "@/services/highlight.service";
import IEHService from "@/services/ieh.service";

export const dynamic = "force-dynamic";

export default async function HighlightEditPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  const highlightData = await HighlightService.getById(id);
  let highlightId: number | undefined;
  if (highlightData && "hlid" in highlightData) {
    highlightId = highlightData.hlid;
  }

  const updateData = {
    title: highlightData?.title ?? "",
    category: highlightData?.category ?? "",
    destinationId: highlightData?.destinationId ?? 1,
  };
  return (
    <>
      <Heading text="Edit highlight" href="/" />
      <HighlightForm
        initialData={updateData}
        hlId={highlightId}
        destinations={[]}
      />
    </>
  );
}
