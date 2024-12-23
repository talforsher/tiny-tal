import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8">Interactive Puzzle Creator</h1>
      <nav aria-label="Main navigation">
        <div className="grid gap-4">
          <Link
            href="/puzzle/create"
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            role="button"
            aria-label="Create new puzzle"
          >
            Create New Puzzle
          </Link>
          <Link
            href="/puzzles"
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            role="button"
            aria-label="Browse existing puzzles"
          >
            Browse Puzzles
          </Link>
        </div>
      </nav>
    </div>
  );
}
