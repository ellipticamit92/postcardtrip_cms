import { Heading } from "@/components/atoms/Heading";
import { TourForm } from "@/components/organisms/TourForm";

export const dynamic = "force-dynamic";

export default async function AddTourPage() {
  return (
    <>
      <Heading text="Create Tour" />
      <TourForm />
    </>
  );
}
