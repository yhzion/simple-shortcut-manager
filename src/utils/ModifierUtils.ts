import type { ModifierKeys } from "../types/ShortcutTypes";
import { isMacOS } from "./OSUtils";

export function normalizeModifiers(modifiers: ModifierKeys[]): ModifierKeys[] {
  if (isMacOS()) {
    return modifiers.map((mod) => (mod === "Ctrl" ? "Meta" : mod));
  } else {
    return modifiers.map((mod) => (mod === "Meta" ? "Ctrl" : mod));
  }
}

export function checkModifiers(
  expected?: ModifierKeys[],
  actual?: ModifierKeys[]
): boolean {
  if (!expected) return true;
  if (!actual) return false;

  const normalizedExpected = normalizeModifiers(expected);
  const normalizedActual = normalizeModifiers(actual);

  return normalizedExpected.every((mod) => normalizedActual.includes(mod));
}
