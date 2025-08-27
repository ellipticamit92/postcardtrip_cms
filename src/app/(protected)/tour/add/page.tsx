import { Heading } from "@/components/atoms/Heading";
import { TourForm } from "@/components/organisms/TourForm";

export default async function AddTourPage() {
  return (
    <>
      <Heading text="Create Tour" />
      <TourForm />
    </>
  );
}
