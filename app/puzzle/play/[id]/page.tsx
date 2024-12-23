"use client";

import { useEffect, useState } from "react";
import DraggablePiece from "@/app/components/DraggablePiece";
import type { Point, PuzzlePiece } from "@/app/types";
import Piece from "@/app/components/Piece";

interface PuzzlePlayProps {
  params: {
    id: string;
  };
}

export default function PuzzlePlay({ params }: PuzzlePlayProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const response = await fetch(`/api/puzzles/${params.id}`);
        if (!response.ok) throw new Error("Failed to load puzzle");
        const data = await response.json();
        setImage(data.image);
        setPieces(
          data.pieces.map((p: PuzzlePiece, index: number) => ({
            ...p,
            id: index,
          }))
        );
        setMetadata(data.metadata);
      } catch (err) {
        setError("Failed to load puzzle. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [params.id]);

  const offsetHandler = (pieceId: number, offset: Point) => {
    setPieces((currentPieces) =>
      currentPieces.map((p) =>
        p.id === pieceId
          ? {
              ...p,
              offset: { x: p.offset.x + offset.x, y: p.offset.y + offset.y },
            }
          : p
      )
    );
  };

  const checkPuzzleCompletion = () => {
    const offset = 100;
    const range = 20;
    const isCompleted = pieces.every(
      (piece) =>
        Math.abs(piece.offset.x - offset) < range &&
        Math.abs(piece.offset.y - offset) < range
    );
    setCompleted(isCompleted);
  };

  useEffect(() => {
    checkPuzzleCompletion();
  }, [pieces]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xl">Loading puzzle...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Puzzle Play</h1>
        {completed && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
            Congratulations! You completed the puzzle!
          </div>
        )}
      </div>

      <div
        className="relative w-full aspect-[4/3] border border-gray-300 rounded-lg bg-gray-50"
        style={{
          backgroundImage: `url(data:image/jpeg;base64,${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {metadata && (
          <div className="absolute top-0 left-0 p-2 bg-white rounded-lg">
            <h2 className="text-xl font-bold">{metadata.title}</h2>
            <p className="text-sm">{metadata.description}</p>
          </div>
        )}
        {image &&
          pieces.map((piece, index) => (
            <DraggablePiece
              key={index}
              piece={piece}
              image={image}
              offsetHandler={offsetHandler}
            />
          ))}
        {image &&
          pieces.map((pieces, index) => (
            <Piece key={index} base64Image="" pathPoints={pieces.points} />
          ))}
      </div>
    </div>
  );
}