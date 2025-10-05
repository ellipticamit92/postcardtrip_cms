import { Heading } from "@/components/atoms/Heading";
import ItinerariesForm, {
  DaySchemaData,
} from "@/components/organisms/itineraries/ItinerariesForm";
import CityService from "@/services/city.service";
import HighlightService from "@/services/highlight.service";
import ItineraryService from "@/services/itinerary.service";
import PackageService from "@/services/package.service";

export const dynamic = "force-dynamic";

export default async function EditItinerariesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  const itiData = await ItineraryService.getById(id);
  const packages = await PackageService.getNameId();
  const hlOptions = await HighlightService.getNameId();
  const hlValueOtions = await HighlightService.getNameValue();
  const cityOptions = await CityService.getNameValue();

  const updateItinerary = {
    title: itiData?.title ?? "",
    packageId: itiData?.packageId,
    days:
      (itiData?.day as {
        day: number;
        title: string;
        details: string;
        subTitle?: string;
        highlights?: string[];
        cities?: string[];
      }[]) ?? [],
    highlights:
      (itiData as any)?.highlights?.map(
        (highlight: { hlid: number }) => highlight.hlid
      ) ?? [],
  };

  return (
    <>
      <Heading text="Edit Itineraries" href="/itineraries" />
      <div className="p-2 bg-white">
        <ItinerariesForm
          packages={packages?.data}
          cityOptions={cityOptions.data}
          highlightOptions={hlOptions.data}
          itineraryId={id}
          initialData={updateItinerary}
          hiValueOptions={hlValueOtions.data}
        />
      </div>
    </>
  );
}
