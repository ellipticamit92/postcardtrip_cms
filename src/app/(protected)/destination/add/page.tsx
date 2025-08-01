import { DestinationForm } from "@/components/organisms/DestinationForm";

export default async function AddDestinationPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Create Destination</h1>
      <DestinationForm />
    </>
  );
}
