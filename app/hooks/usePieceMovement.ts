import { useState, useCallback } from "react";
import { Point, PuzzlePiece } from "../types";

interface UsePieceMovementProps {
  onMoveComplete?: (piece: PuzzlePiece) => void;
}

type MovementPiece = Omit<PuzzlePiece, "id">;

export const usePieceMovement = ({ onMoveComplete }: UsePieceMovementProps) => {
  const [lastMovePoint, setLastMovePoint] = useState<Point>({ x: 0, y: 0 });

  const startMoving = useCallback((point: Point) => {
    setLastMovePoint(point);
  }, []);

  const updateMovement = useCallback(
    (piece: PuzzlePiece, currentPoint: Point): MovementPiece => {
      const dx = currentPoint.x - lastMovePoint.x;
      const dy = currentPoint.y - lastMovePoint.y;

      setLastMovePoint(currentPoint);

      return {
        ...piece,
        offset: piece.offset
          ? {
              x: piece.offset.x + dx,
              y: piece.offset.y + dy,
            }
          : { x: dx, y: dy },
      };
    },
    [lastMovePoint]
  );

  const finishMoving = useCallback(
    (piece: PuzzlePiece) => {
      onMoveComplete?.(piece);
    },
    [onMoveComplete]
  );

  const isPointInPiece = useCallback(
    (point: Point, piece: PuzzlePiece): boolean => {
      const xs = piece.points.map((pt) => pt.x + (piece.offset?.x || 0));
      const ys = piece.points.map((pt) => pt.y + (piece.offset?.y || 0));
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      return (
        point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
      );
    },
    []
  );

  return {
    startMoving,
    updateMovement,
    finishMoving,
    isPointInPiece,
    lastMovePoint,
  };
};
