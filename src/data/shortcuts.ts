import { Shortcut } from "../types/ShortcutTypes";
import { showMessage } from "../utils/MessageUtils";

export const independentShortcuts: Shortcut[] = [
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

export const groupShortcuts: { groupName: string; shortcuts: Shortcut[] }[] = [
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
          showMessage("Find", "This shortcut opens the find dialog.", "Ctrl+F"),
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
          showMessage("Italic", "This shortcut italicizes the text.", "Ctrl+I"),
        name: "Italic",
        description: "This shortcut italicizes the text.",
        preventDefault: true,
      },
      {
        keyCode: "KeyJ",
        modifiers: ["Ctrl"],
        action: () =>
          showMessage("Justify", "This shortcut justifies the text.", "Ctrl+J"),
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
