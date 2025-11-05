import { useState } from "react";

interface KeyboardDevice extends HIDDevice {}

export function useKeyboard() {
  const [device, setDevice] = useState<KeyboardDevice | null>(null);
  const [connected, setConnected] = useState(false);

  async function connect() {
    try {
      const filters = [
        { vendorId: 0xFEED, productId: 0x6060 },
        { vendorId: 0xFEED, productId: 0x6061 },
        { vendorId: 0xFEED, productId: 0x6062 },
      ];
      const [selected] = await navigator.hid.requestDevice({ filters });
      if (!selected) return;

      await selected.open();
      setDevice(selected);
      setConnected(true);

      selected.addEventListener("inputreport", (event: HIDInputReportEvent) => {
        const { data, reportId } = event;
        console.log("Received from keyboard:", { reportId, data });
      });
    } catch (err) {
      console.error("Connection error:", err);
    }
  }

  async function send(reportId: number, payload: Uint8Array) {
    if (!device) return;
    await device.sendReport(reportId, payload);
  }

  return { connected, connect, send };
}
