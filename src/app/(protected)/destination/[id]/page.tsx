import { Heading } from "@/components/atoms/Heading";
import { DestinationForm } from "@/components/organisms/DestinationForm";
import DestinationService from "@/services/destination.service";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
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
  const trending = destination?.trending ?? false;
  const basePrice = destination?.basePrice ?? 0;
  const originalPrice = destination?.originalPrice ?? 0;
  const description = destination?.description ?? "";
  const text = destination?.text ?? "";
  const heroTitle = destination?.heroTitle ?? "";
  const rating = destination?.rating ?? "";

  const updatedDestination = {
    name,
    country,
    overview,
    imageUrl,
    heading,
    trending,
    basePrice,
    originalPrice,
    description,
    text,
    heroTitle,
    rating,
  };

  return (
    <>
      <Heading text="Edit Destination" subText={name} />
      <DestinationForm initialData={updatedDestination} destinationId={id} />
    </>
  );
}
