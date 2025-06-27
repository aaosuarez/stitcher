export class Pattern {
  height: number;
  width: number;

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
}
