import { Heading } from "@/components/atoms/Heading";
import PackagePriceTable from "@/components/organisms/PackagePriceTable";
import PackagePricesService from "@/services/packagePrices.service";

export default async function HotelPricePage() {
  const packagePriceData = await PackagePricesService.getAll();
  const { data, pagination } = packagePriceData;

  return (
    <>
      <Heading text="All Packages Prices" href="/" />
      <PackagePriceTable data={data} pagination={pagination} />
    </>
  );
}
