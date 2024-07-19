import { isMacOS } from "../OSUtils";

describe("isMacOS", () => {
  it("should return true for Mac user agents", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mac",
      writable: true,
    });
    expect(isMacOS()).toBe(true);
  });

  it("should return false for non-Mac user agents", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Windows",
      writable: true,
    });
    expect(isMacOS()).toBe(false);
  });
});
