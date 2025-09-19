import { Heading } from "@/components/atoms/Heading";
import { PackageForm } from "@/components/organisms/packages/PackageForm";
import CityService from "@/services/city.service";
import DestinationService from "@/services/destination.service";
import ExclusionService from "@/services/exclusion.service";
import HighlightService from "@/services/highlight.service";
import InclusionService from "@/services/inclusion.service";
import PackageService from "@/services/package.service";
import TourService from "@/services/tours.service";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const destinationsData = await DestinationService.getNameId();
  const packages = await PackageService.getById(id);

  const name = packages?.name ?? "";

  const updatePackage = {
    name: packages?.name ?? "",
    day: packages?.day ?? 1,
    night: packages?.night ?? 1,
    destinationId: packages?.destinationId.toString() ?? "",
    imageUrl: packages?.imageUrl ?? "",
    description: packages?.description ?? "",
    popular: packages?.popular ?? false,
    basePrice: packages?.basePrice ?? 0,
    originalPrice: packages?.originalPrice ?? 0,
    threePrice: packages?.threePrice ?? 0,
    fourPrice: packages?.fourPrice ?? 0,
    fivePrice: packages?.fivePrice ?? 0,
    overview: packages?.overview ?? "",
    featured: packages?.featured ?? false,
    herorTitle: packages?.heroTitle ?? "",
    text: packages?.text ?? "",
    rating: packages?.rating ?? "1.0",
    tours:
      (packages as any)?.tours?.map((tour: { tid: number }) => tour.tid) ?? [],
    cities:
      (packages as any)?.cities?.map((city: { cid: number }) => city.cid) ?? [],
    inclusions:
      (packages as any)?.inclusions?.map(
        (inclusion: { lid: number }) => inclusion.lid
      ) ?? [],
    exclusions:
      (packages as any)?.exclusions?.map(
        (exclusion: { eid: number }) => exclusion.eid
      ) ?? [],
    highlights:
      (packages as any)?.highlights?.map(
        (highlight: { hlid: number }) => highlight.hlid
      ) ?? [],
  };
  const toursOptions = await TourService.getNameId();
  const cityOptions = await CityService.getNameId();
  const hlOptions = await HighlightService.getNameId();
  const inclusionOptions = await InclusionService.getNameId();
  const exclusionOptions = await ExclusionService.getNameId();

  return (
    <>
      <Heading text="Edit Package" subText={name} href="/" />
      <PackageForm
        initialData={updatePackage}
        PackageId={id}
        destinations={destinationsData.data}
        toursOptions={toursOptions.data}
        cityOptions={cityOptions?.data}
        highlightOptions={hlOptions.data}
        inclusionOptions={inclusionOptions.data}
        exclusionOptions={exclusionOptions.data}
      />
    </>
  );
}
