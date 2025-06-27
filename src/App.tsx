import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Pattern } from "./Pattern.ts";
import { PatternRenderer } from "./PatternRenderer.ts";

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
  const pattern = useMemo(
    () => new Pattern(patternSize, patternSize),
    [patternSize],
  );
  const renderer = useMemo(() => new PatternRenderer(), []);

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
  }, [viewport, renderer, pattern]);

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
            min={1}
            max={100}
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
