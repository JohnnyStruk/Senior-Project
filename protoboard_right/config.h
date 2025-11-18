#pragma once

//
// RP2040 USB Enumeration Fix (RP2040-E5)
//
// Fixes hardware errata where USB doesn't properly re-enumerate after disconnect

#define SPLIT_USB_DETECT
#define SPLIT_USB_TIMEOUT 2500
#define SPLIT_USB_TIMEOUT_POLL 10

// USB Stability Settings

// Give USB controller time to stabilize after resume/reconnect
#define USB_SUSPEND_WAKEUP_DELAY 200

// Wait for USB to fully enumerate before starting keyboard operations
#define WAIT_FOR_USB

// VIA Protocol Optimization

// Ensure proper buffer size for VIA RAW HID communication
#define RAW_EPSIZE 32

// Allow VIA EEPROM reset if needed
#define VIA_EEPROM_ALLOW_RESET

// Number of layers VIA can manage
#define DYNAMIC_KEYMAP_LAYER_COUNT 4

// Maximum EEPROM address for dynamic keymap
#define DYNAMIC_KEYMAP_EEPROM_MAX_ADDR 2047

// Additional USB Settings

// USB polling interval (1ms for responsive communication)
#define USB_POLLING_INTERVAL_MS 1
