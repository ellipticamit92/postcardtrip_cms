import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, cleanAIResponse } from "@/lib/helper";
import { getGeminiClient } from "@/lib/gemini";
import { fetchUnsplashImage } from "@/lib/api/fetchImage";

const requestSchema = z.object({
  destinationName: z.string().min(1).max(100).trim(),
});

export interface CityAIResponseType {
  name: string;
  description: string;
  imageUrl: string;
  activities: string[];
  mustSeeAttractions: string[];
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
      contents: `Generate a JSON object for the travel destination "${destinationName}" and list its major tourist cities.

        The output must be **only valid JSON** — no markdown, explanations, or extra text.

        Requirements:
        - The JSON object should have a key \`cities\` containing an array of city objects.
        - Each city object must include:
        - \`name\`: The city's name (string, 1-100 characters).
        - \`description\`: A short, engaging overview of the city highlighting its attractions and experiences (string, 100-400 characters).
        - \`mustSeeAttractions\`: An array of strings listing the top 3-5 must-see attractions in the city.
        - \`activities\`: An array of strings listing popular activities tourists can do in the city.
        - \`imageUrl\`: A royalty-free image URL representing the city (string). Prefer sources like Unsplash, Pexels, or Pixabay. Ensure the image can be used without copyright issues.

        Constraints:
        - Focus on **major tourist cities** only.
        - Descriptions should be concise, vivid, and informative.
        - Do **not** include any additional fields, comments, or formatting outside the JSON structure.
        - Do **not** return markdown or any text outside the JSON.

        Example of the expected output structure:
        {
            "cities": [
                {
                    "name": "City Name",
                    "description": "A brief description highlighting the main attractions and experiences in the city.",
                    "mustSeeAttractions": ["Attraction 1", "Attraction 2", "Attraction 3"],
                    "activities": ["Activity 1", "Activity 2", "Activity 3"],
                    "imageUrl": "https://images.unsplash.com/photo-example"
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
      data: aiData?.cities ?? [],
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
