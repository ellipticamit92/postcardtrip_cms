import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";
import IEHService from "@/services/ieh.service";

export const dynamic = "force-dynamic";

export default async function InclusionEditPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  const inclusionData = await IEHService.getByid(id, "inclusion");
  let inclusionId: number | undefined;
  if (inclusionData && "lid" in inclusionData) {
    inclusionId = inclusionData.lid;
  }

  const updateData = {
    text: inclusionData?.text ?? "",
  };
  return (
    <>
      <Heading text="Edit Inclusion" href="/" />
      <IEHForm type="inclusion" initialData={updateData} id={inclusionId} />
    </>
  );
}
