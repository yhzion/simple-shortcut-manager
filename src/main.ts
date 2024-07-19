import { ShortcutManager } from "./managers/ShortcutManager";
import { handleKeyEvent } from "./handlers/KeyEventHandler";
import type { Shortcut } from "./types/ShortcutTypes";

const manager = ShortcutManager.getInstance();

function initialize() {
  // 기본 단축키 등록
  const defaultShortcut: Shortcut = {
    keyCode: "KeyA",
    modifiers: ["Ctrl"],
    action: () => {
      showMessage("Default Shortcut: Ctrl+A triggered!");
    },
    name: "DefaultShortcut",
    preventDefault: true, // 기본 동작을 방지하도록 설정
  };

  manager.addIndependentShortcut(defaultShortcut);

  document
    .getElementById("shortcut-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const keyInput = document.getElementById("key") as HTMLInputElement;
      const modifiersInput = document.getElementById(
        "modifiers"
      ) as HTMLInputElement;
      const groupInput = document.getElementById("group") as HTMLInputElement;

      const key = keyInput.value.toUpperCase();
      const modifiers = modifiersInput.value
        .split(",")
        .map((mod) => mod.trim()) as Array<"Shift" | "Ctrl" | "Alt" | "Meta">;
      const group = groupInput.value.trim();

      const shortcut: Shortcut = {
        keyCode: `Key${key}`,
        modifiers,
        action: () => {
          showMessage(`Shortcut triggered: ${key} with ${modifiers.join("+")}`);
        },
        name: `Shortcut${key}${modifiers.join("")}`,
        preventDefault: true, // 기본 동작을 방지하도록 설정
      };

      if (group) {
        manager.addShortcutToGroup(group, shortcut);
      } else {
        manager.addIndependentShortcut(shortcut);
      }

      updateShortcutList();
      keyInput.value = "";
      modifiersInput.value = "";
      groupInput.value = "";
    });

  window.addEventListener("keydown", (event) => {
    // 기본 동작을 방지할지 말지 선택할 수 있도록 이벤트 객체를 전달
    handleKeyEvent(event);
  });
  updateShortcutList();
}

function updateShortcutList() {
  const shortcutsList = document.getElementById(
    "shortcuts-list"
  ) as HTMLDivElement;
  shortcutsList.innerHTML = "";

  const independentShortcuts = manager["independentShortcuts"];
  if (independentShortcuts.length > 0) {
    const independentDiv = document.createElement("div");
    independentDiv.innerHTML = `<h3>Independent Shortcuts</h3>`;
    const list = document.createElement("ul");
    independentShortcuts.forEach((shortcut) => {
      const item = document.createElement("li");
      item.textContent = `${shortcut.keyCode} + ${shortcut.modifiers?.join(
        "+"
      )}`;
      list.appendChild(item);
    });
    independentDiv.appendChild(list);
    shortcutsList.appendChild(independentDiv);
  }

  const groups = manager["groups"];
  groups.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.innerHTML = `<h3>${group.name}</h3>`;
    const list = document.createElement("ul");
    group.shortcuts.forEach((shortcut) => {
      const item = document.createElement("li");
      item.textContent = `${shortcut.keyCode} + ${shortcut.modifiers?.join(
        "+"
      )}`;
      list.appendChild(item);
    });
    groupDiv.appendChild(list);
    shortcutsList.appendChild(groupDiv);
  });
}

function showMessage(message: string) {
  const messageDiv = document.getElementById("message") as HTMLDivElement;
  messageDiv.textContent = message;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

initialize();
