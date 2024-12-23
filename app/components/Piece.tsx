import React from "react";
import { PuzzlePiece } from "@/app/types";

interface ImageWithClipPathProps {
  base64Image: string;
  piece: PuzzlePiece;
}

const ImageWithClipPath = ({ base64Image, piece }: ImageWithClipPathProps) => {
  const pathData =
    piece.points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  return (
    <svg width={600} height={600} preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id={`clip-path-${piece.id}`}>
          <path d={pathData} />
        </clipPath>
      </defs>
      <image
        href={`data:image/jpeg;base64,${base64Image}`}
        width={600}
        height={600}
        clipPath={`url(#clip-path-${piece.id})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
};

export default ImageWithClipPath;
