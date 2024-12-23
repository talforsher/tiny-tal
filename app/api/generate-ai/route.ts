import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function POST() {
  try {
    const response = await openai.images.generate({
      prompt:
        "The coolest image ever!!!!!!!!!!!!!!!! something with fruits, something with animals!!! wowwwwwwwwwww",
      size: "1024x1024",
      response_format: "b64_json",
    });

    const b64Image = response.data[0].b64_json;

    return NextResponse.json({
      image: `data:image/png;base64,${b64Image}`,
    });
  } catch (error) {
    console.error("Error generating AI image:", error);
    return NextResponse.json(
      { error: "Failed to generate AI image" },
      { status: 500 }
    );
  }
}
