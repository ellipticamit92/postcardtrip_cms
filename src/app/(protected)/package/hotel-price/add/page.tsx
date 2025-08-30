import { Heading } from "@/components/atoms/Heading";
import { PackagePriceForm } from "@/components/organisms/PackagePriceForm";
import HotelService from "@/services/hotel.service";
import PackageService from "@/services/package.service";

export default async function AddHotelPricePage() {
  const hotelData = await HotelService.getNameId();
  const packagesData = await PackageService.getNameId();

  return (
    <>
      <Heading text="Add Package Price" />
      <PackagePriceForm
        hotelData={hotelData.data}
        packageData={packagesData.data}
      />
    </>
  );
}
