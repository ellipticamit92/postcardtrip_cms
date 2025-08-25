import { Heading } from "@/components/atoms/Heading";
import { DestinationForm } from "@/components/organisms/DestinationForm";
import DestinationService from "@/services/destination.service";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const destination = await DestinationService.getById(id);
  const name = destination?.name ?? "";
  const country = destination?.country ?? "";
  const overview = destination?.overview ?? "";
  const imageUrl = destination?.imageUrl ?? "";
  const heading = destination?.heading ?? "";

  const updatedDestination = {
    name,
    country,
    overview,
    imageUrl,
    heading,
  };

  return (
    <>
      <Heading text="Edit Destination" subText={name} />
      <DestinationForm initialData={updatedDestination} destinationId={id} />
    </>
  );
}
