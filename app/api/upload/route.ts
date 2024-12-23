import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import OpenAI from "openai";
const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is missing" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as string;
    const pieces = formData.get("pieces") as string;

    const folderName = crypto.randomBytes(16).toString("hex");

    const mediaDir = process.env.MEDIA_DIR || "public/uploads";
    const folderPath = join(mediaDir, folderName);
    const imagePath = join(folderPath, "image.jpg");
    const piecesPath = join(folderPath, "pieces.json");
    const metadataPath = join(folderPath, "metadata.json");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "return a json with a title and description of this image:",
            },
            {
              type: "image_url",
              image_url: { url: image, detail: "low" },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0].message.content);

    try {
      await mkdir(folderPath, { recursive: true });
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");
      await writeFile(imagePath, imageBuffer);
      await writeFile(piecesPath, pieces);
      await writeFile(
        metadataPath,
        response.choices[0].message.content as string
      );
    } catch (error) {
      console.error("File write error:", error);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      puzzleId: folderName,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
