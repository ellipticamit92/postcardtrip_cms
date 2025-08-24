import { DestinationService } from "@/services/destination.service";
import APIViewer from "@/components/atoms/APIViewer";

export default async function DestinationViewPage() {
  const options = {
    include: false,
  };
  const destinationsData = await DestinationService.getAll(options);
  const { data } = destinationsData;

  return <APIViewer data={data} name="Destination" />;
}
