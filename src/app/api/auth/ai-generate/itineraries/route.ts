import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, cleanAIResponse } from "@/lib/helper";
import { getGeminiClient } from "@/lib/gemini";
import PackageService from "@/services/package.service";
import HighlightService from "@/services/highlight.service";
import CityService from "@/services/city.service";
import { Options } from "@/types/type";

const requestSchema = z.object({
  packageId: z.number().min(1, "Day number required"),
});

interface itineraryAIProps {
  day: number;
  title: string;
  subTitle: string;
  details: string;
  highlights?: string[];
  cities?: string[];
}

export interface itineraryAIResponseType {
  highlights: Options;
  cities: Options;
  itinerary: itineraryAIProps[];
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

    const { packageId } = validationResult.data;
    const packageData = await PackageService.getByPID(packageId);
    const { day, night, name: packageName, destination } = packageData;
    const { name: destinationName, country, did } = destination;

    // Generate content with improved prompt
    const gemini = getGeminiClient();
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a structured JSON itinerary for the travel package "${packageName}" in "${destinationName}, ${country}".

        The output must be **only valid JSON** — no markdown, explanations, or extra text.

        Requirements:
        - The JSON object should represent the complete itinerary for the package.
        - Include a key \`itinerary\` containing an array of day-wise objects.
        - Each day object must include:
            - \`day\`: The day number (integer, starting from 1).
            - \`title\`: A concise, appealing title for the day's theme or focus (string, 20–100 characters).
            - \`subTitle\`: A short subheading describing the day (string, 20–100 characters).
            - \`details\`: A rich, vivid HTML-formatted description of what happens during the day (string, 200–600 characters). Include highlights of experiences, attractions, and local culture.
            - \`highlights\`: An array of strings listing 3–5 key highlights of the day (e.g., places visited, activities done).
            - \`cities\`: An array of city names (strings) covered on that day, based on the destination.
            - \`imageUrl\`: A royalty-free image URL representing the day’s experience (string). Prefer Unsplash, Pexels, or Pixabay images that can be used without copyright issues.

        Constraints:
        - Create exactly ${day} days and ${night} nights of itinerary.
        - Maintain narrative continuity between days (each day should logically connect to the next).
        - Focus on authentic experiences in and around ${destinationName}.
        - The tone should be travel-friendly, immersive, and informative.
        - Do not include any fields other than those listed above.
        - Do not use markdown, comments, or text outside valid JSON.

        Example of the expected JSON structure:
        {
            "itinerary": [
            {
                "day": 1,
                "title": "Arrival in Kochi – Gateway to Kerala’s Heritage",
                "subTitle": "Begin your South Indian adventure",
                "details": "<p>Arrive in Kochi, explore the Dutch Palace, Chinese Fishing Nets, and St. Francis Church. Enjoy Kathakali dance in the evening.</p>",
                "highlights": ["Dutch Palace", "Fort Kochi", "Kathakali Dance Show"],
                "cities": ["Kochi"],
                "imageUrl": "https://images.unsplash.com/photo-example"
            },
            {
                "day": 2,
                "title": "Munnar – Hills and Tea Plantations",
                "subTitle": "A scenic drive to the misty mountains",
                "details": "<p>Travel to Munnar, visit tea estates, Eravikulam National Park, and enjoy panoramic hill views. Overnight in Munnar.</p>",
                "highlights": ["Tea Estates", "Eravikulam National Park", "Scenic Drive"],
                "cities": ["Munnar"],
                "imageUrl": "https://images.unsplash.com/photo-example2"
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

    const highlights = await HighlightService.getOptionsByDestinationId(did);
    const cities = await CityService.getOptionsByDestinationId(did);

    return NextResponse.json({
      data: {
        highlights: highlights.data ?? [],
        cities: cities.data ?? [],
        itinerary: aiData.itinerary ?? [],
      },
      requestId,
      message: "City data generated successfully",
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
