import { Heading } from "@/components/atoms/Heading";
import { getDestinationById } from "@/services/destination.svc";
import { DestinationForm } from "@/components/organisms/DestinationForm";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const destination = await getDestinationById(id);
  const name = destination?.name ?? "";
  const country = destination?.country ?? "";
  const overview = destination?.overview ?? "";
  const imageUrl = destination?.imageUrl ?? "";

  const updatedDestination = {
    name,
    country,
    overview,
    imageUrl,
  };

  return (
    <>
      <Heading text="Edit Destination" subText={name} />
      <DestinationForm initialData={updatedDestination} id={id} />
    </>
  );
}
