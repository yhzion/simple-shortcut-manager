import type { ModifierKeys } from "../types/ShortcutTypes";

export function checkModifiers(
  expected?: ModifierKeys[],
  actual?: ModifierKeys[]
): boolean {
  if (!expected) return true;
  if (!actual) return false;
  return expected.every((mod) => actual.includes(mod));
}
