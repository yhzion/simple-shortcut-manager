import { ShortcutManager } from "../ShortcutManager";
import type { Shortcut } from "../../types/ShortcutTypes";

describe("ShortcutManager", () => {
  let manager: ShortcutManager;

  beforeEach(() => {
    ShortcutManager.reset(); // 인스턴스를 재설정
    manager = ShortcutManager.getInstance();
  });

  it("should add and execute an independent shortcut with preventDefault", () => {
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", ctrlKey: true });
    const preventDefault = jest.spyOn(event, "preventDefault");
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
      preventDefault: true,
    };

    manager.addIndependentShortcut(shortcut);
    manager.executeShortcut("KeyA", ["Ctrl"], event);

    expect(action).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  it("should add and execute an independent shortcut without preventDefault", () => {
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", ctrlKey: true });
    const preventDefault = jest.spyOn(event, "preventDefault");
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
      preventDefault: false,
    };

    manager.addIndependentShortcut(shortcut);
    manager.executeShortcut("KeyA", ["Ctrl"], event);

    expect(action).toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("should not add a duplicate independent shortcut", () => {
    const action1 = jest.fn();
    const action2 = jest.fn();
    const shortcut1: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: action1,
      name: "TestShortcut1",
      preventDefault: true,
    };
    const shortcut2: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: action2,
      name: "TestShortcut2",
      preventDefault: true,
    };

    manager.addIndependentShortcut(shortcut1);
    manager.addIndependentShortcut(shortcut2);
    manager.executeShortcut(
      "KeyA",
      ["Ctrl"],
      new KeyboardEvent("keydown", { code: "KeyA", ctrlKey: true })
    );

    expect(action1).toHaveBeenCalled();
    expect(action2).not.toHaveBeenCalled();
  });

  it("should add and execute a group shortcut", () => {
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", ctrlKey: true });
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestGroupShortcut",
      preventDefault: true,
    };

    manager.addGroup({ name: "TestGroup", shortcuts: [shortcut] });
    manager.executeShortcut("KeyA", ["Ctrl"], event);

    expect(action).toHaveBeenCalled();
  });

  it("should remove an independent shortcut", () => {
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", ctrlKey: true });
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
      preventDefault: true,
    };

    manager.addIndependentShortcut(shortcut);
    manager.removeIndependentShortcut("TestShortcut");
    manager.executeShortcut("KeyA", ["Ctrl"], event);

    expect(action).not.toHaveBeenCalled();
  });

  it("should remove a group shortcut", () => {
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", ctrlKey: true });
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestGroupShortcut",
      preventDefault: true,
    };

    manager.addGroup({ name: "TestGroup", shortcuts: [shortcut] });
    manager.removeShortcutFromGroup("TestGroup", "TestGroupShortcut");
    manager.executeShortcut("KeyA", ["Ctrl"], event);

    expect(action).not.toHaveBeenCalled();
  });
});
