import { ShortcutManager } from "./managers/ShortcutManager";
import { handleKeyEvent } from "./handlers/KeyEventHandler";
import type { ModifierKeys, Shortcut } from "./types/ShortcutTypes";
import { independentShortcuts, groupShortcuts } from "./data/shortcuts";
import { showMessage } from "./utils/MessageUtils";

const manager = ShortcutManager.getInstance();
let selectedShortcut: Shortcut | null = null;

function initialize() {
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
      const groupInput = document.getElementById("group") as HTMLInputElement;
      const descriptionInput = document.getElementById(
        "description"
      ) as HTMLInputElement;
      const warningMessage = document.getElementById(
        "warning-message"
      ) as HTMLDivElement;

      const name = nameInput.value.trim();
      const key = `Key${keyInput.value.toUpperCase()}`;
      const modifiers = Array.from(
        document.querySelectorAll('input[name="modifiers"]:checked')
      ).map((input) => (input as HTMLInputElement).value) as Array<
        "Shift" | "Ctrl" | "Alt" | "Meta"
      >;
      const group = groupInput.value.trim();
      const description = descriptionInput.value.trim();

      const shortcut: Shortcut = {
        keyCode: key,
        modifiers,
        action: () => {
          showMessage(
            name,
            description,
            `${modifiers.join("+")}+${key.replace("Key", "")}`
          );
        },
        name,
        description,
        preventDefault: true,
      };

      if (isDuplicateShortcut(shortcut)) {
        warningMessage.textContent = "This shortcut is already registered.";
        (warningMessage as HTMLElement).style.display = "block";
      } else {
        (warningMessage as HTMLElement).style.display = "none";
        if (group) {
          manager.addShortcutToGroup(group, shortcut);
        } else {
          manager.addIndependentShortcut(shortcut);
        }

        updateShortcutList();
        resetForm();
      }
    });

  document
    .getElementById("update-button")
    ?.addEventListener("click", (event) => {
      event.preventDefault();

      if (selectedShortcut !== null) {
        const nameInput = document.getElementById("name") as HTMLInputElement;
        const keyInput = document.getElementById("key") as HTMLInputElement;
        const groupInput = document.getElementById("group") as HTMLInputElement;
        const descriptionInput = document.getElementById(
          "description"
        ) as HTMLInputElement;

        // Update the selected shortcut with new values
        selectedShortcut.name = nameInput.value.trim();
        selectedShortcut.keyCode = `Key${keyInput.value.toUpperCase()}`;
        selectedShortcut.modifiers = Array.from(
          document.querySelectorAll('input[name="modifiers"]:checked')
        ).map((input) => (input as HTMLInputElement).value) as Array<
          "Shift" | "Ctrl" | "Alt" | "Meta"
        >;
        selectedShortcut.description = descriptionInput.value.trim();
        const { name, description, keyCode, modifiers } = selectedShortcut;
        selectedShortcut.action = () => {
          showMessage(
            name,
            description || "",
            `${modifiers?.join("+") || ""}+${keyCode.replace("Key", "")}`
          );
        };

        // Add the updated shortcut back
        if (groupInput.value.trim()) {
          manager.addShortcutToGroup(groupInput.value.trim(), selectedShortcut);
        } else {
          manager.addIndependentShortcut(selectedShortcut);
        }

        updateShortcutList();
        resetForm();
      }
    });

  window.addEventListener("keydown", (event) => {
    handleKeyEvent(event);
  });

  updateShortcutList();
}

function isDuplicateShortcut(newShortcut: Shortcut): boolean {
  const shortcuts = manager["independentShortcuts"].concat(
    manager["groups"].flatMap((group) => group.shortcuts)
  );
  return shortcuts.some(
    (shortcut) =>
      shortcut.keyCode === newShortcut.keyCode &&
      JSON.stringify(shortcut.modifiers) ===
        JSON.stringify(newShortcut.modifiers) &&
      shortcut !== selectedShortcut // Exclude the selected shortcut when checking for duplicates
  );
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
                <th>Actions</th>
            </tr>
        `;

    independentShortcuts.forEach((shortcut) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${shortcut.name}</td>
                <td>${formatShortcut(shortcut.keyCode, shortcut.modifiers)}</td>
                <td>${shortcut.description || ""}</td>
                <td><button type="button" onclick="editShortcut('${
                  shortcut.name
                }')">Edit</button>
                <button type="button" 
                  data-keycode="${shortcut.keyCode}"
                  data-modifiers='${JSON.stringify(shortcut.modifiers)}'
                  onclick="removeShortcut(this)">Remove</button>
                </td>
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
                <th>Actions</th>
            </tr>
        `;

    group.shortcuts.forEach((shortcut) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${shortcut.name}</td>
                <td>${formatShortcut(shortcut.keyCode, shortcut.modifiers)}</td>
                <td>${shortcut.description || ""}</td>
                <td><button type="button" onclick="editShortcut('${
                  shortcut.name
                }')">Edit</button></td>
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

(window as any).removeShortcut = ($element: HTMLElement) => {
  const keyCode = $element.getAttribute("data-keycode") as string;
  const modifiers = JSON.parse(
    $element.getAttribute("data-modifiers") as string
  ) as ModifierKeys[];
  manager.removeShortcutByKeyCodeAndModifiers(keyCode, modifiers);
  updateShortcutList();
};

(window as any).editShortcut = function (name: string) {
  const shortcuts = manager["independentShortcuts"].concat(
    manager["groups"].flatMap((group) => group.shortcuts)
  );
  const shortcut = shortcuts.find((s) => s.name === name);

  if (shortcut) {
    selectedShortcut = shortcut;

    const nameInput = document.getElementById("name") as HTMLInputElement;
    const keyInput = document.getElementById("key") as HTMLInputElement;
    const groupInput = document.getElementById("group") as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "description"
    ) as HTMLInputElement;

    nameInput.value = shortcut.name;
    keyInput.value = shortcut.keyCode.replace("Key", "");
    groupInput.value =
      manager["groups"].find((group) => group.shortcuts.includes(shortcut))
        ?.name || "";
    descriptionInput.value = shortcut.description || "";

    (
      document.querySelectorAll(
        'input[name="modifiers"]'
      ) as NodeListOf<HTMLInputElement>
    ).forEach((input) => {
      input.checked = shortcut.modifiers
        ? shortcut.modifiers.includes(
            input.value as "Shift" | "Ctrl" | "Alt" | "Meta"
          )
        : false;
    });

    (document.getElementById("update-button") as HTMLElement).style.display =
      "inline-block";
    (
      document.querySelector('button[type="submit"]') as HTMLElement
    ).style.display = "none";
  }
};

function resetForm() {
  selectedShortcut = null;

  const nameInput = document.getElementById("name") as HTMLInputElement;
  const keyInput = document.getElementById("key") as HTMLInputElement;
  const groupInput = document.getElementById("group") as HTMLInputElement;
  const descriptionInput = document.getElementById(
    "description"
  ) as HTMLInputElement;

  nameInput.value = "";
  keyInput.value = "";
  (
    document.querySelectorAll(
      'input[name="modifiers"]'
    ) as NodeListOf<HTMLInputElement>
  ).forEach((input) => (input.checked = false));
  groupInput.value = "";
  descriptionInput.value = "";

  (document.getElementById("update-button") as HTMLElement).style.display =
    "none";
  (
    document.querySelector('button[type="submit"]') as HTMLElement
  ).style.display = "inline-block";
}

initialize();
