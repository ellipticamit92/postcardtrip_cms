import { Heading } from "@/components/atoms/Heading";
import { PackageForm } from "@/components/organisms/PackageForm";
import DestinationService from "@/services/destination.service";
import PackageService from "@/services/package.service";

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
    day: packages?.day?.toString() ?? "",
    night: packages?.night?.toString() ?? "",
    destinationId: packages?.destinationId.toString() ?? "",
    imageUrl: packages?.imageUrl ?? "",
    basePrice: packages?.basePrice?.toString() ?? "",
    description: packages?.description ?? "",
    popular: packages?.popular ?? false,
    tourType: packages?.tourType ?? "",
  };

  console.log("updatePackage", packages);

  return (
    <>
      <Heading text="Edit Package" subText={name} />
      <PackageForm
        initialData={updatePackage}
        PackageId={id}
        destinations={destinationsData.data}
      />
    </>
  );
}
