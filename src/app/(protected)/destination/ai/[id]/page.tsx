import { Heading } from "@/components/atoms/Heading";
import { DestinationAIForm } from "@/components/organisms/destinations/DestinationAIForm";
import DestinationService from "@/services/destination.service";

export const dynamic = "force-dynamic";

export default async function EditAIDestinationPage({
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
  const text = destination?.text ?? "";
  const heroTitle = destination?.heroTitle ?? "";
  const rating = destination?.rating ?? 0;
  const featured = destination?.featured ?? false;
  const status = destination?.status ?? false;
  const isRichText = destination?.isRichText ?? false;
  const bestTimeToVisit = destination?.bestTimeToVisit ?? "";
  const highlights = destination?.highlights ?? "";

  const updatedDestination = {
    name,
    country,
    overview,
    imageUrl,
    heading,
    trending,
    basePrice,
    originalPrice,
    text,
    heroTitle,
    rating,
    featured,
    status,
    isRichText,
    bestTimeToVisit,
    highlights,
  };

  return (
    <>
      <Heading text="AI Edit Destination" subText={name} href="/destination" />

      <DestinationAIForm
        destName={name}
        destData={updatedDestination}
        destinationId={id}
      />
    </>
  );
}
