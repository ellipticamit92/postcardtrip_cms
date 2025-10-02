import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, cleanAIResponse } from "@/lib/helper";
import { getGeminiClient } from "@/lib/gemini";
import { fetchUnsplashImage } from "@/lib/api/fetchImage";
import { PackageFormDataType } from "@/components/organisms/packages/PackageForm";

const requestSchema = z.object({
  day: z.number().min(1),
  night: z.number().min(1, "Please select night"),
  destinationId: z.number().min(1, "Please atleast one number"),
  toursId: z.number().optional(),
  destination: z.string().min(1).max(100).trim(),
  tourType: z.string().optional(),
  isImageChange: z.boolean().optional(),
});

const aiResponseSchema = z.object({
  baseName: z.string().min(1).max(200),
  description: z.string().min(10).max(400),
  heroTitle: z.string().min(20).max(70),
  text: z.string().min(30).max(200),
  theme: z.string().optional(),
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
    const {
      destination,
      day,
      tourType,
      destinationId,
      toursId,
      night,
      isImageChange,
    } = validationResult.data;
    const imageData = await fetchUnsplashImage(destination);

    const gemini = getGeminiClient();
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a JSON object for a "${tourType}" travel package to "${destination}" for ${day} days and "${night}" nights.

      Requirements:
      - baseName: SEO-friendly package name using primary keywords like destination, duration, and experience type. Avoid filler words (the, of, for, in). Keep 20-75 characters. Examples: "Kerala Backwater Hills Adventure", "Goa Beach Heritage Tour"
      - description: Compelling package description highlighting key attractions, cultural experiences, activities, and unique selling points. Include specific landmarks, experiences, and travel highlights. 100-400 characters.
      - heroTitle: Marketing-focused title for headers and promotions. Should be catchy and memorable. 25-70 characters.
      - text: Concise promotional text summarizing the package value proposition. Perfect for cards and listings. 60-120 characters.

      Focus on:
      - Include destination name naturally
      - Mention key attractions/experiences
      - Use action words and compelling language
      - Ensure content is unique and engaging
      - Make names suitable for URL slugs (avoid special characters)

      Example good baseName: "Kerala Hills Wildlife Backwater Adventure"
      Example bad baseName: "The Best of Kerala Tour for All Ages"
      Example bad baseName: "Kerala Romance 3 Days 4 Night"

      Return only valid JSON without markdown formatting or code blocks.`,
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

      //Clean and parse
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

    const { baseName, description, heroTitle, text } = aiValidation.data;

    const aiResponseData: Partial<PackageFormDataType> = {
      name: baseName?.trim(),
      overview: description?.trim() ?? "",
      isRichText: false,
      text: text?.trim() ?? "",
      heroTitle: heroTitle?.trim() ?? "",
      ...(isImageChange
        ? { imageUrl: imageData?.url, thumbnailUrl: imageData?.thumbnailUrl }
        : {}),
      day,
      night,
      destinationId,
      tours: toursId !== undefined ? [toursId] : undefined,
    };

    return NextResponse.json({
      data: aiResponseData,
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
