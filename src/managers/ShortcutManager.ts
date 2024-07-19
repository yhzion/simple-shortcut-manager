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
  private shortcutMap: Map<string, Shortcut[]> = new Map();

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
    group.shortcuts.forEach((shortcut) => this.addShortcutToMap(shortcut));
  }

  public addShortcutToGroup(groupName: string, shortcut: Shortcut): void {
    const group = this.groups.find((g) => g.name === groupName);
    if (group) {
      if (!this.isDuplicateShortcut(shortcut, group.shortcuts)) {
        group.shortcuts.push(shortcut);
        this.addShortcutToMap(shortcut);
      }
    } else {
      this.groups.push({ name: groupName, shortcuts: [shortcut] });
      this.addShortcutToMap(shortcut);
    }
  }

  public addIndependentShortcut(shortcut: Shortcut): void {
    if (!this.isDuplicateShortcut(shortcut, this.independentShortcuts)) {
      this.independentShortcuts.push(shortcut);
      this.addShortcutToMap(shortcut);
    }
  }

  public removeGroup(groupName: string): void {
    this.groups = this.groups.filter((g) => g.name !== groupName);
    this.rebuildShortcutMap();
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
      this.rebuildShortcutMap();
    }
  }

  public removeIndependentShortcut(shortcutName: string): void {
    this.independentShortcuts = this.independentShortcuts.filter(
      (sc) => sc.name !== shortcutName
    );
    this.rebuildShortcutMap();
  }

  public executeShortcut(
    keyCode: string,
    modifiers: ModifierKeys[],
    event: KeyboardEvent
  ): void {
    const shortcuts = this.shortcutMap.get(keyCode);
    if (!shortcuts) return;

    for (const shortcut of shortcuts) {
      if (checkModifiers(shortcut.modifiers, modifiers)) {
        if (shortcut.preventDefault) {
          event.preventDefault();
        }
        shortcut.action();
        return;
      }
    }
  }

  private addShortcutToMap(shortcut: Shortcut): void {
    if (!this.shortcutMap.has(shortcut.keyCode)) {
      this.shortcutMap.set(shortcut.keyCode, []);
    }
    this.shortcutMap.get(shortcut.keyCode)?.push(shortcut);
  }

  private rebuildShortcutMap(): void {
    this.shortcutMap.clear();
    this.independentShortcuts.forEach((shortcut) =>
      this.addShortcutToMap(shortcut)
    );
    this.groups.forEach((group) =>
      group.shortcuts.forEach((shortcut) => this.addShortcutToMap(shortcut))
    );
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
