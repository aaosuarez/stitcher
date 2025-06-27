import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Pattern } from "./Pattern.ts";

type Position = {
  x: number;
  y: number;
};

type Viewport = {
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
  const pattern = new Pattern(patternSize, patternSize);

  const draw = (context: CanvasRenderingContext2D) => {
    const cellSize = 100;
    const borderWidth = 1;

    // Draw all cells with grid
    for (let y = 0; y < pattern.height; y++) {
      for (let x = 0; x < pattern.width; x++) {
        const cellX = x * cellSize;
        const cellY = y * cellSize;

        // Fill the cell
        context.fillStyle = "#f8f8f8";
        context.fillRect(cellX, cellY, cellSize, cellSize);

        // Draw border
        context.strokeStyle = "#000";
        context.lineWidth = borderWidth;
        context.strokeRect(cellX, cellY, cellSize, cellSize);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.translate(viewport.offsetX, viewport.offsetY);
    context.scale(viewport.scale, viewport.scale);

    draw(context);

    context.restore();
  }, [viewport, draw]);

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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div>
        <label>
          Pattern size:
          <input
            value={patternSize}
            onChange={(e) => setPatternSize(e.target.valueAsNumber)}
            type={"number"}
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        style={{
          width: "100%",
          height: "100%",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      ></canvas>
    </div>
  );
}

export default App;
