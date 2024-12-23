import React from "react";

export default function PlayPuzzle({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Play Puzzle</h1>
      <p>Puzzle ID: {params.id}</p>
    </div>
  );
}
