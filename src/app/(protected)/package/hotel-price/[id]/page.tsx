import { Heading } from "@/components/atoms/Heading";
import { PackagePriceForm } from "@/components/organisms/PackagePriceForm";
import HotelService from "@/services/hotel.service";
import PackageService from "@/services/package.service";
import PackagePricesService from "@/services/packagePrices.service";

export default async function EditHotelPricePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idString } = await params;
  const id = Number(idString);

  const packagePriceData = await PackagePricesService.getById(id);

  const updatePackagePrice = {
    basePrice: Number(packagePriceData?.basePrice ?? 0),
    originalPrice: Number(packagePriceData?.originalPrice ?? 0),
    hotelId: String(packagePriceData?.hotelId) ?? "",
    packageId: String(packagePriceData?.packageId) ?? "",
  };

  const hotelData = await HotelService.getNameId();
  const packagesData = await PackageService.getNameId();

  return (
    <>
      <Heading text="Add Package Price" href="/" />
      <PackagePriceForm
        initialData={updatePackagePrice}
        hotelData={hotelData.data}
        packageData={packagesData.data}
        packagePriceId={id}
      />
    </>
  );
}
