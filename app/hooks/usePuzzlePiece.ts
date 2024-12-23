import { useEffect, useCallback } from "react";
import { Point, PuzzlePiece } from "../types";
import { PuzzleState, PieceType } from "../types/enums";
import { useMousePosition } from "./useMousePosition";
import { usePieceDrawing } from "./usePieceDrawing";
import { usePieceMovement } from "./usePieceMovement";
import { PuzzleService } from "../services/puzzleService";
import { usePuzzleContext } from "../contexts/PuzzleContext";

interface Props {
  imageOffset: Point;
  onCreatePiece?: (piece: PuzzlePiece) => void;
  onUpdatePiece?: (piece: PuzzlePiece) => void;
  isEdit?: boolean;
}

export const usePuzzlePiece = ({
  imageOffset,
  onCreatePiece,
  onUpdatePiece,
  isEdit = false,
}: Props) => {
  const {
    pieces,
    setPieces,
    currentState,
    setCurrentState,
    removePiece,
    completePuzzle,
  } = usePuzzleContext();

  const { getMousePosition } = useMousePosition({ offset: imageOffset });
  const { startDrawing, continueDrawing, finishDrawing } = usePieceDrawing({
    onDrawComplete: onCreatePiece,
  });
  const { startMoving, updateMovement, finishMoving } = usePieceMovement({
    onMoveComplete: onUpdatePiece,
  });

  const handleMouseDown = useCallback(
    (evt: MouseEvent) => {
      if (currentState !== PuzzleState.WAITING) return;

      const point = getMousePosition(evt);
      const pieceIndex = pieces.findIndex((piece) =>
        PuzzleService.isPointInPiece(point, piece)
      );

      if (pieceIndex >= 0) {
        setCurrentState(PuzzleState.MOVING);
        startMoving(point);
      } else {
        const newPiece: PuzzlePiece = {
          id: pieces.length,
          ...startDrawing(point),
        };
        setPieces((prev: PuzzlePiece[]) => [...prev, newPiece]);
        setCurrentState(PuzzleState.DRAWING);
      }
    },
    [
      currentState,
      pieces,
      getMousePosition,
      startDrawing,
      startMoving,
      setCurrentState,
      setPieces,
    ]
  );

  const handleMouseMove = useCallback(
    (evt: MouseEvent) => {
      const point = getMousePosition(evt);

      if (currentState === PuzzleState.DRAWING) {
        setPieces((prev: PuzzlePiece[]) => {
          const currentPiece = prev[prev.length - 1];
          const updatedPiece = continueDrawing(currentPiece, point);
          return updatedPiece
            ? [...prev.slice(0, -1), { ...updatedPiece, id: currentPiece.id }]
            : prev;
        });
      } else if (currentState === PuzzleState.MOVING) {
        setPieces((prev: PuzzlePiece[]) => {
          const currentPiece = prev[prev.length - 1];
          const updatedPiece = updateMovement(currentPiece, point);
          return [
            ...prev.slice(0, -1),
            { ...updatedPiece, id: currentPiece.id },
          ];
        });
      }
    },
    [currentState, getMousePosition, continueDrawing, updateMovement, setPieces]
  );

  const handleMouseUp = useCallback(() => {
    if (currentState === PuzzleState.DRAWING) {
      const currentPiece = pieces[pieces.length - 1];
      if (!finishDrawing(currentPiece)) {
        setPieces((prev: PuzzlePiece[]) => prev.slice(0, -1));
      }
    } else if (currentState === PuzzleState.MOVING) {
      finishMoving(pieces[pieces.length - 1]);
    }
    setCurrentState(PuzzleState.WAITING);
  }, [
    currentState,
    pieces,
    finishDrawing,
    finishMoving,
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
    pieces,
    isDrawing: currentState === PuzzleState.DRAWING,
    isMoving: currentState === PuzzleState.MOVING,
    hasPending: false,
    removePiece,
    completePuzzle,
  };
};
