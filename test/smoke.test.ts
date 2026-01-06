import { describe, it, expect } from "vitest";
import { SymphonyRadioClient } from "../src/index.js";

describe("symphony-radio-api (smoke)", () => {
  it("constructs client", () => {
    const c = new SymphonyRadioClient();
    expect(c).toBeTruthy();
  });
});
