import { useRef, useState } from "react";
import type { Position, Viewport } from "./App.tsx";

type useCanvasHandlersProps = {
  viewport: Viewport;
  onViewportChange: (viewport: Viewport) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  cellSize: number;
  onCellPaint: (x: number, y: number) => void;
};

type InteractionMode = "idle" | "painting" | "dragging";

export const useCanvasHandlers = ({
  viewport,
  onViewportChange,
  canvasRef,
  cellSize,
  onCellPaint,
}: useCanvasHandlersProps) => {
  const [mode, setMode] = useState<InteractionMode>("idle");
  const lastMousePosition = useRef<Position>({ x: 0, y: 0 });

  function screenToCanvas(screenPosition: Position): Position {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return screenPosition;
    const devicePixelRatio = window.devicePixelRatio || 1;
    return {
      x: (screenPosition.x - rect.left) * devicePixelRatio,
      y: (screenPosition.y - rect.top) * devicePixelRatio,
    };
  }

  function canvasToWorld(canvasPosition: Position): Position {
    return {
      x: (canvasPosition.x - viewport.offsetX) / viewport.scale,
      y: (canvasPosition.y - viewport.offsetY) / viewport.scale,
    };
  }

  function screenToWorld(screenPosition: Position): Position {
    const canvasPosition = screenToCanvas(screenPosition);
    return canvasToWorld(canvasPosition);
  }

  function worldToPatternCell(worldPosition: Position): Position {
    return {
      x: Math.floor(worldPosition.x / cellSize),
      y: Math.floor(worldPosition.y / cellSize),
    };
  }

  function screenToPatternCell(screenPosition: Position): Position {
    const worldPosition = screenToWorld(screenPosition);
    return worldToPatternCell(worldPosition);
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  const handleMouseUp = () => {
    setMode("idle");
  };

  // TODO: Figure out how to disable Safari two-finger swipe back behavior
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // Use negative delta values to mimic MacOS native drag
    onViewportChange({
      ...viewport,
      offsetX: viewport.offsetX - e.deltaX,
      offsetY: viewport.offsetY - e.deltaY,
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (e.button === 0) {
      setMode("painting");
    } else if (e.button == 2) {
      setMode("dragging");
    }
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = screenToPatternCell({
      x: e.clientX,
      y: e.clientY,
    });
    onCellPaint(cell.x, cell.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode === "dragging") {
      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;

      onViewportChange({
        ...viewport,
        offsetX: viewport.offsetX - dx,
        offsetY: viewport.offsetY - dy,
      });
    } else if (mode === "painting") {
      const cell = screenToPatternCell({ x: e.clientX, y: e.clientY });
      onCellPaint(cell.x, cell.y);
    }

    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  return {
    onContextMenu: handleContextMenu,
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onWheel: handleWheel,
    onClick: handleClick,
  };
};
