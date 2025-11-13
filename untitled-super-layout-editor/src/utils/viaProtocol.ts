/**
 * VIA Protocol Implementation for Protoboard Keyboards
 *
 * Protoboard specs:
 * - Left/Right: 4×5 matrix (20 keys each)
 * - USB IDs: 0xFEED:0x6060 (left), 0xFEED:0x6061 (right)
 * - VIA enabled in firmware
 */

// VIA Protocol Constants
export const VIA_PROTOCOL_VERSION = 0x0009;
export const RAW_REPORT_SIZE = 32;

// Protoboard Matrix Configuration
export const PROTOBOARD_ROWS = 4;
export const PROTOBOARD_COLS = 5;

// VIA Command IDs
export const VIACommand = {
  GET_PROTOCOL_VERSION: 0x01,
  GET_KEYBOARD_VALUE: 0x02,
  SET_KEYBOARD_VALUE: 0x03,
  DYNAMIC_KEYMAP_GET_KEYCODE: 0x04,
  DYNAMIC_KEYMAP_SET_KEYCODE: 0x05,
  DYNAMIC_KEYMAP_RESET: 0x0C,
  BOOTLOADER_JUMP: 0x0D,
  DYNAMIC_KEYMAP_GET_LAYER_COUNT: 0x11,
} as const;

export type VIACommand = typeof VIACommand[keyof typeof VIACommand];

/**
 * Create a VIA command packet
 */
export function createVIAPacket(command: VIACommand, ...args: number[]): Uint8Array {
  const packet = new Uint8Array(RAW_REPORT_SIZE);
  packet[0] = command;

  for (let i = 0; i < args.length && i < RAW_REPORT_SIZE - 1; i++) {
    packet[i + 1] = args[i];
  }

  return packet;
}

/**
 * Get protocol version from keyboard
 */
export function getProtocolVersionPacket(): Uint8Array {
  return createVIAPacket(VIACommand.GET_PROTOCOL_VERSION);
}

/**
 * Parse protocol version response
 */
export function parseProtocolVersion(response: DataView): number {
  const high = response.getUint8(1);
  const low = response.getUint8(2);
  return (high << 8) | low;
}

/**
 * Get layer count from keyboard
 */
export function getLayerCountPacket(): Uint8Array {
  return createVIAPacket(VIACommand.DYNAMIC_KEYMAP_GET_LAYER_COUNT);
}

/**
 * Parse layer count response
 */
export function parseLayerCount(response: DataView): number {
  return response.getUint8(1);
}

/**
 * Get keycode at specific position
 */
export function getKeycodePacket(layer: number, row: number, col: number): Uint8Array {
  return createVIAPacket(VIACommand.DYNAMIC_KEYMAP_GET_KEYCODE, layer, row, col);
}

/**
 * Parse keycode response
 */
export function parseKeycode(response: DataView): number {
  const high = response.getUint8(4);
  const low = response.getUint8(5);
  return (high << 8) | low;
}

/**
 * Set keycode at specific position
 */
export function setKeycodePacket(
  layer: number,
  row: number,
  col: number,
  keycode: number
): Uint8Array {
  const high = (keycode >> 8) & 0xFF;
  const low = keycode & 0xFF;
  return createVIAPacket(VIACommand.DYNAMIC_KEYMAP_SET_KEYCODE, layer, row, col, high, low);
}

/**
 * Reset dynamic keymap to default
 */
export function resetKeymapPacket(): Uint8Array {
  return createVIAPacket(VIACommand.DYNAMIC_KEYMAP_RESET);
}

/**
 * Jump to bootloader (for firmware flashing)
 */
export function jumpToBootloaderPacket(): Uint8Array {
  return createVIAPacket(VIACommand.BOOTLOADER_JUMP);
}

/**
 * Parse matrix position from key ID (format: "L0R0", "L3R4", etc.)
 */
export function parseMatrixPosition(keyId: string): { row: number; col: number } | null {
  const match = keyId.match(/L(\d+)R(\d+)/);
  if (!match) return null;

  return {
    row: parseInt(match[1], 10),
    col: parseInt(match[2], 10),
  };
}

/**
 * VIA Communication Manager
 * Handles request/response matching for VIA commands
 */
export class VIAManager {
  private pendingRequests = new Map<VIACommand, {
    resolve: (data: DataView) => void;
    reject: (reason?: any) => void;
  }>();

  /**
   * Send a VIA command and wait for response
   */
  async sendCommand(
    device: HIDDevice,
    packet: Uint8Array,
    expectedCommand: VIACommand,
    timeout: number = 1000
  ): Promise<DataView> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(expectedCommand);
        reject(new Error('VIA command timeout'));
      }, timeout);

      this.pendingRequests.set(expectedCommand, {
        resolve: (data) => {
          clearTimeout(timeoutId);
          resolve(data);
        },
        reject: (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      });

      device.sendReport(0, packet).catch((error) => {
        clearTimeout(timeoutId);
        this.pendingRequests.delete(expectedCommand);
        reject(error);
      });
    });
  }

  /**
   * Handle incoming HID report
   * Call this from your inputreport event listener
   */
  handleResponse(data: DataView) {
    const command = data.getUint8(0) as VIACommand;
    const pending = this.pendingRequests.get(command);

    if (pending) {
      pending.resolve(data);
      this.pendingRequests.delete(command);
    }
  }

  /**
   * Clear all pending requests
   */
  clearPending() {
    for (const [, pending] of this.pendingRequests) {
      pending.reject(new Error('Connection closed'));
    }
    this.pendingRequests.clear();
  }
}
