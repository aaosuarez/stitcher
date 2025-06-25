import { useEffect, useRef, useState } from "react";
import "./App.css";

type Position = {
  x: number;
  y: number;
};

type Viewport = {
  offsetX: number;
  offsetY: number;
};

const initialViewport: Viewport = {
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

    draw(context, viewport);
  }, [viewport]);

  const draw = (context: CanvasRenderingContext2D, viewport: Viewport) => {
    context.translate(viewport.offsetX, viewport.offsetY);
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

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
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
