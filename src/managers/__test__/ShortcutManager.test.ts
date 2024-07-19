import { ShortcutManager } from "../ShortcutManager";
import type { Shortcut } from "../../types/ShortcutTypes";

describe("ShortcutManager", () => {
  let manager: ShortcutManager;

  beforeEach(() => {
    ShortcutManager.reset(); // 인스턴스를 재설정
    manager = ShortcutManager.getInstance();
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

  it("should not add a duplicate independent shortcut", () => {
    const action1 = jest.fn();
    const action2 = jest.fn();
    const shortcut1: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: action1,
      name: "TestShortcut1",
    };
    const shortcut2: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: action2,
      name: "TestShortcut2",
    };

    manager.addIndependentShortcut(shortcut1);
    manager.addIndependentShortcut(shortcut2);
    manager.executeShortcut("KeyA", ["Ctrl"]);

    expect(action1).toHaveBeenCalled();
    expect(action2).not.toHaveBeenCalled();
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

  it("should not add a duplicate group shortcut", () => {
    const action1 = jest.fn();
    const action2 = jest.fn();
    const shortcut1: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: action1,
      name: "TestGroupShortcut1",
    };
    const shortcut2: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: action2,
      name: "TestGroupShortcut2",
    };

    manager.addGroup({ name: "TestGroup", shortcuts: [shortcut1] });
    manager.addShortcutToGroup("TestGroup", shortcut2);
    manager.executeShortcut("KeyA", ["Ctrl"]);

    expect(action1).toHaveBeenCalled();
    expect(action2).not.toHaveBeenCalled();
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
