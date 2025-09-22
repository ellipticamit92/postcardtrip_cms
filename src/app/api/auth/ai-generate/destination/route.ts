import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, cleanAIResponse } from "@/lib/helper";
import { getGeminiClient } from "@/lib/gemini";
import { fetchUnsplashImage } from "@/lib/api/fetchImage";
import DestinationService from "@/services/destination.service";
import { DestinationFormDataType } from "@/components/organisms/destinations/DestinationForm";

const requestSchema = z.object({
  destination: z.string().min(1).max(100).trim(),
});

const aiResponseSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(10).max(400),
  heroTitle: z.string().min(20).max(70),
  heading: z.string().min(15).max(25),
  country: z.string().min(2).max(100),
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
    const where: any = {};

    const { destination } = validationResult.data;
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

    const imageData = await fetchUnsplashImage(destination);

    // Generate content with improved prompt
    const gemini = getGeminiClient();
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Generate a JSON object for the travel destination "${destination} and find irs country as well ".
      Requirements:
      - name: The destination name (string, 1-200 characters)
      - description: Detailed travel description highlighting attractions, culture, and experiences (string, 50-400 characters)
      - heroTitle: A catchy title for the destination (string, 20-70 characters)
      - heading: A short heading for the destination (string, 15-25 characters)
      - country: The country where the destination is located (string, 2-100 characters)
      Return only valid JSON without markdown formatting.`,
    });

    console.log("AI response:", response);

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

    const data: DestinationFormDataType = {
      name: aiValidation.data.name.trim(),
      overview: aiValidation?.data?.description?.trim() ?? "",
      isRichText: false,
      imageUrl: imageData?.url ?? "",
      thumbnailUrl: imageData?.thumbnailUrl ?? "",
      basePrice: Math.floor(Math.random() * 900) + 100, // Random price between 100-999
      originalPrice: Math.floor(Math.random() * 900) + 100,
      heroTitle: aiValidation.data.heroTitle.trim(),
      rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1-5
      country: aiValidation.data.country.trim(),
      heading: aiValidation.data.heading.trim(),
      trending: false,
      featured: false,
      status: true,
    };

    // Save to database with transaction
    const savedDestination = await DestinationService.create(data);

    console.log(
      `[${requestId}] Successfully created destination:`,
      savedDestination.did
    );

    return NextResponse.json({
      ...savedDestination,
      requestId,
      message: "Destination created successfully",
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
