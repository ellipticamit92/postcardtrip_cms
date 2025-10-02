import { Heading } from "@/components/atoms/Heading";
import { PackageAIForm } from "@/components/organisms/packages/PackageAIForm";
import CityService from "@/services/city.service";
import DestinationService from "@/services/destination.service";
import ExclusionService from "@/services/exclusion.service";
import HighlightService from "@/services/highlight.service";
import InclusionService from "@/services/inclusion.service";
import PackageService from "@/services/package.service";
import TourService from "@/services/tours.service";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditAIPakcagePage({
  params,
}: {
  params: Promise<{ id: string }>; // Note: params is now a Promise
}) {
  const { id: idString } = await params;
  const id = Number(idString);
  const destinationOptions = await DestinationService.getNameId();
  const packages = await PackageService.getById(id);

  const name = packages?.name ?? "";
  const updatePackage = {
    name: packages?.name ?? "",
    day: packages?.day ?? 1,
    night: packages?.night ?? 1,
    destinationId: packages?.destinationId,
    imageUrl: packages?.imageUrl ?? "",
    threePrice: packages?.threePrice ?? 0,
    fourPrice: packages?.fourPrice ?? 0,
    fivePrice: packages?.fivePrice ?? 0,
    overview: packages?.overview ?? "",
    heroTitle: packages?.heroTitle ?? "",
    text: packages?.text ?? "",
    rating: packages?.rating ?? 1,
    status: !!packages.status,
    isRichText: !!packages?.isRichText,
    popular: !!packages?.popular,
    featured: !!packages?.featured,
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
      <Heading text="Update AI Package" href="/package" Icon={Package} />
      <PackageAIForm
        destinations={destinationOptions.data}
        toursOptions={toursOptions.data}
        cityOptions={cityOptions.data}
        highlightOptions={hlOptions.data}
        inclusionOptions={inclusionOptions.data}
        exclusionOptions={exclusionOptions.data}
        initialData={updatePackage}
        packageId={id}
      />
    </>
  );
}
