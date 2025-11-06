import { useState } from "react";

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

export function useKeyboard() {
  const [device, setDevice] = useState<KeyboardDevice | null>(null);
  const [connectionState, setConnectionState] = useState<KeyboardConnectionState>({
    connected: false,
    demoMode: false,
    leftHalf: false,
    rightHalf: false
  });

  async function connectHardware() {
    try {
      const filters = [
        { vendorId: 0xFEED, productId: 0x6060 },
        { vendorId: 0xFEED, productId: 0x6061 },
        { vendorId: 0xFEED, productId: 0x6062 },
      ];
      const [selected] = await navigator.hid.requestDevice({ filters });
      if (!selected) return false;

      await selected.open();
      setDevice(selected);
      setConnectionState({
        connected: true,
        demoMode: false,
        leftHalf: true,
        rightHalf: true
      });

      selected.addEventListener("inputreport", (event: HIDInputReportEvent) => {
        const { data, reportId } = event;
        console.log("Received from keyboard:", { reportId, data });
      });

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
    if (device) {
      device.close();
      setDevice(null);
    }
    setConnectionState({
      connected: false,
      demoMode: false,
      leftHalf: false,
      rightHalf: false
    });
    console.log(connectionState.demoMode ? "Demo mode deactivated" : "Hardware disconnected");
  }

  async function sendCommand(reportId: number, payload: Uint8Array, keyId?: string) {
    if (!connectionState.connected) {
      console.warn("Cannot send command: no connection");
      return false;
    }

    if (connectionState.demoMode) {
      console.log("Demo mode: Would send command", {
        reportId,
        payload: Array.from(payload),
        keyId,
        timestamp: new Date().toISOString()
      });
      // Simulate successful command
      return true;
    }

    try {
      if (!device) {
        console.error("No hardware device available");
        return false;
      }
      await device.sendReport(reportId, payload);
      console.log("Command sent to hardware:", { reportId, payload: Array.from(payload) });
      return true;
    } catch (err) {
      console.error("Failed to send command:", err);
      return false;
    }
  }

  return { 
    connectionState,
    connectHardware, 
    connectDemo, 
    disconnect, 
    sendCommand,
    // Legacy compatibility
    connected: connectionState.connected,
    connect: connectHardware,
    send: sendCommand
  };
}
