import { useCallback } from "react";
import { Point, PuzzlePiece } from "../types";
import { PieceType } from "../types/enums";

interface UsePieceDrawingProps {
  onDrawComplete?: (piece: PuzzlePiece) => void;
}

type DrawingPiece = Omit<PuzzlePiece, "id">;

export const usePieceDrawing = ({ onDrawComplete }: UsePieceDrawingProps) => {
  const startDrawing = useCallback(
    (point: Point): DrawingPiece => ({
      points: [point],
      offset: { x: 0, y: 0 },
    }),
    []
  );

  const continueDrawing = useCallback(
    (currentPiece: PuzzlePiece, newPoint: Point): DrawingPiece | null => {
      const lastPoint = currentPiece.points[currentPiece.points.length - 1];
      const distance = Math.sqrt(
        Math.pow(newPoint.x - lastPoint.x, 2) +
          Math.pow(newPoint.y - lastPoint.y, 2)
      );

      if (distance < 5) return null;

      return {
        ...currentPiece,
        points: [...currentPiece.points, newPoint],
      };
    },
    []
  );

  const isValidPiece = useCallback((piece: PuzzlePiece): boolean => {
    return piece.points.length >= 3;
  }, []);

  const finishDrawing = useCallback(
    (piece: PuzzlePiece) => {
      if (isValidPiece(piece)) {
        onDrawComplete?.(piece);
        return true;
      }
      return false;
    },
    [onDrawComplete, isValidPiece]
  );

  return {
    startDrawing,
    continueDrawing,
    finishDrawing,
    isValidPiece,
  };
};
