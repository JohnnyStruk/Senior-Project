import type { KeyboardHalf } from '../types/keyboard';

// Keyboard type identifier
export type KeyboardType = 'main' | 'protoboard';

// MAIN KEYBOARD LAYOUTS (Final Hardware - 8×8 matrix)

export const leftHalfLayout: KeyboardHalf = {
  name: "Left Half",
  pid: "0x6060", 
  layout: [
    // Function row
    { label: "Esc", matrix: [0, 0], x: 0, y: 0 },
    { label: "F1", matrix: [0, 1], x: 1, y: 0 },
    { label: "F2", matrix: [0, 2], x: 2, y: 0 },
    { label: "F3", matrix: [0, 3], x: 3, y: 0 },
    { label: "F4", matrix: [0, 4], x: 4, y: 0 },
    { label: "F5", matrix: [0, 5], x: 5, y: 0 },
    { label: "F6", matrix: [0, 6], x: 6, y: 0 },
    
    // Number row
    { label: "~`", matrix: [1, 0], x: 0, y: 1 },
    { label: "!1", matrix: [1, 1], x: 1, y: 1 },
    { label: "@2", matrix: [1, 2], x: 2, y: 1 },
    { label: "#3", matrix: [1, 3], x: 3, y: 1 },
    { label: "$4", matrix: [1, 4], x: 4, y: 1 },
    { label: "%5", matrix: [1, 5], x: 5, y: 1 },
    { label: "^6", matrix: [1, 6], x: 6, y: 1 },
    
    // QWERTY top row
    { label: "Tab", matrix: [2, 0], x: 0, y: 2, w: 1.5 },
    { label: "Q", matrix: [2, 1], x: 1.5, y: 2 },
    { label: "W", matrix: [2, 2], x: 2.5, y: 2 },
    { label: "E", matrix: [2, 3], x: 3.5, y: 2 },
    { label: "R", matrix: [2, 4], x: 4.5, y: 2 },
    { label: "T", matrix: [2, 5], x: 5.5, y: 2 },
    
    // QWERTY middle row
    { label: "Caps", matrix: [3, 0], x: 0, y: 3, w: 1.75 },
    { label: "A", matrix: [3, 1], x: 1.75, y: 3 },
    { label: "S", matrix: [3, 2], x: 2.75, y: 3 },
    { label: "D", matrix: [3, 3], x: 3.75, y: 3 },
    { label: "F", matrix: [3, 4], x: 4.75, y: 3 },
    { label: "G", matrix: [3, 5], x: 5.75, y: 3 },
    
    // QWERTY bottom row
    { label: "Shift", matrix: [4, 0], x: 0, y: 4, w: 2.25 },
    { label: "Z", matrix: [4, 1], x: 2.25, y: 4 },
    { label: "X", matrix: [4, 2], x: 3.25, y: 4 },
    { label: "C", matrix: [4, 3], x: 4.25, y: 4 },
    { label: "V", matrix: [4, 4], x: 5.25, y: 4 },
    { label: "B", matrix: [4, 5], x: 6.25, y: 4 },
    
    // Bottom modifier row
    { label: "Ctrl", matrix: [5, 0], x: 0, y: 5, w: 1.25 },
    { label: "Win", matrix: [5, 1], x: 1.25, y: 5, w: 1.25 },
    { label: "Alt", matrix: [5, 2], x: 2.5, y: 5, w: 1.25 },
    { label: "Space", matrix: [5, 4], x: 3.75, y: 5, w: 1.75 },
    { label: "Space", matrix: [5, 5], x: 5.5, y: 5, w: 1.75 }
  ]
};

export const rightHalfLayout: KeyboardHalf = {
  name: "Right Half",
  pid: "0x6061",
  layout: [
    // Function row
    { label: "F7", matrix: [0, 0], x: 0.5, y: 0 },
    { label: "F8", matrix: [0, 1], x: 1.5, y: 0 },
    { label: "F9", matrix: [0, 2], x: 2.5, y: 0 },
    { label: "F10", matrix: [0, 3], x: 3.5, y: 0 },
    { label: "F11", matrix: [0, 4], x: 4.5, y: 0 },
    { label: "F12", matrix: [0, 5], x: 5.5, y: 0 },
    { label: "PrtSc", matrix: [0, 6], x: 6.5, y: 0 },
    { label: "Del", matrix: [0, 8], x: 7.5, y: 0 },
    
    // Number row
    { label: "&7", matrix: [1, 0], x: 0.5, y: 1 },
    { label: "*8", matrix: [1, 1], x: 1.5, y: 1 },
    { label: "(9", matrix: [1, 2], x: 2.5, y: 1 },
    { label: ")0", matrix: [1, 3], x: 3.5, y: 1 },
    { label: "_-", matrix: [1, 4], x: 4.5, y: 1 },
    { label: "+=", matrix: [1, 5], x: 5.5, y: 1 },
    { label: "Backspace", matrix: [1, 6], x: 6.5, y: 1, w: 2 },
    { label: "PgUp", matrix: [1, 8], x: 8.5, y: 1 },
    
    // QWERTY top row
    { label: "Y", matrix: [2, 0], x: 0, y: 2 },
    { label: "U", matrix: [2, 1], x: 1, y: 2 },
    { label: "I", matrix: [2, 2], x: 2, y: 2 },
    { label: "O", matrix: [2, 3], x: 3, y: 2 },
    { label: "P", matrix: [2, 4], x: 4, y: 2 },
    { label: "{[", matrix: [2, 5], x: 5, y: 2 },
    { label: "}]", matrix: [2, 6], x: 6, y: 2 },
    { label: "|\\", matrix: [2, 7], x: 7, y: 2, w: 1.5 },
    { label: "PgDn", matrix: [2, 8], x: 8.5, y: 2 },
    
    // QWERTY middle row
    { label: "H", matrix: [3, 0], x: 0.25, y: 3 },
    { label: "J", matrix: [3, 1], x: 1.25, y: 3 },
    { label: "K", matrix: [3, 2], x: 2.25, y: 3 },
    { label: "L", matrix: [3, 3], x: 3.25, y: 3 },
    { label: ":;", matrix: [3, 4], x: 4.25, y: 3 },
    { label: "\"'", matrix: [3, 5], x: 5.25, y: 3 },
    { label: "Enter", matrix: [3, 6], x: 6.25, y: 3, w: 2.25 },
    { label: "Home", matrix: [3, 8], x: 8.5, y: 3 },
    
    // QWERTY bottom row
    { label: "N", matrix: [4, 0], x: 0.75, y: 4 },
    { label: "M", matrix: [4, 1], x: 1.75, y: 4 },
    { label: "<,", matrix: [4, 2], x: 2.75, y: 4 },
    { label: ">.", matrix: [4, 3], x: 3.75, y: 4 },
    { label: "?/", matrix: [4, 4], x: 4.75, y: 4 },
    { label: "Shift", matrix: [4, 5], x: 5.75, y: 4, w: 1.75 },
    { label: "↑", matrix: [4, 7], x: 7.5, y: 4 },
    
    // Bottom modifier row
    { label: "Space", matrix: [5, 0], x: 0.75, y: 5, w: 2.75 },
    { label: "Alt", matrix: [5, 3], x: 3.5, y: 5 },
    { label: "Menu", matrix: [5, 4], x: 4.5, y: 5 },
    { label: "Ctrl", matrix: [5, 5], x: 5.5, y: 5 },
    { label: "←", matrix: [5, 6], x: 6.5, y: 5 },
    { label: "↓", matrix: [5, 7], x: 7.5, y: 5 },
    { label: "→", matrix: [5, 8], x: 8.5, y: 5 }
  ]
};

// PROTOBOARD LAYOUTS (Testing Hardware - 4×5 matrix)

export const protoboardLeftLayout: KeyboardHalf = {
  name: "Protoboard Left",
  pid: "0x6060",
  layout: [
    // Row 0: Q W E R T
    { label: "Q", matrix: [0, 0], x: 0, y: 0 },
    { label: "W", matrix: [0, 1], x: 1, y: 0 },
    { label: "E", matrix: [0, 2], x: 2, y: 0 },
    { label: "R", matrix: [0, 3], x: 3, y: 0 },
    { label: "T", matrix: [0, 4], x: 4, y: 0 },

    // Row 1: Tab A S D F
    { label: "Tab", matrix: [1, 0], x: 0, y: 1 },
    { label: "A", matrix: [1, 1], x: 1, y: 1 },
    { label: "S", matrix: [1, 2], x: 2, y: 1 },
    { label: "D", matrix: [1, 3], x: 3, y: 1 },
    { label: "F", matrix: [1, 4], x: 4, y: 1 },

    // Row 2: Shift Z X C V
    { label: "Shift", matrix: [2, 0], x: 0, y: 2 },
    { label: "Z", matrix: [2, 1], x: 1, y: 2 },
    { label: "X", matrix: [2, 2], x: 2, y: 2 },
    { label: "C", matrix: [2, 3], x: 3, y: 2 },
    { label: "V", matrix: [2, 4], x: 4, y: 2 },

    // Row 3: Ctrl Win Alt Space Esc
    { label: "Ctrl", matrix: [3, 0], x: 0, y: 3 },
    { label: "Win", matrix: [3, 1], x: 1, y: 3 },
    { label: "Alt", matrix: [3, 2], x: 2, y: 3 },
    { label: "Space", matrix: [3, 3], x: 3, y: 3 },
    { label: "Esc", matrix: [3, 4], x: 4, y: 3 }
  ]
};

export const protoboardRightLayout: KeyboardHalf = {
  name: "Protoboard Right",
  pid: "0x6061",
  layout: [
    // Row 0: Y U I O P
    { label: "Y", matrix: [0, 0], x: 0.5, y: 0 },
    { label: "U", matrix: [0, 1], x: 1.5, y: 0 },
    { label: "I", matrix: [0, 2], x: 2.5, y: 0 },
    { label: "O", matrix: [0, 3], x: 3.5, y: 0 },
    { label: "P", matrix: [0, 4], x: 4.5, y: 0 },

    // Row 1: G H J K L
    { label: "G", matrix: [1, 0], x: 0.5, y: 1 },
    { label: "H", matrix: [1, 1], x: 1.5, y: 1 },
    { label: "J", matrix: [1, 2], x: 2.5, y: 1 },
    { label: "K", matrix: [1, 3], x: 3.5, y: 1 },
    { label: "L", matrix: [1, 4], x: 4.5, y: 1 },

    // Row 2: B N M , .
    { label: "B", matrix: [2, 0], x: 0.5, y: 2 },
    { label: "N", matrix: [2, 1], x: 1.5, y: 2 },
    { label: "M", matrix: [2, 2], x: 2.5, y: 2 },
    { label: "<,", matrix: [2, 3], x: 3.5, y: 2 },
    { label: ">.", matrix: [2, 4], x: 4.5, y: 2 },

    // Row 3: Enter Bksp Del ; '
    { label: "Enter", matrix: [3, 0], x: 0.5, y: 3 },
    { label: "Bksp", matrix: [3, 1], x: 1.5, y: 3 },
    { label: "Del", matrix: [3, 2], x: 2.5, y: 3 },
    { label: ":;", matrix: [3, 3], x: 3.5, y: 3 },
    { label: "\"'", matrix: [3, 4], x: 4.5, y: 3 }
  ]
};

// Helper function to get layouts based on keyboard type
export function getLayoutsForKeyboard(type: KeyboardType): {
  left: KeyboardHalf;
  right: KeyboardHalf;
} {
  if (type === 'protoboard') {
    return {
      left: protoboardLeftLayout,
      right: protoboardRightLayout
    };
  }

  return {
    left: leftHalfLayout,
    right: rightHalfLayout
  };
}