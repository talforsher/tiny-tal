import { useState, useEffect, useCallback } from "react";
import { Point } from "../types";
import { PuzzleState, PieceType } from "../types/enums";

interface PuzzlePiece {
  points: Point[];
  offset: Point;
  type: PieceType;
}

interface UseProps {
  pieces: PuzzlePiece[];
  isEdit?: boolean;
}

const _usePuzzlePiece = ({
  pieces: originalPieces = [],
  isEdit = false,
}: UseProps) => {
  const [pieces, setPieces] = useState(originalPieces);
  const [currentState, setCurrentState] = useState<PuzzleState>(
    PuzzleState.WAITING
  );
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const [lastMovePoint, setLastMovePoint] = useState({ x: 0, y: 0 });

  return {
    pieces,
    setPieces,
    currentState,
    setCurrentState,
    moveOffset,
    setMoveOffset,
    lastMovePoint,
    setLastMovePoint,
  };
};

interface Props {
  imageOffset: Point;
  pieces: PuzzlePiece[];
  isEdit?: boolean;
  onCreatePiece?: (piece: PuzzlePiece) => void;
  onUpdatePiece?: (piece: PuzzlePiece) => void;
  onRemovePiece?: (index: number) => void;
  onComplete?: () => void;
}

export const usePuzzlePiece = ({
  imageOffset,
  pieces,
  isEdit,
  onCreatePiece,
  onUpdatePiece,
  onRemovePiece,
  onComplete,
}: Props) => {
  const {
    pieces: currentPieces,
    setPieces,
    currentState,
    setCurrentState,
    lastMovePoint,
    setLastMovePoint,
  } = _usePuzzlePiece({
    pieces,
    isEdit,
  });

  const isPointInPiece = useCallback(
    (point: Point) => {
      return currentPieces.findIndex((p) => {
        const xs = p.points.map((pt) => pt.x + p.offset.x);
        const ys = p.points.map((pt) => pt.y + p.offset.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        return (
          point.x >= minX &&
          point.x <= maxX &&
          point.y >= minY &&
          point.y <= maxY
        );
      });
    },
    [currentPieces]
  );

  const handleMouseDown = useCallback(
    (evt: MouseEvent) => {
      if (currentState !== PuzzleState.WAITING) return;

      const point = {
        x: evt.clientX - imageOffset.x,
        y: evt.clientY - imageOffset.y,
      };

      const pieceIndex = isPointInPiece(point);

      if (typeof pieceIndex === "number" && pieceIndex >= 0) {
        setCurrentState(PuzzleState.MOVING);
        setLastMovePoint(point);
      } else {
        setPieces((pieces) => [
          ...pieces,
          {
            points: [point],
            offset: { x: 0, y: 0 },
            type: PieceType.DRAWN,
          },
        ]);
        setCurrentState(PuzzleState.DRAWING);
      }
    },
    [
      currentState,
      imageOffset,
      setCurrentState,
      setLastMovePoint,
      setPieces,
      isPointInPiece,
    ]
  );

  const handleMouseMove = useCallback(
    (evt: MouseEvent) => {
      const point = {
        x: evt.clientX - imageOffset.x,
        y: evt.clientY - imageOffset.y,
      };

      if (currentState === PuzzleState.DRAWING) {
        setPieces((pieces) => {
          const currentPiece = pieces[pieces.length - 1];
          const lastPoint = currentPiece.points[currentPiece.points.length - 1];
          const distance = Math.sqrt(
            Math.pow(point.x - lastPoint.x, 2) +
              Math.pow(point.y - lastPoint.y, 2)
          );

          if (distance < 5) return pieces;

          return [
            ...pieces.slice(0, -1),
            {
              ...currentPiece,
              points: [...currentPiece.points, point],
            },
          ];
        });
      } else if (currentState === PuzzleState.MOVING) {
        setPieces((pieces) => {
          const currentPiece = pieces[pieces.length - 1];
          const dx = point.x - lastMovePoint.x;
          const dy = point.y - lastMovePoint.y;
          return [
            ...pieces.slice(0, -1),
            {
              ...currentPiece,
              offset: {
                x: currentPiece.offset.x + dx,
                y: currentPiece.offset.y + dy,
              },
            },
          ];
        });
        setLastMovePoint(point);
      }
    },
    [currentState, imageOffset, lastMovePoint, setLastMovePoint, setPieces]
  );

  const handleMouseUp = useCallback(() => {
    if (currentState === PuzzleState.DRAWING) {
      const currentPiece = currentPieces[currentPieces.length - 1];
      if (isValidPiece(currentPiece)) {
        onCreatePiece?.(currentPiece);
      } else {
        setPieces((pieces) => pieces.slice(0, -1));
      }
    } else if (currentState === PuzzleState.MOVING) {
      onUpdatePiece?.(currentPieces[currentPieces.length - 1]);
    }
    setCurrentState(PuzzleState.WAITING);
  }, [
    currentState,
    currentPieces,
    onCreatePiece,
    onUpdatePiece,
    setPieces,
    setCurrentState,
  ]);

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    pieces: currentPieces,
    isDrawing: currentState === PuzzleState.DRAWING,
    isMoving: currentState === PuzzleState.MOVING,
    hasPending: false,
    removePiece: onRemovePiece,
    completePuzzle: onComplete,
  };
};

const isValidPiece = (piece: PuzzlePiece) => {
  return piece.points.length >= 3;
};
