import { describe, it, expect } from "vitest";

describe("Example Test", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2);
  });

  it("should validate basic math", () => {
    const result = 5 * 5;
    expect(result).toBe(25);
  });
});

