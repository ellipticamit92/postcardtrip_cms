import PageHeader from "@/components/organisms/PageHeader";
import ReviewsTable from "@/components/organisms/reviews/ReviewsTable";
import ViewLayout from "@/components/templates/ViewLayout";
import ReviewService from "@/services/reviews.service";
import { PencilIcon } from "lucide-react";

export const dynamic = "force-dynamic";

const ReviewsPage = async () => {
  const reviewData = await ReviewService.getAll();
  const { data, pagination } = reviewData;

  return (
    <>
      <PageHeader
        title="Reviews"
        description="Manage user travel reviews"
        Icon={PencilIcon}
        href="/reviews/add"
      />
      <ViewLayout
        data={data ?? []}
        pagination={pagination}
        filterKey={"username"}
        GridComponent={ReviewsTable}
        ListComponent={ReviewsTable}
        TableComponent={ReviewsTable}
      />
    </>
  );
};

export default ReviewsPage;
