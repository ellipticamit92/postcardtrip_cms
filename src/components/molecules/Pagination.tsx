"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  limit?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));

    // 🔥 Start progress bar before navigating
    NProgress.start();

    router.push(`?${params.toString()}`);

    // Fallback to stop progress bar (in case route is cached/instant)
    setTimeout(() => {
      NProgress.done();
    }, 2500);
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-3 bg-white shadow-sm rounded-lg border w-fit mx-auto">
      {/* Prev Button */}
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrev}
        variant="outline"
        size="sm"
        className="rounded-full"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => goToPage(page)}
            size="sm"
            variant="ghost"
            className={cn(
              "rounded-full w-8 h-8",
              page === currentPage
                ? "bg-blue-500 text-white font-semibold hover:bg-blue-600"
                : "hover:bg-destructive"
            )}
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNext}
        variant="outline"
        size="sm"
        className="rounded-full"
      >
        Next <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
