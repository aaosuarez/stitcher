import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Pattern } from "./Pattern.ts";
import { PatternRenderer } from "./PatternRenderer.ts";
import { ColorList } from "./ColorList.tsx";
import { useCanvasHandlers } from "./useCanvasHandlers.ts";

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
  const [viewport, setViewport] = useState(initialViewport);
  const [patternSize, setPatternSize] = useState(10);
  const pattern = useMemo(
    () => new Pattern(patternSize, patternSize),
    [patternSize],
  );
  const renderer = useMemo(() => new PatternRenderer(), []);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [selectedColor, setSelectedColor] = useState("500");

  const render = useCallback(() => {
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

  useEffect(() => {
    render();
  }, [render, renderTrigger]);

  const handleCellPaint = (x: number, y: number) => {
    const changed = pattern.setStitch(x, y, selectedColor);
    if (changed) {
      setRenderTrigger((prev) => prev + 1);
    }
  };

  const canvasHandlers = useCanvasHandlers({
    viewport,
    onViewportChange: setViewport,
    canvasRef,
    cellSize: renderer.cellSize,
    onCellPaint: handleCellPaint,
  });

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
          <ColorList
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </div>
        <canvas
          ref={canvasRef}
          {...canvasHandlers}
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
          }}
        ></canvas>
      </div>
    </div>
  );
}

export default App;
