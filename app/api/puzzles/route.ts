import { NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  console.log("Fetching puzzles");
  try {
    const mediaDir = process.env.MEDIA_DIR || "public/uploads";
    const folders = await readdir(mediaDir);

    const puzzles = await Promise.all(
      folders.map(async (folder) => {
        try {
          const folderPath = join(mediaDir, folder);
          const metadataPath = join(folderPath, "metadata.json");
          const imagePath = join(folderPath, "image.jpg");

          const metadata = JSON.parse(await readFile(metadataPath, "utf-8"));
          const imageBuffer = await readFile(imagePath);
          const base64Image = Buffer.from(imageBuffer).toString("base64");

          return {
            id: folder,
            image: base64Image,
            ...metadata,
          };
        } catch (error) {
          console.error(`Error reading puzzle ${folder}:`, error);
          return null;
        }
      })
    );

    const validPuzzles = puzzles.filter(Boolean);

    return NextResponse.json(validPuzzles);
  } catch (error) {
    console.error("Failed to fetch puzzles:", error);
    return NextResponse.json(
      { error: "Failed to fetch puzzles" },
      { status: 500 }
    );
  }
}
