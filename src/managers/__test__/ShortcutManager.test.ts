import { ShortcutManager } from "../ShortcutManager";
import { Shortcut } from "../../types/ShortcutTypes";

describe("ShortcutManager", () => {
  let manager: ShortcutManager;

  beforeEach(() => {
    manager = ShortcutManager.getInstance();
    ShortcutManager.reset();
  });

  it("should return the same instance", () => {
    const instance1 = ShortcutManager.getInstance();
    const instance2 = ShortcutManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should add and retrieve a shortcut", () => {
    const shortcut: Shortcut = {
      name: "Test Shortcut",
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: jest.fn(),
      preventDefault: true,
    };
    manager.addIndependentShortcut(shortcut);
    const retrievedShortcut = manager["getShortcutByKeyCodeAndModifiers"](
      "KeyA",
      ["Ctrl"]
    );
    expect(retrievedShortcut).toBe(shortcut);
  });

  it("should add a shortcut to a group", () => {
    const shortcut: Shortcut = {
      name: "Group Shortcut",
      keyCode: "KeyB",
      modifiers: ["Shift"],
      action: jest.fn(),
      preventDefault: false,
    };
    const groupName = "Test Group";
    manager.addShortcutToGroup(groupName, shortcut);

    const group = manager["groups"].find((g) => g.name === groupName);
    expect(group).toBeDefined();
    expect(group?.shortcuts).toContain(shortcut);
  });

  it("should remove a shortcut by id", () => {
    const shortcut: Shortcut = {
      name: "Removable Shortcut",
      keyCode: "KeyC",
      modifiers: ["Alt"],
      action: jest.fn(),
      preventDefault: false,
    };
    manager.addIndependentShortcut(shortcut);
    const shortcutId = manager["getShortcutIdByKeyCodeAndModifiers"]("KeyC", [
      "Alt",
    ]);
    manager.removeShortcutById(shortcutId!);

    const retrievedShortcut = manager["getShortcutByKeyCodeAndModifiers"](
      "KeyC",
      ["Alt"]
    );
    expect(retrievedShortcut).toBeNull();
  });

  it("should execute the correct shortcut action", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      name: "Executable Shortcut",
      keyCode: "KeyD",
      modifiers: ["Meta"],
      action: action,
      preventDefault: true,
    };
    manager.addIndependentShortcut(shortcut);

    const event = new KeyboardEvent("keydown", { key: "KeyD", metaKey: true });
    manager.executeShortcut("KeyD", ["Meta"], event);
    expect(action).toHaveBeenCalled();
  });

  it("should prevent default action if specified", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      name: "Prevent Default Shortcut",
      keyCode: "KeyE",
      modifiers: ["Meta"],
      action: action,
      preventDefault: true,
    };
    manager.addIndependentShortcut(shortcut);

    const event = new KeyboardEvent("keydown", { key: "KeyE", metaKey: true });
    const preventDefaultSpy = jest.spyOn(event, "preventDefault");
    manager.executeShortcut("KeyE", ["Meta"], event);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not execute a non-matching shortcut", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      name: "Non-Matching Shortcut",
      keyCode: "KeyF",
      modifiers: ["Meta"],
      action: action,
      preventDefault: false,
    };
    manager.addIndependentShortcut(shortcut);

    const event = new KeyboardEvent("keydown", { key: "KeyG", metaKey: true });
    manager.executeShortcut("KeyG", ["Meta"], event);
    expect(action).not.toHaveBeenCalled();
  });

  it("should handle duplicate shortcuts correctly", () => {
    const shortcut1: Shortcut = {
      name: "Duplicate Shortcut 1",
      keyCode: "KeyH",
      modifiers: ["Ctrl"],
      action: jest.fn(),
      preventDefault: false,
    };
    const shortcut2: Shortcut = {
      name: "Duplicate Shortcut 2",
      keyCode: "KeyH",
      modifiers: ["Ctrl"],
      action: jest.fn(),
      preventDefault: false,
    };
    manager.addIndependentShortcut(shortcut1);
    manager.addIndependentShortcut(shortcut2);

    const allShortcuts = manager["independentShortcuts"];
    expect(allShortcuts.length).toBe(1);
    expect(allShortcuts[0].name).toBe("Duplicate Shortcut 1");
  });
});
