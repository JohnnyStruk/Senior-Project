export interface Keycode {
  code: string;
  label: string;
  description: string;
  category: 'basic' | 'modifier' | 'function' | 'navigation' | 'media' | 'layer' | 'system' | 'numpad';
}

export const QMK_KEYCODES: Keycode[] = [
  // ========== BASIC KEYS ==========
  { code: 'KC_A', label: 'A', description: 'Letter A', category: 'basic' },
  { code: 'KC_B', label: 'B', description: 'Letter B', category: 'basic' },
  { code: 'KC_C', label: 'C', description: 'Letter C', category: 'basic' },
  { code: 'KC_D', label: 'D', description: 'Letter D', category: 'basic' },
  { code: 'KC_E', label: 'E', description: 'Letter E', category: 'basic' },
  { code: 'KC_F', label: 'F', description: 'Letter F', category: 'basic' },
  { code: 'KC_G', label: 'G', description: 'Letter G', category: 'basic' },
  { code: 'KC_H', label: 'H', description: 'Letter H', category: 'basic' },
  { code: 'KC_I', label: 'I', description: 'Letter I', category: 'basic' },
  { code: 'KC_J', label: 'J', description: 'Letter J', category: 'basic' },
  { code: 'KC_K', label: 'K', description: 'Letter K', category: 'basic' },
  { code: 'KC_L', label: 'L', description: 'Letter L', category: 'basic' },
  { code: 'KC_M', label: 'M', description: 'Letter M', category: 'basic' },
  { code: 'KC_N', label: 'N', description: 'Letter N', category: 'basic' },
  { code: 'KC_O', label: 'O', description: 'Letter O', category: 'basic' },
  { code: 'KC_P', label: 'P', description: 'Letter P', category: 'basic' },
  { code: 'KC_Q', label: 'Q', description: 'Letter Q', category: 'basic' },
  { code: 'KC_R', label: 'R', description: 'Letter R', category: 'basic' },
  { code: 'KC_S', label: 'S', description: 'Letter S', category: 'basic' },
  { code: 'KC_T', label: 'T', description: 'Letter T', category: 'basic' },
  { code: 'KC_U', label: 'U', description: 'Letter U', category: 'basic' },
  { code: 'KC_V', label: 'V', description: 'Letter V', category: 'basic' },
  { code: 'KC_W', label: 'W', description: 'Letter W', category: 'basic' },
  { code: 'KC_X', label: 'X', description: 'Letter X', category: 'basic' },
  { code: 'KC_Y', label: 'Y', description: 'Letter Y', category: 'basic' },
  { code: 'KC_Z', label: 'Z', description: 'Letter Z', category: 'basic' },

  { code: 'KC_1', label: '1', description: 'Number 1', category: 'basic' },
  { code: 'KC_2', label: '2', description: 'Number 2', category: 'basic' },
  { code: 'KC_3', label: '3', description: 'Number 3', category: 'basic' },
  { code: 'KC_4', label: '4', description: 'Number 4', category: 'basic' },
  { code: 'KC_5', label: '5', description: 'Number 5', category: 'basic' },
  { code: 'KC_6', label: '6', description: 'Number 6', category: 'basic' },
  { code: 'KC_7', label: '7', description: 'Number 7', category: 'basic' },
  { code: 'KC_8', label: '8', description: 'Number 8', category: 'basic' },
  { code: 'KC_9', label: '9', description: 'Number 9', category: 'basic' },
  { code: 'KC_0', label: '0', description: 'Number 0', category: 'basic' },

  { code: 'KC_ENT', label: 'Enter', description: 'Enter key', category: 'basic' },
  { code: 'KC_ESC', label: 'Esc', description: 'Escape key', category: 'basic' },
  { code: 'KC_BSPC', label: 'Bksp', description: 'Backspace', category: 'basic' },
  { code: 'KC_TAB', label: 'Tab', description: 'Tab key', category: 'basic' },
  { code: 'KC_SPC', label: 'Space', description: 'Spacebar', category: 'basic' },
  { code: 'KC_MINS', label: '-', description: 'Minus/Underscore', category: 'basic' },
  { code: 'KC_EQL', label: '=', description: 'Equal/Plus', category: 'basic' },
  { code: 'KC_LBRC', label: '[', description: 'Left bracket', category: 'basic' },
  { code: 'KC_RBRC', label: ']', description: 'Right bracket', category: 'basic' },
  { code: 'KC_BSLS', label: '\\', description: 'Backslash', category: 'basic' },
  { code: 'KC_SCLN', label: ';', description: 'Semicolon', category: 'basic' },
  { code: 'KC_QUOT', label: "'", description: 'Quote', category: 'basic' },
  { code: 'KC_GRV', label: '`', description: 'Grave/Tilde', category: 'basic' },
  { code: 'KC_COMM', label: ',', description: 'Comma', category: 'basic' },
  { code: 'KC_DOT', label: '.', description: 'Period', category: 'basic' },
  { code: 'KC_SLSH', label: '/', description: 'Slash', category: 'basic' },

  // ========== MODIFIERS ==========
  { code: 'KC_LCTL', label: 'LCtrl', description: 'Left Control', category: 'modifier' },
  { code: 'KC_LSFT', label: 'LShift', description: 'Left Shift', category: 'modifier' },
  { code: 'KC_LALT', label: 'LAlt', description: 'Left Alt', category: 'modifier' },
  { code: 'KC_LGUI', label: 'LWin', description: 'Left GUI/Win/Cmd', category: 'modifier' },
  { code: 'KC_RCTL', label: 'RCtrl', description: 'Right Control', category: 'modifier' },
  { code: 'KC_RSFT', label: 'RShift', description: 'Right Shift', category: 'modifier' },
  { code: 'KC_RALT', label: 'RAlt', description: 'Right Alt', category: 'modifier' },
  { code: 'KC_RGUI', label: 'RWin', description: 'Right GUI/Win/Cmd', category: 'modifier' },
  { code: 'KC_CAPS', label: 'Caps', description: 'Caps Lock', category: 'modifier' },

  // ========== FUNCTION KEYS ==========
  { code: 'KC_F1', label: 'F1', description: 'Function key 1', category: 'function' },
  { code: 'KC_F2', label: 'F2', description: 'Function key 2', category: 'function' },
  { code: 'KC_F3', label: 'F3', description: 'Function key 3', category: 'function' },
  { code: 'KC_F4', label: 'F4', description: 'Function key 4', category: 'function' },
  { code: 'KC_F5', label: 'F5', description: 'Function key 5', category: 'function' },
  { code: 'KC_F6', label: 'F6', description: 'Function key 6', category: 'function' },
  { code: 'KC_F7', label: 'F7', description: 'Function key 7', category: 'function' },
  { code: 'KC_F8', label: 'F8', description: 'Function key 8', category: 'function' },
  { code: 'KC_F9', label: 'F9', description: 'Function key 9', category: 'function' },
  { code: 'KC_F10', label: 'F10', description: 'Function key 10', category: 'function' },
  { code: 'KC_F11', label: 'F11', description: 'Function key 11', category: 'function' },
  { code: 'KC_F12', label: 'F12', description: 'Function key 12', category: 'function' },
  { code: 'KC_F13', label: 'F13', description: 'Function key 13', category: 'function' },
  { code: 'KC_F14', label: 'F14', description: 'Function key 14', category: 'function' },
  { code: 'KC_F15', label: 'F15', description: 'Function key 15', category: 'function' },
  { code: 'KC_F16', label: 'F16', description: 'Function key 16', category: 'function' },

  // ========== NAVIGATION ==========
  { code: 'KC_PSCR', label: 'PrtSc', description: 'Print Screen', category: 'navigation' },
  { code: 'KC_SCRL', label: 'ScrLk', description: 'Scroll Lock', category: 'navigation' },
  { code: 'KC_PAUS', label: 'Pause', description: 'Pause/Break', category: 'navigation' },
  { code: 'KC_INS', label: 'Ins', description: 'Insert', category: 'navigation' },
  { code: 'KC_HOME', label: 'Home', description: 'Home key', category: 'navigation' },
  { code: 'KC_PGUP', label: 'PgUp', description: 'Page Up', category: 'navigation' },
  { code: 'KC_DEL', label: 'Del', description: 'Delete', category: 'navigation' },
  { code: 'KC_END', label: 'End', description: 'End key', category: 'navigation' },
  { code: 'KC_PGDN', label: 'PgDn', description: 'Page Down', category: 'navigation' },
  { code: 'KC_RGHT', label: '→', description: 'Right arrow', category: 'navigation' },
  { code: 'KC_LEFT', label: '←', description: 'Left arrow', category: 'navigation' },
  { code: 'KC_DOWN', label: '↓', description: 'Down arrow', category: 'navigation' },
  { code: 'KC_UP', label: '↑', description: 'Up arrow', category: 'navigation' },

  // ========== NUMPAD ==========
  { code: 'KC_NUM', label: 'NumLk', description: 'Num Lock', category: 'numpad' },
  { code: 'KC_PSLS', label: 'N/', description: 'Numpad /', category: 'numpad' },
  { code: 'KC_PAST', label: 'N*', description: 'Numpad *', category: 'numpad' },
  { code: 'KC_PMNS', label: 'N-', description: 'Numpad -', category: 'numpad' },
  { code: 'KC_PPLS', label: 'N+', description: 'Numpad +', category: 'numpad' },
  { code: 'KC_PENT', label: 'NEnter', description: 'Numpad Enter', category: 'numpad' },
  { code: 'KC_P1', label: 'N1', description: 'Numpad 1', category: 'numpad' },
  { code: 'KC_P2', label: 'N2', description: 'Numpad 2', category: 'numpad' },
  { code: 'KC_P3', label: 'N3', description: 'Numpad 3', category: 'numpad' },
  { code: 'KC_P4', label: 'N4', description: 'Numpad 4', category: 'numpad' },
  { code: 'KC_P5', label: 'N5', description: 'Numpad 5', category: 'numpad' },
  { code: 'KC_P6', label: 'N6', description: 'Numpad 6', category: 'numpad' },
  { code: 'KC_P7', label: 'N7', description: 'Numpad 7', category: 'numpad' },
  { code: 'KC_P8', label: 'N8', description: 'Numpad 8', category: 'numpad' },
  { code: 'KC_P9', label: 'N9', description: 'Numpad 9', category: 'numpad' },
  { code: 'KC_P0', label: 'N0', description: 'Numpad 0', category: 'numpad' },
  { code: 'KC_PDOT', label: 'N.', description: 'Numpad .', category: 'numpad' },

  // ========== MEDIA KEYS ==========
  { code: 'KC_MUTE', label: 'Mute', description: 'Mute audio', category: 'media' },
  { code: 'KC_VOLU', label: 'Vol+', description: 'Volume up', category: 'media' },
  { code: 'KC_VOLD', label: 'Vol-', description: 'Volume down', category: 'media' },
  { code: 'KC_MNXT', label: 'Next', description: 'Next track', category: 'media' },
  { code: 'KC_MPRV', label: 'Prev', description: 'Previous track', category: 'media' },
  { code: 'KC_MSTP', label: 'Stop', description: 'Stop media', category: 'media' },
  { code: 'KC_MPLY', label: 'Play', description: 'Play/Pause', category: 'media' },
  { code: 'KC_MSEL', label: 'Media', description: 'Media select', category: 'media' },
  { code: 'KC_BRIU', label: 'Bri+', description: 'Brightness up', category: 'media' },
  { code: 'KC_BRID', label: 'Bri-', description: 'Brightness down', category: 'media' },

  // ========== LAYER KEYS ==========
  { code: 'MO(1)', label: 'MO(1)', description: 'Momentary layer 1', category: 'layer' },
  { code: 'MO(2)', label: 'MO(2)', description: 'Momentary layer 2', category: 'layer' },
  { code: 'MO(3)', label: 'MO(3)', description: 'Momentary layer 3', category: 'layer' },
  { code: 'TG(1)', label: 'TG(1)', description: 'Toggle layer 1', category: 'layer' },
  { code: 'TG(2)', label: 'TG(2)', description: 'Toggle layer 2', category: 'layer' },
  { code: 'TG(3)', label: 'TG(3)', description: 'Toggle layer 3', category: 'layer' },
  { code: 'TO(0)', label: 'TO(0)', description: 'Switch to layer 0', category: 'layer' },
  { code: 'TO(1)', label: 'TO(1)', description: 'Switch to layer 1', category: 'layer' },
  { code: 'TO(2)', label: 'TO(2)', description: 'Switch to layer 2', category: 'layer' },
  { code: 'TO(3)', label: 'TO(3)', description: 'Switch to layer 3', category: 'layer' },

  // ========== SYSTEM ==========
  { code: 'KC_PWR', label: 'Power', description: 'System power', category: 'system' },
  { code: 'KC_SLEP', label: 'Sleep', description: 'System sleep', category: 'system' },
  { code: 'KC_WAKE', label: 'Wake', description: 'System wake', category: 'system' },
  { code: 'QK_BOOT', label: 'Reset', description: 'Enter bootloader', category: 'system' },
  { code: 'KC_TRNS', label: '▽', description: 'Transparent (pass through)', category: 'system' },
  { code: 'KC_NO', label: '✕', description: 'No operation', category: 'system' },
];

// Helper function to get keycodes by category
export function getKeycodesByCategory(category: Keycode['category']): Keycode[] {
  return QMK_KEYCODES.filter(kc => kc.category === category);
}

// Helper function to find keycode by code
export function findKeycode(code: string): Keycode | undefined {
  return QMK_KEYCODES.find(kc => kc.code === code);
}

// Category metadata for UI display
export const CATEGORY_INFO: Record<Keycode['category'], { name: string; icon: string; color: string }> = {
  basic: { name: 'Basic', icon: '🔤', color: 'text-blue-400' },
  modifier: { name: 'Modifiers', icon: '⌨️', color: 'text-purple-400' },
  function: { name: 'Function', icon: '🎛️', color: 'text-cyan-400' },
  navigation: { name: 'Navigation', icon: '🧭', color: 'text-green-400' },
  media: { name: 'Media', icon: '🎵', color: 'text-pink-400' },
  layer: { name: 'Layers', icon: '📚', color: 'text-amber-400' },
  system: { name: 'System', icon: '⚙️', color: 'text-red-400' },
  numpad: { name: 'Numpad', icon: '🔢', color: 'text-indigo-400' },
};
