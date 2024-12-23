import { useState, useContext, useEffect, useCallback } from "react";
import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";
import { Point } from "../types";

interface PuzzlePiece {
  points: Point[];
  offset: Point;
  type: "drawn" | "auto";
}

// State machine for puzzle piece creation
const puzzlePieceMachine = createMachine({
  id: "puzzlePiece",
  initial: "waiting",
  context: {
    firstTime: true,
    hasPending: false,
    autoShape: null,
    hasDrawn: false,
  },
  states: {
    waiting: {
      on: {
        DRAW: "drawing",
        MOVE: "moving",
      },
    },
    drawing: {
      on: {
        FINISH: "waiting",
        CANCEL: "waiting",
      },
    },
    moving: {
      on: {
        FINISH: "waiting",
        CANCEL: "waiting",
      },
    },
  },
});

interface UseProps {
  pieces: PuzzlePiece[];
  isEdit?: boolean;
}

const _usePuzzlePiece = ({
  pieces: originalPieces = [],
  isEdit = false,
}: UseProps) => {
  const [pieces, setPieces] = useState(originalPieces);
  const [state, send] = useMachine(puzzlePieceMachine);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  const [lastMovePoint, setLastMovePoint] = useState({ x: 0, y: 0 });

  return {
    pieces,
    setPieces,
    state,
    send,
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
    state,
    send,
    lastMovePoint,
    setLastMovePoint,
  } = _usePuzzlePiece({
    pieces,
    isEdit,
  });
  const handleMouseDown = useCallback(
    (evt: MouseEvent) => {
      if (state.matches("waiting")) {
        const point = {
          x: evt.clientX - imageOffset.x,
          y: evt.clientY - imageOffset.y,
        };

        setPieces((pieces) => [
          ...pieces,
          { points: [point], offset: { x: 0, y: 0 }, type: "drawn" },
        ]);
        send({ type: "DRAW" });
      }
    },
    [state, currentPieces, send, setLastMovePoint]
  );

  const handleMouseMove = useCallback(
    (evt: MouseEvent) => {
      const initialDistance = 64;
      const point = {
        x: evt.clientX - initialDistance,
        y: evt.clientY - initialDistance,
      };

      if (state.matches("drawing")) {
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
      } else if (state.matches("moving")) {
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
    [state, lastMovePoint, setLastMovePoint]
  );

  const handleMouseUp = useCallback(() => {
    if (state.matches("drawing")) {
      const currentPiece = currentPieces[currentPieces.length - 1];
      if (isValidPiece(currentPiece)) {
        onCreatePiece?.(currentPiece);
      } else {
        setPieces((pieces) => pieces.slice(0, -1));
      }
    } else if (state.matches("moving")) {
      onUpdatePiece?.(currentPieces[currentPieces.length - 1]);
    }
    send({ type: "FINISH" });
  }, [state, currentPieces, onCreatePiece, onUpdatePiece, send]);

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
    isDrawing: state.matches("drawing"),
    isMoving: state.matches("moving"),
    hasPending: state.context.hasPending,
    removePiece: onRemovePiece,
    completePuzzle: onComplete,
  };
};

const isValidPiece = (piece: PuzzlePiece) => {
  return piece.points.length >= 3;
};
