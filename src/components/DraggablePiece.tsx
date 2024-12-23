"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PuzzlePiece } from "@/app/types";

interface DraggablePieceProps {
  piece: PuzzlePiece;
  onDragEnd: (piece: PuzzlePiece, position: { x: number; y: number }) => void;
}

export default function DraggablePiece({
  piece,
  onDragEnd,
}: DraggablePieceProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDragEnd(piece, { x: info.point.x, y: info.point.y });
      }}
      className={`absolute cursor-grab ${isDragging ? "z-10" : "z-0"}`}
      style={{
        x: piece.points[0].x,
        y: piece.points[0].y,
      }}
    >
      <svg>
        <path d={piece.points.map((p) => `${p.x} ${p.y}`).join(" ")} />
      </svg>
    </motion.div>
  );
}
