# USB Stability Settings

# Wait for USB enumeration to complete before running firmware
# This prevents firmware from starting before USB is ready
USB_WAIT_FOR_ENUMERATION = yes

# Explicitly enable RAW HID for VIA communication
# (VIA_ENABLE in keymaps/via/rules.mk should auto-enable this, but being explicit)
RAW_ENABLE = yes
