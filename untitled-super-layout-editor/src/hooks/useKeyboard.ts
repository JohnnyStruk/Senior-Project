import { useState, useRef, useEffect } from "react";
import {
  VIAManager,
  VIACommand,
  getProtocolVersionPacket,
  parseProtocolVersion,
  getLayerCountPacket,
  parseLayerCount,
  getKeycodePacket,
  parseKeycode,
  setKeycodePacket,
  resetKeymapPacket,
  jumpToBootloaderPacket,
  parseMatrixPosition,
  PROTOBOARD_ROWS,
  PROTOBOARD_COLS,
} from "../utils/viaProtocol";

// Minimal WebHID types for this file
declare global {
  interface Navigator {
    hid: {
      requestDevice(options: { filters: Array<{ vendorId: number; productId: number }> }): Promise<Array<HIDDevice>>;
    };
  }

  interface HIDDevice {
    open(): Promise<void>;
    close(): Promise<void>;
    sendReport(reportId: number, data: Uint8Array): Promise<void>;
    addEventListener(type: "inputreport", listener: (event: HIDInputReportEvent) => void): void;
    productId: number;
    vendorId: number;
  }

  interface HIDInputReportEvent extends Event {
    data: DataView;
    reportId: number;
  }
}

type KeyboardDevice = HIDDevice;

interface KeyboardConnectionState {
  connected: boolean;
  demoMode: boolean;
  leftHalf: boolean;
  rightHalf: boolean;
}

interface DeviceState {
  left: KeyboardDevice | null;
  right: KeyboardDevice | null;
}

export function useKeyboard() {
  const [devices, setDevices] = useState<DeviceState>({
    left: null,
    right: null
  });
  const [connectionState, setConnectionState] = useState<KeyboardConnectionState>({
    connected: false,
    demoMode: false,
    leftHalf: false,
    rightHalf: false
  });
  const viaManagerRef = useRef<VIAManager | null>(null);

  // Initialize VIA manager
  useEffect(() => {
    viaManagerRef.current = new VIAManager();
    return () => {
      viaManagerRef.current?.clearPending();
    };
  }, []);

  async function connectHardware() {
    try {
      const filters = [
        { vendorId: 0xFEED, productId: 0x6060 }, // Left half
        { vendorId: 0xFEED, productId: 0x6061 }, // Right half
        { vendorId: 0xFEED, productId: 0x6062 }, // Numpad (future)
      ];
      const [selected] = await navigator.hid.requestDevice({ filters });
      if (!selected) return false;

      await selected.open();

      // Determine which half this is based on product ID
      const productId = selected.productId;
      const isLeft = productId === 0x6060;
      const isRight = productId === 0x6061;

      if (!isLeft && !isRight) {
        console.warn(`Unknown product ID: 0x${productId.toString(16)}`);
        return false;
      }

      // Update devices state
      setDevices(prev => ({
        ...prev,
        [isLeft ? 'left' : 'right']: selected
      }));

      // Update connection state
      setConnectionState(prev => ({
        connected: true,
        demoMode: false,
        leftHalf: isLeft ? true : prev.leftHalf,
        rightHalf: isRight ? true : prev.rightHalf
      }));

      // Set up input report listener
      selected.addEventListener("inputreport", (event: HIDInputReportEvent) => {
        const { data, reportId } = event;
        console.log(`Received from ${isLeft ? 'left' : 'right'} keyboard:`, { reportId, data });

        // Handle VIA protocol responses
        if (viaManagerRef.current) {
          viaManagerRef.current.handleResponse(data);
        }
      });

      console.log(`Successfully connected to ${isLeft ? 'left' : 'right'} half`);
      return true;
    } catch (err) {
      console.error("Hardware connection error:", err);
      return false;
    }
  }

  function connectDemo() {
    setConnectionState({
      connected: true,
      demoMode: true,
      leftHalf: true,
      rightHalf: true
    });
    console.log("Demo mode activated - simulating connected keyboard");
  }

  function disconnect() {
    // Close both devices if they exist
    if (devices.left) {
      devices.left.close();
    }
    if (devices.right) {
      devices.right.close();
    }

    setDevices({ left: null, right: null });
    setConnectionState({
      connected: false,
      demoMode: false,
      leftHalf: false,
      rightHalf: false
    });
    console.log(connectionState.demoMode ? "Demo mode deactivated" : "Hardware disconnected");
  }

  async function sendCommand(
    reportId: number,
    payload: Uint8Array,
    half: 'left' | 'right' = 'left',
    keyId?: string
  ) {
    if (!connectionState.connected) {
      console.warn("Cannot send command: no connection");
      return false;
    }

    if (connectionState.demoMode) {
      console.log(`Demo mode: Would send command to ${half}`, {
        reportId,
        payload: Array.from(payload),
        keyId,
        timestamp: new Date().toISOString()
      });
      // Simulate successful command
      return true;
    }

    try {
      const device = devices[half];
      if (!device) {
        console.error(`No ${half} device available`);
        return false;
      }
      await device.sendReport(reportId, payload);
      console.log(`Command sent to ${half} hardware:`, { reportId, payload: Array.from(payload) });
      return true;
    } catch (err) {
      console.error(`Failed to send command to ${half}:`, err);
      return false;
    }
  }

  // VIA Protocol Functions

  /**
   * Get VIA protocol version from keyboard
   */
  async function getVIAProtocolVersion(half: 'left' | 'right' = 'left'): Promise<number | null> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would get VIA protocol version from ${half}`);
      return 0x0009; // Return mock VIA v9
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return null;

    try {
      const packet = getProtocolVersionPacket();
      const response = await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.GET_PROTOCOL_VERSION
      );
      return parseProtocolVersion(response);
    } catch (err) {
      console.error(`Failed to get VIA protocol version from ${half}:`, err);
      return null;
    }
  }

  /**
   * Get layer count from keyboard
   */
  async function getVIALayerCount(half: 'left' | 'right' = 'left'): Promise<number | null> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would get layer count from ${half}`);
      return 5; // Return mock layer count
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return null;

    try {
      const packet = getLayerCountPacket();
      const response = await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.DYNAMIC_KEYMAP_GET_LAYER_COUNT
      );
      return parseLayerCount(response);
    } catch (err) {
      console.error(`Failed to get layer count from ${half}:`, err);
      return null;
    }
  }

  /**
   * Read a single keycode from hardware
   */
  async function readKeycode(
    layer: number,
    row: number,
    col: number,
    half: 'left' | 'right' = 'left'
  ): Promise<number | null> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would read keycode at ${half} layer=${layer}, row=${row}, col=${col}`);
      return 0x00; // Return KC_NO as mock
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return null;

    try {
      const packet = getKeycodePacket(layer, row, col);
      const response = await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.DYNAMIC_KEYMAP_GET_KEYCODE
      );
      return parseKeycode(response);
    } catch (err) {
      console.error(`Failed to read keycode at ${half} L${layer}R${row}C${col}:`, err);
      return null;
    }
  }

  /**
   * Write a single keycode to hardware
   */
  async function writeKeycode(
    layer: number,
    row: number,
    col: number,
    keycode: number,
    half: 'left' | 'right' = 'left'
  ): Promise<boolean> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would write keycode=${keycode} at ${half} layer=${layer}, row=${row}, col=${col}`);
      return true;
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return false;

    try {
      const packet = setKeycodePacket(layer, row, col, keycode);
      await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.DYNAMIC_KEYMAP_SET_KEYCODE
      );
      console.log(`Successfully wrote keycode ${keycode} to ${half} L${layer}R${row}C${col}`);
      return true;
    } catch (err) {
      console.error(`Failed to write keycode to ${half} L${layer}R${row}C${col}:`, err);
      return false;
    }
  }

  /**
   * Read entire keymap from hardware for a specific layer and half
   */
  async function readLayerKeymap(
    layer: number,
    half: 'left' | 'right' = 'left'
  ): Promise<Record<string, number> | null> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would read entire keymap for ${half} layer ${layer}`);
      return {}; // Return empty mock keymap
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return null;

    const keymap: Record<string, number> = {};

    try {
      for (let row = 0; row < PROTOBOARD_ROWS; row++) {
        for (let col = 0; col < PROTOBOARD_COLS; col++) {
          const keycode = await readKeycode(layer, row, col, half);
          if (keycode !== null && keycode !== 0x00) {
            const keyId = `L${row}R${col}`;
            keymap[keyId] = keycode;
          }
        }
      }
      console.log(`Successfully read keymap for ${half} layer ${layer}:`, keymap);
      return keymap;
    } catch (err) {
      console.error(`Failed to read keymap for ${half} layer ${layer}:`, err);
      return null;
    }
  }

  /**
   * Write entire keymap to hardware for a specific layer and half
   */
  async function writeLayerKeymap(
    layer: number,
    keymap: Record<string, number>,
    half: 'left' | 'right' = 'left'
  ): Promise<boolean> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would write keymap for ${half} layer ${layer}:`, keymap);
      return true;
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return false;

    try {
      for (const [keyId, keycode] of Object.entries(keymap)) {
        const position = parseMatrixPosition(keyId);
        if (position) {
          await writeKeycode(layer, position.row, position.col, keycode, half);
        }
      }
      console.log(`Successfully wrote keymap for ${half} layer ${layer}`);
      return true;
    } catch (err) {
      console.error(`Failed to write keymap for ${half} layer ${layer}:`, err);
      return false;
    }
  }

  /**
   * Reset keymap to firmware defaults
   */
  async function resetKeymap(half: 'left' | 'right' = 'left'): Promise<boolean> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would reset ${half} keymap to defaults`);
      return true;
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return false;

    try {
      const packet = resetKeymapPacket();
      await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.DYNAMIC_KEYMAP_RESET
      );
      console.log(`Successfully reset ${half} keymap to defaults`);
      return true;
    } catch (err) {
      console.error(`Failed to reset ${half} keymap:`, err);
      return false;
    }
  }

  /**
   * Reboot keyboard into bootloader mode (for firmware flashing)
   */
  async function rebootToBootloader(half: 'left' | 'right' = 'left'): Promise<boolean> {
    if (connectionState.demoMode) {
      console.log(`Demo mode: Would reboot ${half} to bootloader`);
      return true;
    }

    const device = devices[half];
    if (!device || !viaManagerRef.current) return false;

    try {
      const packet = jumpToBootloaderPacket();
      await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.BOOTLOADER_JUMP,
        500 // Shorter timeout since device will disconnect
      );
      console.log(`${half} keyboard rebooting to bootloader...`);
      return true;
    } catch (err) {
      // This might timeout since the device disconnects, which is expected
      console.log(`Bootloader command sent to ${half} (device may have disconnected)`);
      return true;
    }
  }

  return {
    connectionState,
    devices,
    connectHardware,
    connectDemo,
    disconnect,
    sendCommand,
    // VIA Protocol functions
    getVIAProtocolVersion,
    getVIALayerCount,
    readKeycode,
    writeKeycode,
    readLayerKeymap,
    writeLayerKeymap,
    resetKeymap,
    rebootToBootloader,
    // Legacy compatibility
    connected: connectionState.connected,
    connect: connectHardware,
    send: sendCommand
  };
}
