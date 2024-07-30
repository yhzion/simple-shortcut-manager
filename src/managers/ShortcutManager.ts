import type {
  ModifierKeys,
  Shortcut,
  ShortcutGroup,
} from "../types/ShortcutTypes";
import { checkModifiers } from "../utils/ModifierUtils";
import { generateUUID } from "../utils/UUIDUtils";

class ShortcutManager {
  private static instance: ShortcutManager;
  private groups: ShortcutGroup[] = [];
  private independentShortcuts: Shortcut[] = [];
  private shortcutMap: Map<string, Shortcut> = new Map();

  private constructor() {}

  public static getInstance(): ShortcutManager {
    return (ShortcutManager.instance ??= new ShortcutManager());
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
    group
      ? !this.isDuplicateShortcut(shortcut, group.shortcuts) &&
        group.shortcuts.push(shortcut)
      : this.groups.push({ name: groupName, shortcuts: [shortcut] });
    this.addShortcutToMap(shortcut);
  }

  public addIndependentShortcut(shortcut: Shortcut): void {
    if (this.isDuplicateShortcut(shortcut, this.independentShortcuts)) return;
    this.independentShortcuts.push(shortcut);
    this.addShortcutToMap(shortcut);
  }

  public removeGroup(groupName: string): void {
    this.groups = this.groups.filter((g) => g.name !== groupName);
    this.rebuildShortcutMap();
  }

  public removeShortcutById(shortcutId: string): void {
    const shortcut = this.shortcutMap.get(shortcutId);

    // Remove shortcut from groups
    this.groups.forEach((group) => {
      group.shortcuts = group.shortcuts.filter((sc) => sc !== shortcut);
    });
    // Remove shortcut from independent shortcuts
    this.independentShortcuts = this.independentShortcuts.filter(
      (sc) => sc !== shortcut
    );

    this.shortcutMap.delete(shortcutId);
    this.rebuildShortcutMap();
  }

  public removeShortcutByKeyCodeAndModifiers(
    keyCode: string,
    modifiers: ModifierKeys[]
  ): void {
    const shortcutId = this.getShortcutIdByKeyCodeAndModifiers(
      keyCode,
      modifiers
    );
    if (shortcutId) {
      this.removeShortcutById(shortcutId);
    }
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

  private getShortcutIdByKeyCodeAndModifiers(
    keyCode: string,
    modifiers: ModifierKeys[]
  ): string | null {
    for (let [key, shortcutInstance] of this.shortcutMap.entries()) {
      if (
        shortcutInstance.keyCode === keyCode &&
        checkModifiers(shortcutInstance.modifiers, modifiers)
      ) {
        return key;
      }
    }
    return null;
  }

  private getShortcutByKeyCodeAndModifiers(
    keyCode: string,
    modifiers: ModifierKeys[]
  ): Shortcut | null {
    for (let [, shortcutInstance] of this.shortcutMap.entries()) {
      if (
        shortcutInstance.keyCode === keyCode &&
        checkModifiers(shortcutInstance.modifiers, modifiers)
      ) {
        return shortcutInstance;
      }
    }
    return null;
  }

  public executeShortcut(
    keyCode: string,
    modifiers: ModifierKeys[],
    event: KeyboardEvent
  ): void {
    const shortcut = this.getShortcutByKeyCodeAndModifiers(keyCode, modifiers);
    if (shortcut === null) return;

    if (checkModifiers(shortcut.modifiers, modifiers)) {
      if (shortcut.preventDefault) {
        event.preventDefault();
      }
      shortcut.action();
      return;
    }
  }

  private addShortcutToMap(shortcut: Shortcut): void {
    let shortcutId: string | null = null;
    for (let [key, shortcutInstance] of this.shortcutMap.entries()) {
      if (
        shortcutInstance.keyCode === shortcut.keyCode &&
        checkModifiers(shortcutInstance.modifiers, shortcut.modifiers)
      ) {
        shortcutId = key;
        break;
      }
    }
    if (shortcutId !== null) {
      const _shortcut = this.shortcutMap.get(shortcutId);
      _shortcut!.keyCode = shortcut.keyCode;
      _shortcut!.modifiers = shortcut.modifiers;
    } else {
      shortcutId = generateUUID();
      this.shortcutMap.set(shortcutId, shortcut);
    }
  }

  private rebuildShortcutMap(): void {
    this.shortcutMap.clear();

    this.groups.forEach((group) => {
      group.shortcuts.forEach((shortcut) => this.addShortcutToMap(shortcut));
    });
    this.independentShortcuts.forEach((shortcut) =>
      this.addShortcutToMap(shortcut)
    );
  }

  private isDuplicateShortcut = (
    shortcut: Shortcut,
    shortcuts: Shortcut[]
  ): boolean =>
    shortcuts.some(
      (sc) =>
        sc.keyCode === shortcut.keyCode &&
        checkModifiers(sc.modifiers, shortcut.modifiers)
    );
}

export { ShortcutManager };
