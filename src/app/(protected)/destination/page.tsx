import { DestinationForm } from "@/components/organisms/DestinationForm";
import { DestinationTable } from "@/components/organisms/DestinationTable";
import { getAllDestinations } from "@/services/destination.svc";

export default async function DestinationPage() {
  const destinations = await getAllDestinations();

  console.log("Destination = ", destinations);

  return (
    <div className="py-10 space-y-6">
      <h1 className="text-2xl font-bold">Create Destination</h1>
      <DestinationForm />
      <h2 className="text-xl font-semibold">All Destinations</h2>
      <DestinationTable tableData={destinations} />
    </div>
  );
}
