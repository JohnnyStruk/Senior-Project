#pragma once

/* Required for Via integration */
//#define VENDOR_ID 0xFEED
//#define PRODUCT_ID 0x6061
//#define DEVICE_VER 0x0001
//#define MANUFACTURER Five Man Band but We All Play the Keyboard
//#define PRODUCT Untitled Super Keyboard Right

/* RP2040 I2C setup */
#define I2C_DRIVER I2CD1
#define I2C1_SDA_PIN GP4
#define I2C1_SCL_PIN GP5
#define I2C1_CLOCK_SPEED 400000

/* Matrix size */
#define MATRIX_ROWS 6
#define MATRIX_COLS 9

/* Prevent issues with interrupt pins */
#define MCP23017_INTB_PIN   NO_PIN
#define MCP23017_INTA_PIN   NO_PIN
#define MCP23017_RESET_PIN  NO_PIN

/* MCP23017 addresses */
#define MCP23017_ADDR_0 0x20
#define MCP23017_ADDR_1 0x21
#define MCP23017_ADDR_2 0x22

#define MCP23017_ROW_PINS_0 { B0, B1, B2, B3, B4, B5 }
#define MCP23017_COL_PINS_0 { A0, A1, A2, A3, A4, A5, A6, A7, B0 }

/* Tuning */
#define DEBOUNCE 10
#define MATRIX_IO_DELAY 30

/* Lighting */
#define WS2812_DI_PIN GP17
#define RGBLIGHT_LED_COUNT 49
#define RGBLIGHT_LIMIT_VAL 120
#define RGBLIGHT_SLEEP
#define WS2812_DRIVER_VENDOR

