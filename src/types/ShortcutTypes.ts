export type ModifierKeys = "Shift" | "Ctrl" | "Alt" | "Meta";

export interface Shortcut {
  keyCode: string;
  modifiers?: ModifierKeys[];
  action: () => void;
  name: string;
  description?: string;
  context?: string;
  preventDefault?: boolean;
}

export interface ShortcutGroup {
  name: string;
  shortcuts: Shortcut[];
}
