// app/puzzles/page.tsx

import React, { Suspense } from "react";
import MoodImage from "./components/Mood";
import PuzzleList from "./components/PuzzleList";
import Link from "next/link";
import ErrorBoundary from "@/app/puzzles/ErrorBoundary";

interface Puzzle {
  id: string;
  image: string;
  title: string;
  description: string;
}

async function fetchDescription(): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/description`,
    {
      next: { revalidate: 30 },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch description");
  }
  const data = await res.json();
  return data.description;
}

async function fetchPuzzles(): Promise<Puzzle[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/puzzles`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch puzzles");
  }
  const data = await res.json();
  return data;
}

export default function PuzzlesPage() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-xl">Loading puzzles...</div>
          </div>
        }
      >
        <PuzzlesContent />
      </Suspense>
    </ErrorBoundary>
  );
}

async function PuzzlesContent() {
  // Fetch data in parallel
  const [description, puzzles] = await Promise.all([
    fetchDescription(),
    fetchPuzzles(),
  ]);

  return (
    <div className="max-w-6xl">
      {puzzles.length > 0 ? (
        <MoodImage mood="happiness" />
      ) : (
        <MoodImage mood="confused" />
      )}
      <h1 className="text-3xl font-bold mb-8">Available Puzzles</h1>
      <PuzzleList puzzles={puzzles} />
      {description && (
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {description}
        </div>
      )}
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
