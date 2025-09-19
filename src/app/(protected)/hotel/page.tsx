import HotelTable from "@/components/organisms/hotel/HotelTable";
import PageHeader from "@/components/organisms/PageHeader";
import HotelService from "@/services/hotel.service";
import { Hotel } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HotelPage() {
  const hotelsData = await HotelService.getAll();

  return (
    <>
      <PageHeader
        title="Hotel"
        description="Manage hotel listings and accommodations"
        Icon={Hotel}
        href="/hotel/add"
      />
      <HotelTable data={hotelsData.data} />
    </>
  );
}
