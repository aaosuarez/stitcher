import type { Pattern } from "./Pattern.ts";

import { threadColors } from "./ColorHelpers.ts";

export class PatternRenderer {
  cellSize = 100;
  private borderWidth = 1;

  render(context: CanvasRenderingContext2D, pattern: Pattern) {
    this.clearCanvas(context);
    this.drawGridAndStitches(context, pattern);
  }

  private clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  private drawGridAndStitches(
    context: CanvasRenderingContext2D,
    pattern: Pattern,
  ) {
    // Draw all cells with grid
    for (let y = 0; y < pattern.height; y++) {
      for (let x = 0; x < pattern.width; x++) {
        const cellX = x * this.cellSize;
        const cellY = y * this.cellSize;

        // Fill the cell
        const stitch = pattern.getStitchAt(x, y);
        const threadColor =
          stitch != null ? threadColors.getThreadById(stitch) : null;
        context.fillStyle = threadColor?.hex ?? "#f8f8f8";
        context.fillRect(cellX, cellY, this.cellSize, this.cellSize);

        // Draw border
        context.strokeStyle = "#000";
        context.lineWidth = this.borderWidth;
        context.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
      }
    }
  }
}
