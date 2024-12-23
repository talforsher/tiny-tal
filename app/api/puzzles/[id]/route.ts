import { NextResponse } from "next/server";
import type { PuzzlePiece } from "@/app/types";
import fs from "fs/promises";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Fetching puzzle", params.id);
  try {
    const mediaDir = process.env.MEDIA_DIR || "public/uploads";
    const folder = join(mediaDir, `${params.id}`);
    const imagePath = join(folder, "image.jpg");
    const piecesPath = join(folder, "pieces.json");
    const metadataPath = join(folder, "metadata.json");

    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const pieces = JSON.parse(await fs.readFile(piecesPath, "utf-8"));
    const metadata = JSON.parse(await fs.readFile(metadataPath, "utf-8"));
    return NextResponse.json({ image: base64Image, pieces, metadata });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
