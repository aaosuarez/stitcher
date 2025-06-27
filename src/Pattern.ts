export class Pattern {
  height: number;
  width: number;
  stitches: Map<string, number> = new Map();

  constructor(height: number, width: number) {
    if (height < 1 || width < 1) {
      throw new Error("Pattern size must be greater than 0");
    }
    this.height = height;
    this.width = width;
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  toggleStitch(x: number, y: number): boolean {
    if (!this.isInBounds(x, y)) return false;
    const key = this.getStitchKey(x, y);
    if (this.stitches.has(key)) {
      this.stitches.delete(key);
    } else {
      this.stitches.set(key, 1);
    }
    return true;
  }

  hasStitch(x: number, y: number): boolean {
    const key = this.getStitchKey(x, y);
    return this.stitches.has(key);
  }

  private getStitchKey(x: number, y: number): string {
    return `${x},${y}`;
  }
}
