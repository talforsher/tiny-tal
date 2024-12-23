"use client";

import { useState } from "react";
import Link from "next/link";
import { PuzzleCreator } from "@/app/components/PuzzleCreator";
import { Point, PuzzlePiece } from "@/app/types";
import MoodImage from "@/app/components/Mood";

export default function CreatePuzzle() {
  const [image, setImage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [puzzleId, setPuzzleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageOffset, setImageOffset] = useState<Point>({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    try {
      if (!image) {
        setError("No image selected");
        return;
      }
      const formData = new FormData();
      formData.append("image", image);
      const formattedPieces = pieces.map((piece) => ({
        ...piece,
        points: piece.points.map((point) => ({
          x: point.x - imageOffset.x,
          y: point.y - imageOffset.y,
        })),
      }));
      formData.append("pieces", JSON.stringify(formattedPieces));
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setPuzzleId(data.puzzleId);
    } catch (error) {
      setError("Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/generate-ai", {
        method: "POST",
      });
      const data = await response.json();
      setImage(data.image);
    } catch (error) {
      setError("Failed to generate AI image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="rounded-lg text-center">
        {!image ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer block p-4 hover:bg-gray-50"
            >
              <div>
                {isLoading ? (
                  <MoodImage mood="cry" />
                ) : (
                  <MoodImage mood="curiosity" />
                )}
                <p>Click to upload an image</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </label>
            <div className="flex flex-col gap-2">
              <p>OR</p>
            </div>
          </>
        ) : (
          <PuzzleCreator
            image={image}
            setPieces={setPieces}
            imageOffset={imageOffset}
            setImageOffset={setImageOffset}
          />
        )}
        {!pieces.length && (
          <div className="flex flex-col gap-2">
            <button
              className="bg-blue-500 text-white rounded-md p-2"
              onClick={handleGenerateAI}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate AI Image"}
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {pieces.length > 0 && (
            <button
              disabled={isLoading}
              className="mt-4 bg-blue-500 text-white rounded-md p-2"
              onClick={handleImageUpload}
            >
              {isLoading ? "Saving..." : "Save Puzzle"}
            </button>
          )}
          {puzzleId && (
            <Link href={`/puzzle/play/${puzzleId}`}>
              <button className="mt-4 bg-blue-500 text-white rounded-md p-2">
                Play Puzzle
              </button>
            </Link>
          )}
        </div>
        {error && (
          <p className="text-red-500">
            {error}
            <MoodImage mood="cry" />
          </p>
        )}
      </div>
    </div>
  );
}
