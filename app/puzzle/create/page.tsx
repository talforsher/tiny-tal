"use client";

import { useState } from "react";
import Link from "next/link";
import { PuzzleCreator } from "@/app/components/PuzzleCreator";
import { Point, PuzzlePiece } from "@/app/types";

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
      formData.append("pieces", JSON.stringify(pieces));
      setIsLoading(true);
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

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Puzzle</h1>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                <p>Click to upload an image</p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </label>
          </>
        ) : (
          <PuzzleCreator image={image} setPieces={setPieces} />
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
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}
