import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { PuzzlePiece } from "../types/index";
import { PuzzleState } from "../types/enums";

interface PuzzleContextType {
  pieces: PuzzlePiece[];
  currentState: PuzzleState;
  isDrawing: boolean;
  isMoving: boolean;
  hasPending: boolean;
  setPieces: (
    pieces: PuzzlePiece[] | ((prev: PuzzlePiece[]) => PuzzlePiece[])
  ) => void;
  setCurrentState: (state: PuzzleState) => void;
  removePiece: (index: number) => void;
  completePuzzle: () => void;
}

const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined);

interface PuzzleProviderProps {
  children: ReactNode;
  initialPieces?: PuzzlePiece[];
  onComplete?: () => void;
}

export const PuzzleProvider = ({
  children,
  initialPieces = [],
  onComplete,
}: PuzzleProviderProps) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>(initialPieces);
  const [currentState, setCurrentState] = useState<PuzzleState>(
    PuzzleState.WAITING
  );

  const removePiece = useCallback((index: number) => {
    setPieces((prev: PuzzlePiece[]) =>
      prev.filter((_: PuzzlePiece, i: number) => i !== index)
    );
  }, []);

  const value = {
    pieces,
    currentState,
    isDrawing: currentState === PuzzleState.DRAWING,
    isMoving: currentState === PuzzleState.MOVING,
    hasPending: false,
    setPieces,
    setCurrentState,
    removePiece,
    completePuzzle: onComplete || (() => {}),
  };

  return (
    <PuzzleContext.Provider value={value}>{children}</PuzzleContext.Provider>
  );
};

export const usePuzzleContext = () => {
  const context = useContext(PuzzleContext);
  if (context === undefined) {
    throw new Error("usePuzzleContext must be used within a PuzzleProvider");
  }
  return context;
};
