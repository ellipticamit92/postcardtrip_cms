"use client";

import { ReviewsTableProps } from "@/types/form/type";
import ReviewCard from "./ReviewCard";
import { FC } from "react";
import Pagination from "@/components/molecules/Pagination";

const ReviewsGrid: FC<ReviewsTableProps> = ({ data, pagination }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {data.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      <div className="sticky bottom-0 w-full flex items-end justify-end mt-4 p-2 bg-white shadow-lg">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
        />
      </div>
    </>
  );
};

export default ReviewsGrid;
