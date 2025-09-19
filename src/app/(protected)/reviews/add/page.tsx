import { Heading } from "@/components/atoms/Heading";
import { ReviewForm } from "@/components/organisms/reviews/ReviewsForm";
import DestinationService from "@/services/destination.service";
import PackageService from "@/services/package.service";
import { PencilIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const AddReviewPage = async () => {
  const destinations = await DestinationService.getNameId();
  const packages = await PackageService.getNameId();
  return (
    <>
      <Heading text="Add Reviews" href="/reviews" Icon={PencilIcon} />
      <ReviewForm destinations={destinations?.data} packages={packages?.data} />
    </>
  );
};

export default AddReviewPage;
