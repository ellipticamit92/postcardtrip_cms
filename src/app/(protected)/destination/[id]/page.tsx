import { DestinationForm } from "@/components/organisms/DestinationForm";

async function getDestination(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/destination/${id}`
  );
  return res.json();
}

export default async function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = await getDestination(params.id);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
      <DestinationForm initialData={destination} />
    </div>
  );
}
