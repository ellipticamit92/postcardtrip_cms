import { Heading } from "@/components/atoms/Heading";
import { TourForm } from "@/components/organisms/tours/TourForm";

export const dynamic = "force-dynamic";

export default async function AddTourPage() {
  return (
    <>
      <Heading href="/" text="Create Tour" />
      <TourForm />
    </>
  );
}
