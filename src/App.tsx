import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Pattern } from "./Pattern.ts";
import { PatternRenderer } from "./PatternRenderer.ts";
import { ColorList } from "./ColorList.tsx";

export type Position = {
  x: number;
  y: number;
};

export type Viewport = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

const initialViewport: Viewport = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMousePosition = useRef<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewport, setViewport] = useState(initialViewport);
  const [patternSize, setPatternSize] = useState(2);
  const pattern = useMemo(
    () => new Pattern(patternSize, patternSize),
    [patternSize],
  );
  const renderer = useMemo(() => new PatternRenderer(), []);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    context.save();

    context.translate(viewport.offsetX, viewport.offsetY);
    context.scale(viewport.scale, viewport.scale);

    renderer.render(context, pattern);

    context.restore();
  }, [viewport, renderer, pattern, renderTrigger]);

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
      x: Math.floor(worldPosition.x / renderer.cellSize),
      y: Math.floor(worldPosition.y / renderer.cellSize),
    };
  }

  function screenToPatternCell(screenPosition: Position): Position {
    const worldPosition = screenToWorld(screenPosition);
    return worldToPatternCell(worldPosition);
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePosition.current.x;
    const dy = e.clientY - lastMousePosition.current.y;

    setViewport((prev) => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy,
    }));

    lastMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // TODO: Figure out how to disable Safari two-finger swipe back behavior
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    // Use negative delta values to mimic MacOS native drag
    setViewport((prev) => ({
      ...prev,
      offsetX: prev.offsetX - e.deltaX,
      offsetY: prev.offsetY - e.deltaY,
    }));
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cell = screenToPatternCell({
      x: e.clientX,
      y: e.clientY,
    });
    const changed = pattern.toggleStitch(cell.x, cell.y);
    if (changed) {
      setRenderTrigger((prev) => prev + 1);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div>
        <label>
          Pattern size:
          <input
            value={patternSize}
            onChange={(e) => setPatternSize(e.target.valueAsNumber)}
            type={"number"}
            min={1}
            max={100}
          />
        </label>
      </div>
      <div style={{ display: "flex", height: "100%", width: "100%" }}>
        <div
          style={{
            display: "flex",
            width: "140px",
            flexShrink: 0,
            flexDirection: "column",
          }}
        >
          <ColorList />
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onClick={handleClick}
          style={{
            width: "100%",
            height: "100%",
            cursor: isDragging ? "grabbing" : "grab",
            flexGrow: 1,
          }}
        ></canvas>
      </div>
    </div>
  );
}

export default App;
