import { Heading } from "@/components/atoms/Heading";
import { TourForm } from "@/components/organisms/TourForm";
import TourService from "@/services/tours.service";

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

  const updatedDestination = {
    text,
    description,
    icon,
    basePrice,
  };

  return (
    <>
      <Heading text="Edit Destination" subText={text} />
      <TourForm initialData={updatedDestination} tourId={id} />
    </>
  );
}
