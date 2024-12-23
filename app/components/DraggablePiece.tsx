"use client";

import { createRef, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { PuzzlePiece, Point } from "@/app/types";
import Piece from "./Piece";

interface DraggablePieceProps {
  piece: PuzzlePiece;
  offsetHandler: (pieceId: number, offset: Point) => void;
  image: string;
}

export default function DraggablePiece({
  offsetHandler,
  piece,
  image,
}: DraggablePieceProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const STEP = 10;
    switch (e.key) {
      case "ArrowUp":
        setPosition((prev) => ({ ...prev, y: prev.y - STEP }));
        break;
      case "ArrowDown":
        setPosition((prev) => ({ ...prev, y: prev.y + STEP }));
        break;
      case "ArrowLeft":
        setPosition((prev) => ({ ...prev, x: prev.x - STEP }));
        break;
      case "ArrowRight":
        setPosition((prev) => ({ ...prev, x: prev.x + STEP }));
        break;
    }
  };

  return (
    <motion.div
      initial={position}
      animate={position}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        offsetHandler(piece.id, { x: info.offset.x, y: info.offset.y });
      }}
      role="button"
      tabIndex={0}
      aria-label={`Puzzle piece ${piece.id}`}
      aria-grabbed={isDragging}
      onKeyDown={handleKeyDown}
      className={`absolute cursor-grab ${
        isDragging ? "z-10" : "z-0"
      } piece focus:outline-2 focus:outline-blue-500`}
    >
      <Piece base64Image={image} pathPoints={piece.points} />
      <svg
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Puzzle piece drawing area"
      ></svg>
    </motion.div>
  );
}
