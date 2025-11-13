/**
 * QMK Keycode Mapping
 * Converts between UI keycode strings and QMK numeric values
 *
 * Based on QMK keycodes: https://docs.qmk.fm/keycodes
 */

// Basic Keycodes (0x00-0xFF) - USB HID Keyboard/Keypad Page
export const BASIC_KEYCODES: Record<string, number> = {
  // Special
  'KC_NO': 0x00,
  'XXXXXXX': 0x00,
  'KC_TRNS': 0x01,
  '______': 0x01,

  // Letters (A-Z)
  'KC_A': 0x04,
  'KC_B': 0x05,
  'KC_C': 0x06,
  'KC_D': 0x07,
  'KC_E': 0x08,
  'KC_F': 0x09,
  'KC_G': 0x0A,
  'KC_H': 0x0B,
  'KC_I': 0x0C,
  'KC_J': 0x0D,
  'KC_K': 0x0E,
  'KC_L': 0x0F,
  'KC_M': 0x10,
  'KC_N': 0x11,
  'KC_O': 0x12,
  'KC_P': 0x13,
  'KC_Q': 0x14,
  'KC_R': 0x15,
  'KC_S': 0x16,
  'KC_T': 0x17,
  'KC_U': 0x18,
  'KC_V': 0x19,
  'KC_W': 0x1A,
  'KC_X': 0x1B,
  'KC_Y': 0x1C,
  'KC_Z': 0x1D,

  // Numbers (1-0)
  'KC_1': 0x1E,
  'KC_2': 0x1F,
  'KC_3': 0x20,
  'KC_4': 0x21,
  'KC_5': 0x22,
  'KC_6': 0x23,
  'KC_7': 0x24,
  'KC_8': 0x25,
  'KC_9': 0x26,
  'KC_0': 0x27,

  // Basic editing
  'KC_ENT': 0x28,
  'KC_ENTER': 0x28,
  'KC_ESC': 0x29,
  'KC_ESCAPE': 0x29,
  'KC_BSPC': 0x2A,
  'KC_BACKSPACE': 0x2A,
  'KC_TAB': 0x2B,
  'KC_SPC': 0x2C,
  'KC_SPACE': 0x2C,

  // Symbols
  'KC_MINS': 0x2D,  // -
  'KC_EQL': 0x2E,   // =
  'KC_LBRC': 0x2F,  // [
  'KC_RBRC': 0x30,  // ]
  'KC_BSLS': 0x31,  // \
  'KC_NUHS': 0x32,  // Non-US # and ~
  'KC_SCLN': 0x33,  // ;
  'KC_QUOT': 0x34,  // '
  'KC_GRV': 0x35,   // `
  'KC_COMM': 0x36,  // ,
  'KC_DOT': 0x37,   // .
  'KC_SLSH': 0x38,  // /
  'KC_CAPS': 0x39,
  'KC_CAPSLOCK': 0x39,

  // Function keys
  'KC_F1': 0x3A,
  'KC_F2': 0x3B,
  'KC_F3': 0x3C,
  'KC_F4': 0x3D,
  'KC_F5': 0x3E,
  'KC_F6': 0x3F,
  'KC_F7': 0x40,
  'KC_F8': 0x41,
  'KC_F9': 0x42,
  'KC_F10': 0x43,
  'KC_F11': 0x44,
  'KC_F12': 0x45,

  // System
  'KC_PSCR': 0x46,
  'KC_PRINTSCREEN': 0x46,
  'KC_SCRL': 0x47,
  'KC_SCROLLLOCK': 0x47,
  'KC_PAUS': 0x48,
  'KC_PAUSE': 0x48,
  'KC_INS': 0x49,
  'KC_INSERT': 0x49,
  'KC_HOME': 0x4A,
  'KC_PGUP': 0x4B,
  'KC_PAGEUP': 0x4B,
  'KC_DEL': 0x4C,
  'KC_DELETE': 0x4C,
  'KC_END': 0x4D,
  'KC_PGDN': 0x4E,
  'KC_PAGEDOWN': 0x4E,

  // Arrows
  'KC_RGHT': 0x4F,
  'KC_RIGHT': 0x4F,
  'KC_LEFT': 0x50,
  'KC_DOWN': 0x51,
  'KC_UP': 0x52,

  // Modifiers
  'KC_LCTL': 0xE0,
  'KC_LCTRL': 0xE0,
  'KC_LSFT': 0xE1,
  'KC_LSHIFT': 0xE1,
  'KC_LALT': 0xE2,
  'KC_LGUI': 0xE3,
  'KC_LWIN': 0xE3,
  'KC_RCTL': 0xE4,
  'KC_RCTRL': 0xE4,
  'KC_RSFT': 0xE5,
  'KC_RSHIFT': 0xE5,
  'KC_RALT': 0xE6,
  'KC_RGUI': 0xE7,
  'KC_RWIN': 0xE7,

  // Application and menu
  'KC_APP': 0x65,
  'KC_MENU': 0x65,
};

// Layer switching keycodes (0x5C00-0x5CFF)
// These are dynamically generated based on layer number

/**
 * Generate layer switching keycode
 */
export function getLayerKeycode(type: 'MO' | 'TG' | 'TO' | 'TT' | 'DF' | 'OSL', layer: number): number {
  const baseOffsets = {
    MO: 0x5C00,   // Momentary layer
    TG: 0x5C10,   // Toggle layer
    TO: 0x5C20,   // Switch to layer
    TT: 0x5C30,   // Tap toggle layer
    DF: 0x5C40,   // Set default layer
    OSL: 0x5C50,  // One-shot layer
  };

  return baseOffsets[type] + layer;
}

/**
 * Parse layer switching keycode from string
 * Examples: "MO(1)", "TG(2)", "TO(3)"
 */
export function parseLayerKeycode(keycodeStr: string): number | null {
  const match = keycodeStr.match(/^(MO|TG|TO|TT|DF|OSL)\((\d+)\)$/);
  if (!match) return null;

  const [, type, layerStr] = match;
  const layer = parseInt(layerStr, 10);

  return getLayerKeycode(type as any, layer);
}

/**
 * Convert keycode string to numeric value
 */
export function stringToKeycode(keycodeStr: string): number {
  // Handle transparent/no key
  if (keycodeStr === '______' || keycodeStr === 'KC_TRNS') return 0x01;
  if (keycodeStr === 'XXXXXXX' || keycodeStr === 'KC_NO') return 0x00;

  // Handle layer switching keycodes
  const layerKeycode = parseLayerKeycode(keycodeStr);
  if (layerKeycode !== null) return layerKeycode;

  // Handle basic keycodes
  const basicKeycode = BASIC_KEYCODES[keycodeStr];
  if (basicKeycode !== undefined) return basicKeycode;

  // If unknown, warn and return KC_NO
  console.warn(`Unknown keycode: ${keycodeStr}`);
  return 0x00;
}

/**
 * Convert numeric keycode to string
 */
export function keycodeToString(keycode: number): string {
  // Handle special cases
  if (keycode === 0x00) return 'KC_NO';
  if (keycode === 0x01) return 'KC_TRNS';

  // Handle layer switching keycodes
  if (keycode >= 0x5C00 && keycode <= 0x5C5F) {
    if (keycode >= 0x5C00 && keycode <= 0x5C0F) return `MO(${keycode - 0x5C00})`;
    if (keycode >= 0x5C10 && keycode <= 0x5C1F) return `TG(${keycode - 0x5C10})`;
    if (keycode >= 0x5C20 && keycode <= 0x5C2F) return `TO(${keycode - 0x5C20})`;
    if (keycode >= 0x5C30 && keycode <= 0x5C3F) return `TT(${keycode - 0x5C30})`;
    if (keycode >= 0x5C40 && keycode <= 0x5C4F) return `DF(${keycode - 0x5C40})`;
    if (keycode >= 0x5C50 && keycode <= 0x5C5F) return `OSL(${keycode - 0x5C50})`;
  }

  // Reverse lookup in basic keycodes
  for (const [key, value] of Object.entries(BASIC_KEYCODES)) {
    if (value === keycode) {
      // Prefer shorter names (KC_A over KC_A, KC_ENT over KC_ENTER)
      if (key.length <= 6 || !key.includes('_')) {
        return key;
      }
    }
  }

  // If not found, return hex value
  return `0x${keycode.toString(16).toUpperCase().padStart(4, '0')}`;
}

/**
 * Batch convert layer keymap from strings to numbers
 */
export function convertLayerToNumeric(layer: Record<string, string>): Record<string, number> {
  const numericLayer: Record<string, number> = {};

  for (const [keyId, keycodeStr] of Object.entries(layer)) {
    numericLayer[keyId] = stringToKeycode(keycodeStr);
  }

  return numericLayer;
}

/**
 * Batch convert layer keymap from numbers to strings
 */
export function convertLayerToString(layer: Record<string, number>): Record<string, string> {
  const stringLayer: Record<string, string> = {};

  for (const [keyId, keycode] of Object.entries(layer)) {
    stringLayer[keyId] = keycodeToString(keycode);
  }

  return stringLayer;
}
