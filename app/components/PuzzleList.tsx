// components/PuzzleList.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Puzzle {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface PuzzleListProps {
  puzzles: Puzzle[];
}

export default function PuzzleList({ puzzles }: PuzzleListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {puzzles.map((puzzle) => (
        <Link
          key={puzzle.id}
          href={`/puzzle/play/${puzzle.id}`}
          className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="aspect-video relative">
            <Image
              src={`data:image/jpeg;base64,${puzzle.image}`}
              alt={puzzle.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{puzzle.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {puzzle.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
