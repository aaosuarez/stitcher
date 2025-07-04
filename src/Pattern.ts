export class Pattern {
  height: number;
  width: number;
  stitches: Map<string, string> = new Map();

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

  setStitch(x: number, y: number, threadId: string): boolean {
    if (!this.isInBounds(x, y)) return false;

    const key = this.getStitchKey(x, y);
    const oldValue = this.stitches.get(key);
    if (oldValue === threadId) return false;

    this.stitches.set(key, threadId);
    return true;
  }

  clearStitch(x: number, y: number): boolean {
    if (!this.isInBounds(x, y)) return false;
    const key = this.getStitchKey(x, y);
    if (!this.stitches.has(key)) {
      return false;
    }
    this.stitches.delete(key);
    return true;
  }

  getStitchAt(x: number, y: number): string | undefined {
    const key = this.getStitchKey(x, y);
    return this.stitches.get(key);
  }

  private getStitchKey(x: number, y: number): string {
    return `${x},${y}`;
  }
}
