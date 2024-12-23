import { useState, useContext, useEffect, useCallback } from "react";
import { Point } from "../types";

interface PuzzlePiece {
  points: Point[];
  offset: Point;
  type: "drawn" | "auto";
}

// Replace state machine with simple string literal type
type PuzzleState = "waiting" | "drawing" | "moving";

interface UseProps {
  pieces: PuzzlePiece[];
  isEdit?: boolean;
}

const _usePuzzlePiece = ({
  pieces: originalPieces = [],
  isEdit = false,
}: UseProps) => {
  const [pieces, setPieces] = useState(originalPieces);
  const [currentState, setCurrentState] = useState<PuzzleState>("waiting");
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

  const handleMouseDown = useCallback(
    (evt: MouseEvent) => {
      if (currentState === "waiting") {
        const point = {
          x: evt.clientX - imageOffset.x,
          y: evt.clientY - imageOffset.y,
        };

        setPieces((pieces) => [
          ...pieces,
          { points: [point], offset: { x: 0, y: 0 }, type: "drawn" },
        ]);
        setCurrentState("drawing");
      }
    },
    [currentState, currentPieces, setCurrentState, setLastMovePoint]
  );

  const handleMouseMove = useCallback(
    (evt: MouseEvent) => {
      const initialDistance = 64;
      const point = {
        x: evt.clientX - initialDistance,
        y: evt.clientY - initialDistance,
      };

      if (currentState === "drawing") {
        setPieces((pieces) => {
          const currentPiece = pieces[pieces.length - 1];
          return [
            ...pieces.slice(0, -1),
            {
              ...currentPiece,
              points: [...currentPiece.points, point],
            },
          ];
        });
      } else if (currentState === "moving") {
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
    [currentState, lastMovePoint, setLastMovePoint]
  );

  const handleMouseUp = useCallback(() => {
    if (currentState === "drawing") {
      const currentPiece = currentPieces[currentPieces.length - 1];
      if (isValidPiece(currentPiece)) {
        onCreatePiece?.(currentPiece);
      } else {
        setPieces((pieces) => pieces.slice(0, -1));
      }
    } else if (currentState === "moving") {
      onUpdatePiece?.(currentPieces[currentPieces.length - 1]);
    }
    setCurrentState("waiting");
  }, [currentState, currentPieces, onCreatePiece, onUpdatePiece]);

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
    isDrawing: currentState === "drawing",
    isMoving: currentState === "moving",
    hasPending: false,
    removePiece: onRemovePiece,
    completePuzzle: onComplete,
  };
};

const isValidPiece = (piece: PuzzlePiece) => {
  return piece.points.length >= 3;
};
