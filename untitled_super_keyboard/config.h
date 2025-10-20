#pragma once

/* RP2040 I2C setup */
#define I2C_DRIVER I2CD1
#define I2C1_SDA_PIN GP4
#define I2C1_SCL_PIN GP5
#define I2C1_CLOCK_SPEED 400000

/* Matrix size */
#define MATRIX_ROWS 8
#define MATRIX_COLS 8

/* MCP23017 addresses */
#define MCP23017_ADDRESSES {0x24}
#define MCP23017_ROW_PINS { B0, B1, B2, B3, B4, B5, B6, B7 }
#define MCP23017_COL_PINS { A0, A1, A2, A3, A4, A5, A6, A7 }

/* Tuning */
#define DEBOUNCE 10
#define MATRIX_IO_DELAY 30