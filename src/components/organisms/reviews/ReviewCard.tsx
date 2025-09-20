"use client";
import { Button } from "@/components/ui/button";
import { getInitials, truncateText } from "@/lib/helper";
import { ReviewsWithPackageDestination } from "@/types/form/type";
import { CheckCircle, Edit, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import DeleteData from "../DeleteData";

interface ReviewCardProps {
  review: ReviewsWithPackageDestination;
}

const ReviewCard: FC<ReviewCardProps> = ({ review }) => {
  return (
    <>
      <div className="postcard h-64 bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
        <div className="absolute top-1 right-1 w-12 h-12 flex items-center justify-center">
          <Image
            src="/stamp.png"
            alt="Stamp"
            width={24}
            height={24}
            className="-rotate-6"
          />
        </div>
        <div className="absolute top-4 left-3 w-12 h-12 border-2 border-gray-400 rounded-full opacity-30 flex items-center justify-center">
          <div className="text-[8px] text-gray-600 font-mono text-center leading-tight">
            {/* {review.date.split(" ")[0]} */} September
            <br />
            {/* {review.date.split(" ")[1]} */} 2024
          </div>
        </div>
        <div className="p-6 pt-10 pb-2">
          {/* Address Section */}
          <div className="mb-1 text-right">
            <div className="text-[10px] text-gray-600 font-mono">TO:</div>
            <div className="text-[10px] font-semibold text-foreground">
              {review.username}
            </div>
            <div className="text-[9px] text-muted-foreground">
              {/* {review.location} */}
              {review?.destination?.name}, {review?.destination?.country}
            </div>
          </div>
          <div className="border-l-2 border-dashed border-gray-300 absolute left-1/2 top-12 bottom-4 transform -translate-x-1/2"></div>
          {/* Message Section */}
          <div className="pt-0">
            <div className="flex items-center gap-1 mb-3">
              {/* {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))} */}
            </div>

            <p className="text-[12px] text-gray-700 mb-4 leading-relaxed font-medium italic">
              &quot;{truncateText(review.review, 100)}&quot;
            </p>

            {/* Travel Package Tag */}
            <div className="mb-4">
              <span className="text-[13px] bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {review?.package?.name}
              </span>
            </div>

            {/* Signature & Verification */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-white font-bold text-[9px]">
                  {/* {review.avatar} */}
                  {getInitials(review.username)}
                </div>
                <div className="text-[14px] text-gray-600">
                  <div className="font-medium ">
                    — {review.username.split(" ")[0]}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1 ">
          <Link href={`/reviews/${review.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteData id={String(review.id)} model="reviews" isIcon />
        </div>
      </div>
    </>
  );
};

export default ReviewCard;
