// WebHID API type declarations
declare global {
  interface Navigator {
    hid: HID;
  }

  interface HID extends EventTarget {
    requestDevice(options?: HIDDeviceRequestOptions): Promise<HIDDevice[]>;
    getDevices(): Promise<HIDDevice[]>;
    addEventListener(
      type: "connect" | "disconnect",
      listener: (this: HID, ev: HIDConnectionEvent) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
      type: "connect" | "disconnect",
      listener: (this: HID, ev: HIDConnectionEvent) => any,
      options?: boolean | EventListenerOptions
    ): void;
  }

  interface HIDDeviceRequestOptions {
    filters: HIDDeviceFilter[];
  }

  interface HIDDeviceFilter {
    vendorId?: number;
    productId?: number;
    usagePage?: number;
    usage?: number;
  }

  interface HIDDevice extends EventTarget {
    readonly vendorId: number;
    readonly productId: number;
    readonly productName: string;
    readonly opened: boolean;
    readonly collections: HIDCollectionInfo[];
    
    open(): Promise<void>;
    close(): Promise<void>;
    sendReport(reportId: number, data: BufferSource): Promise<void>;
    sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;
    receiveFeatureReport(reportId: number): Promise<DataView>;
    
    addEventListener(
      type: "inputreport",
      listener: (this: HIDDevice, ev: HIDInputReportEvent) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
      type: "inputreport",
      listener: (this: HIDDevice, ev: HIDInputReportEvent) => any,
      options?: boolean | EventListenerOptions
    ): void;
  }

  interface HIDCollectionInfo {
    readonly usage: number;
    readonly usagePage: number;
    readonly type: number;
    readonly children: HIDCollectionInfo[];
    readonly inputReports: HIDReportInfo[];
    readonly outputReports: HIDReportInfo[];
    readonly featureReports: HIDReportInfo[];
  }

  interface HIDReportInfo {
    readonly reportId: number;
    readonly items: HIDReportItem[];
  }

  interface HIDReportItem {
    readonly isAbsolute: boolean;
    readonly isArray: boolean;
    readonly isBufferedBytes: boolean;
    readonly isConstant: boolean;
    readonly isLinear: boolean;
    readonly isRange: boolean;
    readonly isVolatile: boolean;
    readonly hasNull: boolean;
    readonly hasPreferredState: boolean;
    readonly wrap: boolean;
    readonly usages: number[];
    readonly usageMinimum: number;
    readonly usageMaximum: number;
    readonly reportSize: number;
    readonly reportCount: number;
    readonly unitExponent: number;
    readonly unitSystem: number;
    readonly unitFactorLengthExponent: number;
    readonly unitFactorMassExponent: number;
    readonly unitFactorTimeExponent: number;
    readonly unitFactorTemperatureExponent: number;
    readonly unitFactorCurrentExponent: number;
    readonly unitFactorLuminousIntensityExponent: number;
    readonly logicalMinimum: number;
    readonly logicalMaximum: number;
    readonly physicalMinimum: number;
    readonly physicalMaximum: number;
    readonly strings: string[];
  }

  interface HIDInputReportEvent extends Event {
    readonly device: HIDDevice;
    readonly reportId: number;
    readonly data: DataView;
  }

  interface HIDConnectionEvent extends Event {
    readonly device: HIDDevice;
  }
}