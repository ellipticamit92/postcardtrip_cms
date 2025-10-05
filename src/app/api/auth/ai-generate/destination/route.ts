import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, cleanAIResponse } from "@/lib/helper";
import { getGeminiClient } from "@/lib/gemini";
import { fetchUnsplashImage } from "@/lib/api/fetchImage";
import { DestinationFormDataType } from "@/components/organisms/destinations/DestinationForm";

const requestSchema = z.object({
  destination: z.string().min(1).max(100).trim(),
  isEdit: z.boolean().optional(),
  isImageChange: z.boolean().optional(),
});

const aiResponseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(150).max(600),
  heroTitle: z.string().min(20).max(70),
  heading: z.string().min(15).max(25),
  country: z.string().min(2).max(100),
  cardText: z.string().min(20).max(200),
  bestTimeToVisit: z.string().min(10).max(50).optional(),
  highlights: z.string().min(50).max(300).optional(),
});

export async function POST(req: NextRequest) {
  const requestId = `req_${Date.now().toString(36)}`;

  try {
    // Rate limiting
    const clientIp = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          requestId,
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await req.json().catch(() => ({}));
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: validationResult.error.issues,
          requestId,
        },
        { status: 400 }
      );
    }

    const { destination, isEdit, isImageChange } = validationResult.data;

    if (!isEdit) {
      const where: any = {};
      if (destination) {
        where.name = {
          equals: destination,
          mode: "insensitive",
        };
      }

      // Check if destination already exists
      const existingDestination = await prisma.destination.findFirst({
        where: {
          name: {
            contains: destination, // Case-insensitive partial matching
          },
        },
      });

      if (existingDestination) {
        return NextResponse.json({
          ...existingDestination,
          message: "Destination already exists",
          requestId,
        });
      }
    }

    // Generate content with improved prompt
    const gemini = getGeminiClient();
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a JSON object for the travel destination "${destination}" and identify its country.
        The output must be ONLY valid JSON (no markdown, no extra text).

        Requirements:
        - name: The destination name (string, 1-200 characters). Use the most common travel-friendly name.
        - description: A detailed, engaging travel description highlighting attractions, culture, food, nature, and unique experiences (string, 150-500 characters). Write in an inspiring and inviting tone suitable for a travel agency website.
        - heroTitle: A catchy and SEO-friendly headline for the destination page hero banner (string, 30-70 characters). Should inspire travelers to visit and highlight what makes the destination unique.
        - cardText: A short teaser/summary for use in a destination card or listing (string, 30-100 characters). Keep it punchy and appealing.
        - heading: A concise, memorable heading for the destination (string, 15-25 characters). Should work well as a section title.
        - country: The country where the destination is located (string, 2-100 characters). Ensure accuracy.
        - highlights: A single string containing 3-5 must-see attractions, activities, or experiences, separated by commas (string, 50-300 characters).
        - bestTimeToVisit: A short phrase describing the ideal travel season (string, 10-50 characters).

        Return a single valid JSON object matching this schema.`,
    });

    if (!response.text) {
      throw new Error("Empty response from AI service");
    }

    // Parse and validate AI response
    let aiData;
    try {
      if (!response) {
        throw new Error("No response from AI service");
      }

      const responseText = response.text;
      if (!responseText || typeof responseText !== "string") {
        throw new Error("Invalid response format from AI service");
      }

      if (responseText.trim() === "") {
        throw new Error("Empty response from AI service");
      }

      // Clean and parse
      const cleanedResponse = cleanAIResponse(responseText);
      aiData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error(`[${requestId}] JSON parse error:`, parseError);
      return NextResponse.json(
        {
          error: "Invalid AI response format",
          requestId,
          raw: response.text.substring(0, 200) + "...",
        },
        { status: 502 }
      );
    }

    const aiValidation = aiResponseSchema.safeParse(aiData);
    if (!aiValidation.success) {
      console.error(`[${requestId}] AI validation error:`, aiValidation.error);
      return NextResponse.json(
        {
          error: "AI response validation failed",
          details: aiValidation.error.issues,
          requestId,
        },
        { status: 502 }
      );
    }

    const imageData = await fetchUnsplashImage(destination);

    const aiResponseData: Partial<DestinationFormDataType> = {
      name: aiValidation?.data?.name?.trim(),
      overview: aiValidation?.data?.description?.trim() ?? "",
      isRichText: false,
      country: aiValidation?.data?.country?.trim() ?? "",
      heading: aiValidation?.data?.heading?.trim() ?? "",
      text: aiValidation?.data?.cardText?.trim() ?? "",
      heroTitle: aiValidation?.data?.heroTitle?.trim() ?? "",
      bestTimeToVisit: aiValidation?.data?.bestTimeToVisit?.trim() ?? "",
      highlights: aiValidation?.data?.highlights ?? "",
      ...(isImageChange
        ? { imageUrl: imageData?.url, thumbnailUrl: imageData?.thumbnailUrl }
        : {}),
    };

    return NextResponse.json({
      data: aiResponseData,
      requestId,
      message: "Destination data generated successfully",
      success: true,
    });
  } catch (error: any) {
    console.error(`[${requestId}] API error:`, {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      success: false,
    });

    // Handle specific error types
    if (error.code === "P2002") {
      // Prisma unique constraint error
      return NextResponse.json(
        {
          error: "Destination with this name already exists",
          requestId,
          success: false,
        },
        { status: 409 }
      );
    }

    if (error.name === "PrismaClientKnownRequestError") {
      return NextResponse.json(
        {
          error: "Database operation failed",
          requestId,
          success: false,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        requestId,
        success: false,
      },
      { status: 500 }
    );
  }
}
