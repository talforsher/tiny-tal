"use client";

import React, { useRef, useEffect } from "react";

interface PuzzleCanvasProps {
  imageUrl: string;
  onPathsCreated: (paths: string[]) => void;
}

export default function PuzzleCanvas({
  imageUrl,
  onPathsCreated,
}: PuzzleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas setup and drawing logic will go here
  }, [imageUrl]);

  return (
    <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" />
  );
}
