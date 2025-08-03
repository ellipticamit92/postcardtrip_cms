import { Heading } from "@/components/atoms/Heading";
import { HotelImageForm } from "@/components/organisms/HotelImageForm";

export default async function AddDestinationPage() {
  return (
    <>
      <Heading text="Add Hotel Image" />
      <HotelImageForm />
    </>
  );
}
