"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Puzzle {
  id: string;
  image: string;
  title: string;
  description: string;
}

export default function PuzzlesPage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const response = await fetch("/api/puzzles");
        if (!response.ok) throw new Error("Failed to fetch puzzles");
        const data = await response.json();
        setPuzzles(data);
      } catch (err) {
        setError("Failed to load puzzles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xl">Loading puzzles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Available Puzzles</h1>

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

      {puzzles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No puzzles available yet.
          </p>
          <Link href="/puzzle/create" className="btn btn-primary">
            Create First Puzzle
          </Link>
        </div>
      )}
    </div>
  );
}
