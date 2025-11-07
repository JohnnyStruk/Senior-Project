import type { LayerKeymap } from '../hooks/useKeymap';

// Default keymap parsed from QMK firmware (untitled_super_keyboard/keymaps/default/keymap.c)
// This represents the factory default Layer 0 for the left half
export const DEFAULT_LEFT_KEYMAP: LayerKeymap = {
  // Row 0 - Function keys
  'left-0-0': 'KC_ESC',
  'left-0-1': 'KC_F1',
  'left-0-2': 'KC_F2',
  'left-0-3': 'KC_F3',
  'left-0-4': 'KC_F4',
  'left-0-5': 'KC_F5',
  'left-0-6': 'KC_F6',

  // Row 1 - Number row
  'left-1-0': 'KC_GRV',
  'left-1-1': 'KC_1',
  'left-1-2': 'KC_2',
  'left-1-3': 'KC_3',
  'left-1-4': 'KC_4',
  'left-1-5': 'KC_5',
  'left-1-6': 'KC_6',

  // Row 2 - QWERT
  'left-2-0': 'KC_TAB',
  'left-2-1': 'KC_Q',
  'left-2-2': 'KC_W',
  'left-2-3': 'KC_E',
  'left-2-4': 'KC_R',
  'left-2-5': 'KC_T',

  // Row 3 - ASDFG
  'left-3-0': 'KC_CAPS',
  'left-3-1': 'KC_A',
  'left-3-2': 'KC_S',
  'left-3-3': 'KC_D',
  'left-3-4': 'KC_F',
  'left-3-5': 'KC_G',

  // Row 4 - ZXCVB
  'left-4-0': 'KC_LSFT',
  'left-4-1': 'KC_Z',
  'left-4-2': 'KC_X',
  'left-4-3': 'KC_C',
  'left-4-4': 'KC_V',
  'left-4-5': 'KC_B',

  // Row 5 - Modifiers
  'left-5-0': 'KC_LCTL',
  'left-5-1': 'KC_LGUI',
  'left-5-2': 'KC_LALT',
  'left-5-4': 'KC_SPC',
  'left-5-5': 'KC_SPC',
};

// Default keymap for the right half (mirrored standard QWERTY layout)
export const DEFAULT_RIGHT_KEYMAP: LayerKeymap = {
  // Row 0 - Function keys
  'right-0-0': 'KC_F7',
  'right-0-1': 'KC_F8',
  'right-0-2': 'KC_F9',
  'right-0-3': 'KC_F10',
  'right-0-4': 'KC_F11',
  'right-0-5': 'KC_F12',
  'right-0-6': 'KC_PSCR',
  'right-0-8': 'KC_DEL',

  // Row 1 - Number row
  'right-1-0': 'KC_7',
  'right-1-1': 'KC_8',
  'right-1-2': 'KC_9',
  'right-1-3': 'KC_0',
  'right-1-4': 'KC_MINS',
  'right-1-5': 'KC_EQL',
  'right-1-6': 'KC_BSPC',
  'right-1-8': 'KC_PGUP',

  // Row 2 - YUIOP
  'right-2-0': 'KC_Y',
  'right-2-1': 'KC_U',
  'right-2-2': 'KC_I',
  'right-2-3': 'KC_O',
  'right-2-4': 'KC_P',
  'right-2-5': 'KC_LBRC',
  'right-2-6': 'KC_RBRC',
  'right-2-7': 'KC_BSLS',
  'right-2-8': 'KC_PGDN',

  // Row 3 - HJKL
  'right-3-0': 'KC_H',
  'right-3-1': 'KC_J',
  'right-3-2': 'KC_K',
  'right-3-3': 'KC_L',
  'right-3-4': 'KC_SCLN',
  'right-3-5': 'KC_QUOT',
  'right-3-6': 'KC_ENT',
  'right-3-8': 'KC_HOME',

  // Row 4 - NM<>?
  'right-4-0': 'KC_N',
  'right-4-1': 'KC_M',
  'right-4-2': 'KC_COMM',
  'right-4-3': 'KC_DOT',
  'right-4-4': 'KC_SLSH',
  'right-4-5': 'KC_RSFT',
  'right-4-7': 'KC_UP',

  // Row 5 - Modifiers and arrows
  'right-5-0': 'KC_SPC',
  'right-5-3': 'KC_RALT',
  'right-5-4': 'KC_APP',
  'right-5-5': 'KC_RCTL',
  'right-5-6': 'KC_LEFT',
  'right-5-7': 'KC_DOWN',
  'right-5-8': 'KC_RGHT',
};

// Combine into default Layer 0
export const DEFAULT_LAYER_0: LayerKeymap = {
  ...DEFAULT_LEFT_KEYMAP,
  ...DEFAULT_RIGHT_KEYMAP,
};

// Get the complete default keymap with all 5 empty layers except Layer 0
export function getDefaultKeymap(): LayerKeymap[] {
  const layers: LayerKeymap[] = [];

  // Layer 0 is the default QWERTY layout
  layers[0] = { ...DEFAULT_LAYER_0 };

  // Layers 1-4 start empty
  for (let i = 1; i < 5; i++) {
    layers[i] = {};
  }

  return layers;
}
