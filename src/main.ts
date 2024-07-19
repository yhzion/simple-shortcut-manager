import { ShortcutManager } from "./managers/ShortcutManager";
import { handleKeyEvent } from "./handlers/KeyEventHandler";
import type { Shortcut } from "./types/ShortcutTypes";

const manager = ShortcutManager.getInstance();

function initialize() {
  const independentShortcuts: Shortcut[] = [
    {
      keyCode: "KeyA",
      modifiers: ["Ctrl"],
      action: () =>
        showMessage("Select All", "This shortcut selects all text.", "Ctrl+A"),
      name: "Select All",
      description: "This shortcut selects all text.",
      preventDefault: true,
    },
    {
      keyCode: "KeyB",
      modifiers: ["Ctrl"],
      action: () =>
        showMessage("Bold", "This shortcut makes the text bold.", "Ctrl+B"),
      name: "Bold",
      description: "This shortcut makes the text bold.",
      preventDefault: true,
    },
  ];

  const groupShortcuts: { groupName: string; shortcuts: Shortcut[] }[] = [
    {
      groupName: "Group 1",
      shortcuts: [
        {
          keyCode: "KeyC",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Copy",
              "This shortcut copies the selected text.",
              "Ctrl+C"
            ),
          name: "Copy",
          description: "This shortcut copies the selected text.",
          preventDefault: true,
        },
        {
          keyCode: "KeyD",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage("Bookmark", "This shortcut adds a bookmark.", "Ctrl+D"),
          name: "Bookmark",
          description: "This shortcut adds a bookmark.",
          preventDefault: true,
        },
      ],
    },
    {
      groupName: "Group 2",
      shortcuts: [
        {
          keyCode: "KeyE",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Center Align",
              "This shortcut centers the text.",
              "Ctrl+E"
            ),
          name: "Center Align",
          description: "This shortcut centers the text.",
          preventDefault: true,
        },
        {
          keyCode: "KeyF",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Find",
              "This shortcut opens the find dialog.",
              "Ctrl+F"
            ),
          name: "Find",
          description: "This shortcut opens the find dialog.",
          preventDefault: true,
        },
      ],
    },
    {
      groupName: "Group 3",
      shortcuts: [
        {
          keyCode: "KeyG",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Find Next",
              "This shortcut finds the next occurrence.",
              "Ctrl+G"
            ),
          name: "Find Next",
          description: "This shortcut finds the next occurrence.",
          preventDefault: true,
        },
        {
          keyCode: "KeyH",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Replace",
              "This shortcut opens the replace dialog.",
              "Ctrl+H"
            ),
          name: "Replace",
          description: "This shortcut opens the replace dialog.",
          preventDefault: true,
        },
      ],
    },
    {
      groupName: "Group 4",
      shortcuts: [
        {
          keyCode: "KeyI",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Italic",
              "This shortcut italicizes the text.",
              "Ctrl+I"
            ),
          name: "Italic",
          description: "This shortcut italicizes the text.",
          preventDefault: true,
        },
        {
          keyCode: "KeyJ",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Justify",
              "This shortcut justifies the text.",
              "Ctrl+J"
            ),
          name: "Justify",
          description: "This shortcut justifies the text.",
          preventDefault: true,
        },
      ],
    },
    {
      groupName: "Group 5",
      shortcuts: [
        {
          keyCode: "KeyK",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Delete Line",
              "This shortcut deletes the current line.",
              "Ctrl+K"
            ),
          name: "Delete Line",
          description: "This shortcut deletes the current line.",
          preventDefault: true,
        },
        {
          keyCode: "KeyL",
          modifiers: ["Ctrl"],
          action: () =>
            showMessage(
              "Duplicate Line",
              "This shortcut duplicates the current line.",
              "Ctrl+L"
            ),
          name: "Duplicate Line",
          description: "This shortcut duplicates the current line.",
          preventDefault: true,
        },
      ],
    },
  ];

  independentShortcuts.forEach((shortcut) =>
    manager.addIndependentShortcut(shortcut)
  );
  groupShortcuts.forEach((group) =>
    manager.addGroup({ name: group.groupName, shortcuts: group.shortcuts })
  );

  document
    .getElementById("shortcut-form")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameInput = document.getElementById("name") as HTMLInputElement;
      const keyInput = document.getElementById("key") as HTMLInputElement;
      const modifiersInput = document.getElementById(
        "modifiers"
      ) as HTMLInputElement;
      const groupInput = document.getElementById("group") as HTMLInputElement;
      const descriptionInput = document.getElementById(
        "description"
      ) as HTMLInputElement;

      const name = nameInput.value.trim();
      const key = keyInput.value.toUpperCase();
      const modifiers = modifiersInput.value
        .split(",")
        .map((mod) => mod.trim()) as Array<"Shift" | "Ctrl" | "Alt" | "Meta">;
      const group = groupInput.value.trim();
      const description = descriptionInput.value.trim();

      const shortcut: Shortcut = {
        keyCode: `Key${key}`,
        modifiers,
        action: () => {
          showMessage(name, description, `${modifiers.join("+")}+${key}`);
        },
        name,
        description,
        preventDefault: true,
      };

      if (group) {
        manager.addShortcutToGroup(group, shortcut);
      } else {
        manager.addIndependentShortcut(shortcut);
      }

      updateShortcutList();
      nameInput.value = "";
      keyInput.value = "";
      modifiersInput.value = "";
      groupInput.value = "";
      descriptionInput.value = "";
    });

  window.addEventListener("keydown", (event) => {
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
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Shortcut</th>
                <th>Description</th>
            </tr>
        `;

    independentShortcuts.forEach((shortcut) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${shortcut.name}</td>
                <td>${formatShortcut(shortcut.keyCode, shortcut.modifiers)}</td>
                <td>${shortcut.description || ""}</td>
            `;
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    independentDiv.appendChild(table);
    shortcutsList.appendChild(independentDiv);
  }

  const groups = manager["groups"];
  groups.forEach((group) => {
    const groupDiv = document.createElement("div");
    groupDiv.innerHTML = `<h3>${group.name}</h3>`;
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Shortcut</th>
                <th>Description</th>
            </tr>
        `;

    group.shortcuts.forEach((shortcut) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${shortcut.name}</td>
                <td>${formatShortcut(shortcut.keyCode, shortcut.modifiers)}</td>
                <td>${shortcut.description || ""}</td>
            `;
      tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    groupDiv.appendChild(table);
    shortcutsList.appendChild(groupDiv);
  });
}

function formatShortcut(
  keyCode: string,
  modifiers?: Array<"Shift" | "Ctrl" | "Alt" | "Meta">
): string {
  const modifierKeys =
    modifiers
      ?.map((mod) => `<span class="key-container">${mod}</span>`)
      .join("") || "";
  const key = `<span class="key-container">${keyCode.replace(
    "Key",
    ""
  )}</span>`;
  return `${modifierKeys}${key}`;
}

function showMessage(name: string, description: string, trigger: string) {
  const messageDiv = document.getElementById("message") as HTMLDivElement;
  messageDiv.innerHTML = `<strong>${name}</strong><br>Description: ${description}<br>Triggered: ${trigger}`;
  messageDiv.style.display = "block";
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 3000);
}

initialize();
