import { Heading } from "@/components/atoms/Heading";

export const dynamic = "force-dynamic";

export default async function EditItinerariesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const { id: idString } = await params;
  // const id = Number(idString);

  // const itiData = await ItineraryService.getById(id);

  return (
    <>
      <Heading text="Edit Itineraries" href="/itineraries" />
      {/* <div className="p-2 bg-white">
        <ItinerariesForm
          itineraryId={id}
          initialData={updateItinerary}
          packageId={updateItinerary.packageId}
          days={updateItinerary.days}
        />
      </div> */}
    </>
  );
}
