import { ShortcutManager } from "../ShortcutManager";
import type { Shortcut } from "../../types/ShortcutTypes";

describe("ShortcutManager", () => {
  let manager: ShortcutManager;

  beforeEach(() => {
    manager = ShortcutManager.getInstance();
    manager["groups"] = [];
    manager["independentShortcuts"] = [];
  });

  it("should add and execute an independent shortcut", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
    };

    manager.addIndependentShortcut(shortcut);
    manager.executeShortcut("KeyA", ["Ctrl"]);

    expect(action).toHaveBeenCalled();
  });

  it("should add and execute a group shortcut", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestGroupShortcut",
    };

    manager.addGroup({ name: "TestGroup", shortcuts: [shortcut] });
    manager.executeShortcut("KeyA", ["Ctrl"]);

    expect(action).toHaveBeenCalled();
  });

  it("should remove an independent shortcut", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
    };

    manager.addIndependentShortcut(shortcut);
    manager.removeIndependentShortcut("TestShortcut");
    manager.executeShortcut("KeyA", ["Ctrl"]);

    expect(action).not.toHaveBeenCalled();
  });

  it("should remove a group shortcut", () => {
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestGroupShortcut",
    };

    manager.addGroup({ name: "TestGroup", shortcuts: [shortcut] });
    manager.removeShortcutFromGroup("TestGroup", "TestGroupShortcut");
    manager.executeShortcut("KeyA", ["Ctrl"]);

    expect(action).not.toHaveBeenCalled();
  });
});
