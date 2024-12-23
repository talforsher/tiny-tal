import { useRef, useState } from "react";
import { usePuzzlePiece } from "../hooks/usePuzzlePiece";
import { Point, PuzzlePiece } from "../types";
import Image from "next/image";

export function PuzzleCreator({
  image,
  setPieces,
}: {
  image: string;
  setPieces: (pieces: PuzzlePiece[]) => void;
}) {
  const [imageOffset, setImageOffset] = useState<Point>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const {
    pieces,
    isDrawing,
    isMoving,
    hasPending,
    removePiece,
    completePuzzle,
  } = usePuzzlePiece({
    imageOffset,
    pieces: [],
    isEdit: true,
    onCreatePiece: (piece) => {
      setPieces((prevPieces) => [...prevPieces, piece]);
    },
    onRemovePiece: (index) => {
      setPieces((prevPieces) => prevPieces.filter((_, i) => i !== index));
    },
  });

  return (
    <div className="relative">
      <Image
        ref={imageRef}
        src={image}
        alt="Puzzle image"
        width={800}
        height={600}
        className="w-full h-auto"
        onLoad={() => {
          if (imageRef.current) {
            setImageOffset({
              x: imageRef.current.getBoundingClientRect().left,
              y: imageRef.current.getBoundingClientRect().top,
            });
          }
        }}
      />
      <svg className="absolute inset-0 w-full h-full">
        {pieces.map((piece, index) => (
          <path
            key={index}
            d={generatePathFromPoints(piece.points)}
            transform={`translate(${piece.offset.x},${piece.offset.y})`}
            className={`${
              isDrawing ? "stroke-blue-500" : "stroke-black"
            } fill-transparent stroke-2`}
          />
        ))}
      </svg>
    </div>
  );
}

function generatePathFromPoints(points: Point[]): string {
  return (
    points
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + "Z"
  );
}
