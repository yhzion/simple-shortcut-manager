import type {
  ModifierKeys,
  Shortcut,
  ShortcutGroup,
} from "../types/ShortcutTypes";
import { checkModifiers } from "../utils/ModifierUtils";

class ShortcutManager {
  private static instance: ShortcutManager;
  private groups: ShortcutGroup[] = [];
  private independentShortcuts: Shortcut[] = [];

  private constructor() {}

  public static getInstance(): ShortcutManager {
    if (!ShortcutManager.instance) {
      ShortcutManager.instance = new ShortcutManager();
    }
    return ShortcutManager.instance;
  }

  public static reset(): void {
    ShortcutManager.instance = new ShortcutManager();
  }

  public addGroup(group: ShortcutGroup): void {
    this.groups.push(group);
  }

  public addShortcutToGroup(groupName: string, shortcut: Shortcut): void {
    const group = this.groups.find((g) => g.name === groupName);
    if (group) {
      if (!this.isDuplicateShortcut(shortcut, group.shortcuts)) {
        group.shortcuts.push(shortcut);
      }
    } else {
      this.groups.push({ name: groupName, shortcuts: [shortcut] });
    }
  }

  public addIndependentShortcut(shortcut: Shortcut): void {
    if (!this.isDuplicateShortcut(shortcut, this.independentShortcuts)) {
      this.independentShortcuts.push(shortcut);
    }
  }

  public removeGroup(groupName: string): void {
    this.groups = this.groups.filter((g) => g.name !== groupName);
  }

  public removeShortcutFromGroup(
    groupName: string,
    shortcutName: string
  ): void {
    const group = this.groups.find((g) => g.name === groupName);
    if (group) {
      group.shortcuts = group.shortcuts.filter(
        (sc) => sc.name !== shortcutName
      );
    }
  }

  public removeIndependentShortcut(shortcutName: string): void {
    this.independentShortcuts = this.independentShortcuts.filter(
      (sc) => sc.name !== shortcutName
    );
  }

  public executeShortcut(keyCode: string, modifiers: ModifierKeys[]): void {
    // Check independent shortcuts first
    for (const shortcut of this.independentShortcuts) {
      if (
        shortcut.keyCode === keyCode &&
        checkModifiers(shortcut.modifiers, modifiers)
      ) {
        shortcut.action();
        return;
      }
    }

    // Check group shortcuts
    for (const group of this.groups) {
      for (const shortcut of group.shortcuts) {
        if (
          shortcut.keyCode === keyCode &&
          checkModifiers(shortcut.modifiers, modifiers)
        ) {
          shortcut.action();
          return;
        }
      }
    }
  }

  private isDuplicateShortcut(
    shortcut: Shortcut,
    shortcuts: Shortcut[]
  ): boolean {
    return shortcuts.some(
      (sc) =>
        sc.keyCode === shortcut.keyCode &&
        checkModifiers(sc.modifiers, shortcut.modifiers)
    );
  }
}

export { ShortcutManager };
