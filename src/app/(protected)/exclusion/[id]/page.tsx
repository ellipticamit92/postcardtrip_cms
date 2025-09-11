import { Heading } from "@/components/atoms/Heading";
import { IEHForm } from "@/components/organisms/IEHForm";
import IEHService from "@/services/ieh.service";

export const dynamic = "force-dynamic";

export default async function ExclusionEditPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  const exclusionData = await IEHService.getByid(id, "exclusion");
  let exclusionId: number | undefined;
  if (exclusionData && "eid" in exclusionData) {
    exclusionId = exclusionData.eid;
  }

  const updateData = {
    text: exclusionData?.text ?? "",
  };
  return (
    <>
      <Heading text="Edit Exclusion" href="/" />
      <IEHForm type="exclusion" initialData={updateData} id={exclusionId} />
    </>
  );
}
