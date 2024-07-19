import { checkModifiers } from "../ModifierUtils";

describe("checkModifiers", () => {
  it("should return true if no expected modifiers", () => {
    expect(checkModifiers(undefined, ["Ctrl"])).toBe(true);
  });

  it("should return false if no actual modifiers", () => {
    expect(checkModifiers(["Ctrl"], undefined)).toBe(false);
  });

  it("should return true if all expected modifiers are present", () => {
    expect(checkModifiers(["Ctrl", "Shift"], ["Ctrl", "Shift"])).toBe(true);
  });

  it("should return false if not all expected modifiers are present", () => {
    expect(checkModifiers(["Ctrl", "Shift"], ["Ctrl"])).toBe(false);
  });
});
