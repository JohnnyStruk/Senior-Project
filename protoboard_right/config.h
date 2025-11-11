#pragma once

/* RP2040 I2C setup */
#define I2C_DRIVER I2CD1
#define I2C1_SDA_PIN GP4
#define I2C1_SCL_PIN GP5
#define I2C1_CLOCK_SPEED 400000

/* Matrix size */
#define MATRIX_ROWS 4
#define MATRIX_COLS 5

/* Prevent issues with interrupt pins */
#define MCP23017_INTB_PIN   NO_PIN
#define MCP23017_INTA_PIN   NO_PIN
#define MCP23017_RESET_PIN  NO_PIN

/* MCP23017 addresses */
#define MCP23017_ADDRESSES {0x25}

#define MCP23017_ROW_PINS { B0, B1, B2, B3 }
#define MCP23017_COL_PINS { A0, A1, A2, A3, A4 }

/* Tuning */
#define DEBOUNCE 10
#define MATRIX_IO_DELAY 30

/* Lighting */
#define WS2812_DI_PIN GP17
#define RGBLIGHT_LED_COUNT 49
#define RGBLIGHT_LIMIT_VAL 150
#define RGBLIGHT_SLEEP
#define RGBLIGHT_EFFECT_BREATHING
#define RGBLIGHT_EFFECT_RAINBOW_MOOD
#define RGBLIGHT_EFFECT_RAINBOW_SWIRL
#define WS2812_DRIVER_VENDOR