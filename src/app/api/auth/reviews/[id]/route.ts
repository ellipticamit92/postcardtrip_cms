import ReviewService from "@/services/reviews.service";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ✅ GET /api/reviews/[id] - Get review by ID
export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const review = await ReviewService.getById(reviewId);

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch review",
      },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/reviews/[id] - Update review by ID
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const reviewId = Number(id);
    const body = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Invalid review ID" },
        { status: 400 }
      );
    }

    const updatedReview = await ReviewService.update(reviewId, {
      username: body.username,
      places: body.places,
      review: body.review,
      rating: body.rating,
    });

    return NextResponse.json({
      success: true,
      data: updatedReview,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update review",
      },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/reviews/[id] - Delete review by ID
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: "Invalid review ID" },
        { status: 400 }
      );
    }

    await ReviewService.delete(reviewId);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete review",
      },
      { status: 500 }
    );
  }
}
