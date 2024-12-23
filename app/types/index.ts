export interface Point {
  x: number;
  y: number;
}

export interface PuzzlePiece {
  id: number;
  points: Point[];
  offset?: Point;
}

export interface Puzzle {
  id: string;
  image: string;
  title: string;
  description: string;
}
