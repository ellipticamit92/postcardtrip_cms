import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, cleanAIResponse } from "@/lib/helper";
import { getGeminiClient } from "@/lib/gemini";

const requestSchema = z.object({
  destinationName: z.string().min(1).max(100).trim(),
});

export interface HighlightsAIResponseType {
  title: string;
  category: string;
}

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

    const { destinationName } = validationResult.data;

    // Generate content with improved prompt
    const gemini = getGeminiClient();
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a JSON object representing key travel highlights for the destination "${destinationName}".  
        The output must be ONLY valid JSON (no markdown, no explanations)..

       Requirements:
        - Each highlight should describe a major attraction, activity, or experience unique to the destination.
        - Keep tone engaging and concise, suitable for travel package marketing.
        - Each highlight should have:
          - title: short title (string, 10-30 characters)
          - category: one of ["Nature", "Adventure", "Culture", "Relaxation", "Spiritual", "Heritage", "Food", "Wildlife"]

        Return a single valid JSON object with:
        {
          "highlights": [
            {
              "title": "",
              "category": "",
            }
          ]
        }`,
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

    return NextResponse.json({
      data: aiData.highlights ?? [],
      requestId,
      message: "Higlights data generated successfully",
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
