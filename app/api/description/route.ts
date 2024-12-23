import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

export async function GET() {
  try {
    const mediaDir = process.env.MEDIA_DIR || "public/uploads";
    const folders = await readdir(mediaDir);

    const puzzleData = [];
    for (const folder of folders) {
      const folderPath = join(mediaDir, folder);
      const metadataPath = join(folderPath, "metadata.json");

      try {
        const metadataContent = await readFile(metadataPath, "utf-8");
        const { title, description } = JSON.parse(metadataContent);
        puzzleData.push({ title, description });
      } catch (err) {
        console.error(`Error reading metadata for ${folder}:`, err);
      }
    }

    const puzzleSummaries = puzzleData
      .map((p) => `Title: ${p.title}\nDescription: ${p.description}`)
      .join("\n\n");

    const userMessage = `
Create an ultra short story highlighting the following puzzle titles and descriptions:
${puzzleSummaries}
`;

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const shortStory = openaiResponse.choices[0].message?.content || "";

    return NextResponse.json({ description: shortStory });
  } catch (error) {
    console.error("Failed to generate story from puzzle metadata", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
