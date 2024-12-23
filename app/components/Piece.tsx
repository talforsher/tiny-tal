import React from "react";
import { Point } from "@/app/types";

interface ImageWithClipPathProps {
  base64Image: string;
  pathPoints: Point[];
}

const ImageWithClipPath = ({
  base64Image,
  pathPoints,
}: ImageWithClipPathProps) => {
  const pathData =
    pathPoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  const width = pathPoints.map((p) => p.x).reduce((a, b) => Math.max(a, b), 0);
  const height = pathPoints.map((p) => p.y).reduce((a, b) => Math.max(a, b), 0);

  return (
    <svg width={800} height={600} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <clipPath id="customClipPath">
          <path d={pathData} />
        </clipPath>
      </defs>
      <image
        href={`data:image/jpeg;base64,${base64Image}`}
        width={800}
        height={600}
        clipPath={`url(#customClipPath)`}
      />
    </svg>
  );
};

export default ImageWithClipPath;
