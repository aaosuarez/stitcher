import { useEffect, useRef, useState } from "react";
import "./App.css";

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
  }, [viewport]);

  const draw = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "purple";
    const rectSize = 100;
    context.fillRect(0, 0, rectSize, rectSize);
  };

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
