import { Heading } from "@/components/atoms/Heading";
import { TourForm } from "@/components/organisms/tours/TourForm";
import TourService from "@/services/tours.service";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const tour = await TourService.getById(id);
  const text = tour?.text ?? "";
  const description = tour?.description ?? "";
  const icon = tour?.icon ?? "";
  const basePrice = tour?.basePrice?.toString() ?? "0";

  const updateTour = {
    text,
    description,
    icon,
    basePrice,
  };

  return (
    <>
      <Heading text="Edit Tour" subText={text} href="/tour" Icon={Compass} />
      <TourForm initialData={updateTour} tourId={id} />
    </>
  );
}
