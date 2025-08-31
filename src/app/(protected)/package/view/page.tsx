import { DestinationService } from "@/services/destination.service";
import APIViewer from "@/components/atoms/APIViewer";

export const dynamic = "force-dynamic";

export default async function PackageViewPage() {
  const options = {
    include: false,
  };
  const destinationsData = await DestinationService.getAll(options);
  const { data } = destinationsData;

  return <APIViewer data={data} name="Destination" />;
}
