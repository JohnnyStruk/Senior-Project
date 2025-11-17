#pragma once

// Include the base QMK RP2040 MCU configuration
#include_next <mcuconf.h>

// ========================================
// RP2040 USB VBUS Detection Fix
// ========================================
// Forces VBUS detection to be enabled
// This helps the RP2040 properly detect USB connection/disconnection events
// Without this, USB state can become stale after unplugging

#undef RP_USB_FORCE_VBUS_DETECT
#define RP_USB_FORCE_VBUS_DETECT TRUE

// ========================================
// USB Error Recovery
// ========================================
// Enable Start-of-Frame interrupt for better USB state tracking
// Helps detect and recover from USB errors

#undef RP_USB_USE_SOF_INTR
#define RP_USB_USE_SOF_INTR TRUE
