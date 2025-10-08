import { Heading } from "@/components/atoms/Heading";

export const dynamic = "force-dynamic";

export default async function AddItinerariesPage() {
  // const packages = await PackageService.getNameId();
  // const hlOptions = await HighlightService.getNameId();
  // const hlValueOtions = await HighlightService.getNameValue();
  // const cityOptions = await CityService.getNameValue();

  return (
    <>
      <Heading text="Create Itineraries" href="/itineraries" />
      <div className="p-2 bg-white">
        {/* <ItinerariesForm
          packages={packages?.data}
          cityOptions={cityOptions.data}
          highlightOptions={hlOptions.data}
          hiValueOptions={hlValueOtions.data}
        /> */}
      </div>
    </>
  );
}
