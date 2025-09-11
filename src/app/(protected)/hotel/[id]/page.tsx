import { Heading } from "@/components/atoms/Heading";
import DestinationService from "@/services/destination.service";

export const dynamic = "force-dynamic";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const destination = await DestinationService.getById(id);
  const name = destination?.name ?? "";

  return (
    <>
      <Heading text="Edit Hotel" subText={name} href="/" />
    </>
  );
}
