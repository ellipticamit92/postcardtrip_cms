import { Heading } from "@/components/atoms/Heading";
import { TourForm } from "@/components/organisms/tours/TourForm";
import { Compass } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddTourPage() {
  return (
    <>
      <Heading
        text="Create Tour"
        href="/tour"
        Icon={Compass}
        subText="Add a new guided tour experience"
      />
      <TourForm />
    </>
  );
}
