"use client";

import React from "react";
import MoodImage from "./components/Mood";
import PuzzleList from "./components/PuzzleList";
import Link from "next/link";
import ErrorBoundary from "@/app/puzzles/ErrorBoundary";
import { usePuzzles } from "@/app/hooks/usePuzzles";

export default function PuzzlesPage() {
  return (
    <ErrorBoundary>
      <PuzzlesContent />
    </ErrorBoundary>
  );
}

function PuzzlesContent() {
  const { puzzles, description, error } = usePuzzles();

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

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
          {description.split("**").map((paragraph, index) => (
            <span key={index}>
              {index % 2 === 0 ? paragraph : <b>{paragraph}</b>}
            </span>
          ))}
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
