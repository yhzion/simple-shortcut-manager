import { ShortcutManager } from "../managers/ShortcutManager";
import type { ModifierKeys } from "../types/ShortcutTypes";
import { isMacOS } from "../utils/OSUtils";

export function handleKeyEvent(event: KeyboardEvent): void {
  const manager = ShortcutManager.getInstance();
  const keyCode = event.code;
  const modifiers: ModifierKeys[] = [];

  if (event.shiftKey) modifiers.push("Shift");
  if (isMacOS()) {
    if (event.metaKey) modifiers.push("Meta");
  } else {
    if (event.ctrlKey) modifiers.push("Ctrl");
  }
  if (event.altKey) modifiers.push("Alt");

  manager.executeShortcut(keyCode, modifiers);
}
