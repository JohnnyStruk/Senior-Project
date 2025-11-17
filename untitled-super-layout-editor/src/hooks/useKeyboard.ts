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
    addEventListener(type: "disconnect", listener: () => void): void;
    productId: number;
    vendorId: number;
    productName?: string;
    opened: boolean;
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
      if (!selected) {
        console.warn('No device selected');
        return false;
      }

      console.log('Selected device:', {
        productId: `0x${selected.productId.toString(16)}`,
        vendorId: `0x${selected.vendorId.toString(16)}`,
        productName: selected.productName,
        opened: selected.opened
      });

      // Determine which half this is based on product ID
      const productId = selected.productId;
      const isLeft = productId === 0x6060;
      const isRight = productId === 0x6061;

      if (!isLeft && !isRight) {
        console.warn(`Unknown product ID: 0x${productId.toString(16)}`);
        return false;
      }

      const half = isLeft ? 'left' : 'right';

      // Check if selected device is already open from a previous connection
      if (selected.opened) {
        console.warn(`⚠️ Device was ALREADY OPEN when selected!`);
        console.warn(`This is a stale connection. Closing and reopening...`);
        try {
          await selected.close();
          console.log(`Closed stale device connection`);
          // Small delay to let the device fully close
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
          console.error(`Failed to close stale device:`, err);
          // Try to continue anyway
        }
      }

      // CRITICAL: Close any existing device for this half before opening new one
      const existingDevice = devices[half];
      if (existingDevice && existingDevice !== selected) {
        console.warn(`⚠️ Closing existing ${half} device from state before opening new connection`);
        try {
          await existingDevice.close();
        } catch (err) {
          console.warn(`Failed to close existing ${half} device:`, err);
          // Continue anyway - we'll try to open the new device
        }
      }

      // Open the new device
      console.log(`Opening ${half} device...`);
      try {
        await selected.open();
        console.log(`${half} device opened successfully`);
      } catch (openError: any) {
        if (openError.name === 'InvalidStateError') {
          console.warn(`⚠️ Device reports already open!`);
          console.warn(`This usually means a stale connection exists.`);
          console.warn(`Attempting to use the device anyway, but if writes fail, disconnect and reconnect.`);
          // Device is already open - this MIGHT work but often indicates a stale connection
          // The user should see this warning and know to disconnect/reconnect if issues occur
        } else {
          console.error(`Failed to open ${half} device:`, openError);
          throw openError;
        }
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

      // Set up disconnect listener - critical for handling unplug events
      selected.addEventListener("disconnect", () => {
        const half = isLeft ? 'left' : 'right';
        console.warn(`⚠️ ${half} keyboard disconnected (unplugged)`);

        // Clear the disconnected device
        setDevices(prev => ({
          ...prev,
          [half]: null
        }));

        // Update connection state - check if any device remains connected
        setConnectionState(prev => {
          const stillConnected = (half === 'left' ? prev.rightHalf : prev.leftHalf);
          return {
            connected: stillConnected,
            demoMode: false,
            leftHalf: half === 'left' ? false : prev.leftHalf,
            rightHalf: half === 'right' ? false : prev.rightHalf
          };
        });

        // Clear any pending VIA requests for this device
        if (viaManagerRef.current) {
          viaManagerRef.current.clearPending();
        }

        alert(`⚠️ ${half === 'left' ? 'Left' : 'Right'} keyboard disconnected. Please reconnect if needed.`);
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

  async function disconnect() {
    console.log('Disconnecting devices...');

    // Close both devices if they exist - MUST await to prevent USB stack issues
    const closePromises: Promise<void>[] = [];

    if (devices.left) {
      console.log('Closing left device...');
      closePromises.push(
        devices.left.close()
          .then(() => console.log('Left device closed successfully'))
          .catch(err => console.error('Failed to close left device:', err))
      );
    }

    if (devices.right) {
      console.log('Closing right device...');
      closePromises.push(
        devices.right.close()
          .then(() => console.log('Right device closed successfully'))
          .catch(err => console.error('Failed to close right device:', err))
      );
    }

    // Wait for all close operations to complete
    await Promise.all(closePromises);
    console.log('All devices closed');

    // Small delay to ensure USB cleanup completes
    await new Promise(resolve => setTimeout(resolve, 100));

    setDevices({ left: null, right: null });
    setConnectionState({
      connected: false,
      demoMode: false,
      leftHalf: false,
      rightHalf: false
    });
    console.log(connectionState.demoMode ? "Demo mode deactivated" : "Hardware disconnected");
    console.log('Disconnect complete - safe to unplug');
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
      const cmdStartTime = performance.now();
      const response = await viaManagerRef.current.sendCommand(
        device,
        packet,
        VIACommand.DYNAMIC_KEYMAP_GET_KEYCODE
      );
      const cmdDuration = performance.now() - cmdStartTime;
      const keycode = parseKeycode(response);

      // Only log slow operations or errors
      if (cmdDuration > 100) {
        console.warn(`    ⚠️ Slow read at ${half} L${layer}R${row}C${col}: ${cmdDuration.toFixed(1)}ms -> 0x${keycode.toString(16)}`);
      }

      return keycode;
    } catch (err) {
      console.error(`    Failed to read keycode at ${half} L${layer}R${row}C${col}:`, err);
      return null;
    }
  }

  /**
   * Write a single keycode to hardware
   *
   * NOTE: RP2040 USB Stack Limitation
   * The RP2040's USB stack can enter a "stuck" state where HID output reports
   * (writes) are blocked with NotAllowedError, even though the device appears
   * connected and HID input reports (reads/typing) work fine.
   *
   * This occurs during disconnect/reconnect cycles and is a hardware/firmware
   * limitation, not a software bug. When detected, we automatically disconnect
   * and throw USB_STACK_STUCK error with BOOTSEL reset instructions.
   *
   * Workaround: BOOTSEL reset (hold BOOT button while plugging in, then unplug)
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
    } catch (err: any) {
      console.error(`Failed to write keycode to ${half} L${layer}R${row}C${col}:`, err);

      // Detect RP2040 USB stack stuck state
      if (err.name === 'NotAllowedError' || err.message?.includes('NotAllowedError')) {
        console.error(`
╔═══════════════════════════════════════════════════════════╗
║ RP2040 USB STACK STUCK - AUTOMATIC CLEANUP            ║
╠═══════════════════════════════════════════════════════════╣
║ The keyboard's USB stack has entered a stuck state.      ║
║ This is a known RP2040 firmware limitation.              ║
║                                                           ║
║ Forcing disconnect to prevent further errors...          ║
╚═══════════════════════════════════════════════════════════╝
        `);

        // Automatically force disconnect to prevent "zombie connection"
        await disconnect();

        // Throw a more helpful error
        throw new Error('USB_STACK_STUCK');
      }

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
    const readStartTime = performance.now();
    console.log(`\n╔════════════════════════════════════════════════════════════╗`);
    console.log(`║  READ LAYER KEYMAP START: ${half.toUpperCase().padEnd(5)} Layer ${layer}              ║`);
    console.log(`╚════════════════════════════════════════════════════════════╝`);

    if (connectionState.demoMode) {
      console.log(`Demo mode: Would read entire keymap for ${half} layer ${layer}`);
      return {}; // Return empty mock keymap
    }

    const device = devices[half];
    console.log(` Device for ${half}:`, device ? 'Connected' : 'NULL');
    console.log(` VIA Manager:`, viaManagerRef.current ? 'Ready' : 'NULL');

    if (!device || !viaManagerRef.current) {
      console.error(`Cannot read ${half}: device or VIA manager is null`);
      return null;
    }

    const keymap: Record<string, number> = {};
    let keysRead = 0;
    let totalOperations = 0;
    const timings: number[] = [];

    try {
      console.log(`📋 Reading ${PROTOBOARD_ROWS}×${PROTOBOARD_COLS} = ${PROTOBOARD_ROWS * PROTOBOARD_COLS} key positions...\n`);

      for (let row = 0; row < PROTOBOARD_ROWS; row++) {
        for (let col = 0; col < PROTOBOARD_COLS; col++) {
          totalOperations++;
          const keyId = `L${row}R${col}`;
          const operationStart = performance.now();

          const keycode = await readKeycode(layer, row, col, half);

          const operationTime = performance.now() - operationStart;
          timings.push(operationTime);

          if (keycode !== null && keycode !== 0x00) {
            keymap[keyId] = keycode;
            keysRead++;
            console.log(`   [${totalOperations}/20] ${half} ${keyId}: 0x${keycode.toString(16).padStart(4, '0')} (${operationTime.toFixed(1)}ms)`);
          } else {
            console.log(`  ⚪ [${totalOperations}/20] ${half} ${keyId}: empty/0x00 (${operationTime.toFixed(1)}ms)`);
          }
        }
      }

      const totalTime = performance.now() - readStartTime;
      const avgTime = timings.reduce((a, b) => a + b, 0) / timings.length;
      const minTime = Math.min(...timings);
      const maxTime = Math.max(...timings);

      console.log(`\n╔════════════════════════════════════════════════════════════╗`);
      console.log(`║  READ LAYER KEYMAP SUCCESS: ${half.toUpperCase().padEnd(5)} Layer ${layer}          ║`);
      console.log(`╚════════════════════════════════════════════════════════════╝`);
      console.log(`📊 Statistics:`);
      console.log(`  • Keys with values: ${keysRead}/${totalOperations}`);
      console.log(`  • Total time: ${totalTime.toFixed(2)}ms (${(totalTime/1000).toFixed(2)}s)`);
      console.log(`  • Average per key: ${avgTime.toFixed(2)}ms`);
      console.log(`  • Fastest read: ${minTime.toFixed(2)}ms`);
      console.log(`  • Slowest read: ${maxTime.toFixed(2)}ms`);
      console.log(`  • Complete keymap:`, keymap);
      return keymap;
    } catch (err) {
      const totalTime = performance.now() - readStartTime;
      console.error(`\n Failed to read keymap for ${half} layer ${layer}:`, err);
      console.error(`  • Failed after ${totalOperations} operations`);
      console.error(`  • Time before error: ${totalTime.toFixed(2)}ms`);
      console.log(`>>> readLayerKeymap ERROR: ${half} layer ${layer} <<<`);
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
    console.log(`>>> writeLayerKeymap START: ${half} layer ${layer} <<<`);
    console.log(`Keymap to write:`, keymap);
    console.log(`Number of keys to write:`, Object.keys(keymap).length);

    if (connectionState.demoMode) {
      console.log(`Demo mode: Would write keymap for ${half} layer ${layer}:`, keymap);
      return true;
    }

    const device = devices[half];
    console.log(`Device for ${half}:`, device ? 'Connected' : 'NULL');
    console.log(`VIA Manager:`, viaManagerRef.current ? 'Ready' : 'NULL');

    if (!device || !viaManagerRef.current) {
      console.error(`Cannot write ${half}: device or VIA manager is null`);
      return false;
    }

    let keysWritten = 0;

    try {
      for (const [keyId, keycode] of Object.entries(keymap)) {
        const position = parseMatrixPosition(keyId);
        console.log(`Writing ${keyId} (keycode 0x${keycode.toString(16)}) -> Row ${position?.row}, Col ${position?.col}`);
        if (position) {
          const success = await writeKeycode(layer, position.row, position.col, keycode, half);
          if (success) {
            keysWritten++;
            console.log(`  -> Success (${keysWritten}/${Object.keys(keymap).length})`);
          } else {
            console.error(`  -> FAILED to write ${keyId}`);
          }
        } else {
          console.error(`  -> Invalid position for ${keyId}`);
        }
      }
      console.log(`Successfully wrote ${keysWritten}/${Object.keys(keymap).length} keys to ${half} layer ${layer}`);
      console.log(`>>> writeLayerKeymap SUCCESS: ${half} layer ${layer} <<<`);
      return true;
    } catch (err: any) {
      console.error(`Failed to write keymap for ${half} layer ${layer}:`, err);
      console.log(`>>> writeLayerKeymap ERROR: ${half} layer ${layer} <<<`);

      // Re-throw USB stack stuck error so it can be handled at higher level
      if (err.message === 'USB_STACK_STUCK') {
        throw err;
      }

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
