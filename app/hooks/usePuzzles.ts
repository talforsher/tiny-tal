import { useState, useEffect } from "react";
import { Puzzle } from "../types";

interface UsePuzzlesReturn {
  puzzles: Puzzle[];
  description: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePuzzles(): UsePuzzlesReturn {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [descRes, puzzlesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/description`),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/puzzles`),
      ]);

      if (!descRes.ok || !puzzlesRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [descData, puzzlesData] = await Promise.all([
        descRes.json(),
        puzzlesRes.json(),
      ]);

      setDescription(descData.description);
      setPuzzles(puzzlesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    puzzles,
    description,
    isLoading,
    error,
    refetch: fetchData,
  };
}
