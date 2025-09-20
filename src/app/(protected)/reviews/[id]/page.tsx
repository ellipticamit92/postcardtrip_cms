import { Heading } from "@/components/atoms/Heading";
import { ReviewForm } from "@/components/organisms/reviews/ReviewsForm";
import DestinationService from "@/services/destination.service";
import PackageService from "@/services/package.service";
import ReviewService from "@/services/reviews.service";

export const dynamic = "force-dynamic";

const EditReviewPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: idString } = await params;
  const id = Number(idString);

  const reviews = await ReviewService.getById(id);
  const destinations = await DestinationService.getNameId();
  const packages = await PackageService.getNameId();

  const updateData = {
    username: reviews.username ?? "",
    places: reviews.places ?? "",
    review: reviews.review ?? "",
    rating: reviews.rating ?? 1,
    packageId: String(reviews.packageId),
    destinationId: String(reviews.destinationId),
  };

  return (
    <>
      <Heading text="Edit Reviews" href="/reviews" />
      <ReviewForm
        destinations={destinations?.data}
        packages={packages?.data}
        reviewId={idString}
        initialData={updateData}
      />
    </>
  );
};

export default EditReviewPage;
