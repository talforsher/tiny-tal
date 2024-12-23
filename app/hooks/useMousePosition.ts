import { useState, useCallback } from "react";
import { Point } from "../types";

interface UseMousePositionProps {
  offset: Point;
}

export const useMousePosition = ({ offset }: UseMousePositionProps) => {
  const getMousePosition = useCallback(
    (evt: MouseEvent): Point => ({
      x: evt.clientX - offset.x,
      y: evt.clientY - offset.y,
    }),
    [offset]
  );

  return { getMousePosition };
};
