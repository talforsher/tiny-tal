import { PuzzlePiece, Point } from "../types";

export class PuzzleService {
  static validatePiece(piece: PuzzlePiece): boolean {
    return piece.points.length >= 3;
  }

  static calculateDistance(point1: Point, point2: Point): number {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }

  static getBoundingBox(piece: PuzzlePiece): {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  } {
    const xs = piece.points.map((pt) => pt.x + (piece.offset?.x || 0));
    const ys = piece.points.map((pt) => pt.y + (piece.offset?.y || 0));
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }

  static isPointInPiece(point: Point, piece: PuzzlePiece): boolean {
    const { minX, maxX, minY, maxY } = this.getBoundingBox(piece);
    return (
      point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
    );
  }

  static calculateOffset(currentPoint: Point, lastPoint: Point): Point {
    return {
      x: currentPoint.x - lastPoint.x,
      y: currentPoint.y - lastPoint.y,
    };
  }
}
