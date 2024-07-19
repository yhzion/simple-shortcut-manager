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

  it("should handle key event and trigger the correct shortcut action on MacOS", () => {
    setUserAgent("Macintosh"); // MacOS로 설정
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Meta"],
      action,
      name: "TestShortcut",
    };

    manager.addIndependentShortcut(shortcut);

    const event = {
      code: "KeyA",
      metaKey: true,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
    } as KeyboardEvent;

    handleKeyEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it("should handle key event and trigger the correct shortcut action on Windows", () => {
    setUserAgent("Windows"); // Windows로 설정
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
    };

    manager.addIndependentShortcut(shortcut);

    const event = {
      code: "KeyA",
      metaKey: false,
      shiftKey: false,
      ctrlKey: true,
      altKey: false,
    } as KeyboardEvent;

    handleKeyEvent(event);

    expect(action).toHaveBeenCalled();
  });

  it("should handle key event and not trigger the action if modifiers do not match", () => {
    setUserAgent("Windows"); // Windows로 설정
    const action = jest.fn();
    const shortcut: Shortcut = {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action,
      name: "TestShortcut",
    };

    manager.addIndependentShortcut(shortcut);

    const event = {
      code: "KeyA",
      metaKey: true, // This should not match the 'Ctrl' modifier
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
    } as KeyboardEvent;

    handleKeyEvent(event);

    expect(action).not.toHaveBeenCalled();
  });
});
