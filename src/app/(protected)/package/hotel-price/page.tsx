import { Heading } from "@/components/atoms/Heading";
import PackageHotelPriceService from "@/services/packageHotelPrice.service";

export default async function HotelPricePage() {
  const packagePriceData = await PackageHotelPriceService.getAll();
  const { data, pagination } = packagePriceData;

  return (
    <>
      <Heading text="All Packages" />
      {/* <PackagePriceTable data={[]} /> */}
    </>
  );
}
