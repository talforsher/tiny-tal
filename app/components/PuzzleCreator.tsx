import { useRef } from "react";
import { usePuzzlePiece } from "../hooks/usePuzzlePiece";
import { Point, PuzzlePiece } from "../types";
import Image from "next/image";
import { PuzzleProvider } from "../contexts/PuzzleContext";

export function PuzzleCreatorContent({
  image,
  setPieces,
  imageOffset,
  setImageOffset,
}: {
  image: string;
  setPieces: (
    pieces: PuzzlePiece[] | ((prev: PuzzlePiece[]) => PuzzlePiece[])
  ) => void;
  imageOffset: Point;
  setImageOffset: (offset: Point) => void;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const { pieces, isDrawing } = usePuzzlePiece({
    imageOffset,
    onCreatePiece: (piece) => {
      setPieces((prevPieces: PuzzlePiece[]) => [...prevPieces, piece]);
    },
    onUpdatePiece: (piece) => {
      setPieces((prevPieces: PuzzlePiece[]) => {
        const index = prevPieces.length - 1;
        return [...prevPieces.slice(0, index), piece];
      });
    },
  });

  return (
    <div className="relative" style={{ width: "600px", height: "600px" }}>
      <Image
        ref={imageRef}
        src={image}
        alt="Puzzle image"
        width={600}
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
        {pieces.map((piece, index) => {
          if (!piece.offset) {
            return null;
          }
          return (
            <path
              key={index}
              d={generatePathFromPoints(piece.points)}
              transform={`translate(${piece.offset.x},${piece.offset.y})`}
              className={`${
                isDrawing ? "stroke-blue-500" : "stroke-black"
              } fill-transparent stroke-2`}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function PuzzleCreator(props: {
  image: string;
  setPieces: (
    pieces: PuzzlePiece[] | ((prev: PuzzlePiece[]) => PuzzlePiece[])
  ) => void;
  imageOffset: Point;
  setImageOffset: (offset: Point) => void;
}) {
  return (
    <PuzzleProvider>
      <PuzzleCreatorContent {...props} />
    </PuzzleProvider>
  );
}

function generatePathFromPoints(points: Point[]): string {
  return (
    points
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + "Z"
  );
}
