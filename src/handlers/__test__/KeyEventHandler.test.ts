import { handleKeyEvent } from "../KeyEventHandler";
import { ShortcutManager } from "../../managers/ShortcutManager";
import type { Shortcut } from "../../types/ShortcutTypes";

describe("handleKeyEvent", () => {
  let manager: ShortcutManager;

  beforeEach(() => {
    ShortcutManager.reset(); // 인스턴스를 재설정
    manager = ShortcutManager.getInstance();
  });

  const setUserAgent = (userAgent: string) => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: userAgent,
      configurable: true,
    });
  };

  it("should handle key event and trigger the correct shortcut action with preventDefault", () => {
    setUserAgent("Macintosh"); // MacOS로 설정
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", metaKey: true });
    const preventDefault = jest.spyOn(event, "preventDefault");
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Meta"],
      action,
      name: "TestShortcut",
      preventDefault: true,
    };

    manager.addIndependentShortcut(shortcut);

    handleKeyEvent(event);

    expect(action).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  it("should handle key event and trigger the correct shortcut action without preventDefault", () => {
    setUserAgent("Windows"); // Windows로 설정
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

    handleKeyEvent(event);

    expect(action).toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("should handle key event and not trigger the action if modifiers do not match", () => {
    setUserAgent("Windows"); // Windows로 설정
    const action = jest.fn();
    const event = new KeyboardEvent("keydown", { code: "KeyA", metaKey: true });
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
      preventDefault: true,
    };

    manager.addIndependentShortcut(shortcut);

    handleKeyEvent(event);

    expect(action).not.toHaveBeenCalled();
  });
});
