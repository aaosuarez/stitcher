import { test, expect, describe } from "vitest";
import { Pattern } from "./Pattern.ts";

describe("constructor", () => {
  test("throw for invalid size", () => {
    expect(() => {
      new Pattern(0, 0);
    }).toThrowError();
    expect(() => {
      new Pattern(-1, -1);
    }).toThrowError();
  });
});

describe("isInBounds", () => {
  test("coordinates are in bounds", () => {
    const pattern = new Pattern(2, 2);
    expect(pattern.isInBounds(0, 0)).toBe(true);
  });

  test("coordinates are not in bounds", () => {
    const pattern = new Pattern(2, 1);
    expect(pattern.isInBounds(-1, -1)).toBe(false);
    expect(pattern.isInBounds(2, 2)).toBe(false);
  });
});
