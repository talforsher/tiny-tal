import React from "react";

const width = 342;
const height = 358;
const margin = 40;

const coordinates = {
  love: { x: 0, y: 0 },
  curiosity: { x: -width * 1, y: 0 },
  happiness: { x: -width * 2, y: 0 },
  sadness: { x: 0, y: -height },
  surprise: { x: -width, y: -height },
  cry: { x: -width * 2, y: -height },
  drunk: { x: 0, y: -height * 2 },
  angry: { x: -width * 1, y: -height * 2 },
  confused: { x: -width * 2, y: -height * 2 },
};

type Mood = keyof typeof coordinates;

const MoodImage = ({ mood }: { mood: Mood }) => {
  const imageCoordinates = coordinates[mood];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height - margin}px`,
        overflow: "hidden",
        display: "inline-block",
        backgroundImage: "url(/mood.webp)",
        backgroundPosition: `${imageCoordinates.x}px ${imageCoordinates.y}px`,
      }}
    ></div>
  );
};

export default MoodImage;
