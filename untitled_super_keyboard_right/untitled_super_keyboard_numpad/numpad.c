#include "quantum.h"
#include "matrix.h"   // gives access to MATRIX_ROWS / MATRIX_COLS
#include "numpad_config.h"
#include "i2c_master.h"
#include "mcp23017.h"
#include "action.h"
#include "timer.h"

static bool is_connected = false;

static const uint8_t row_pins[NP_ROWS] = MCP23017_ROW_PINS_NP;
static const uint8_t col_pins[NP_COLS] = MCP23017_COL_PINS_NP;
static matrix_row_t np_state[NP_ROWS] = {0};

void numpad_init(void) {
    if (i2c_start(MCP23017_ADDR_NP << 1, false) == I2C_STATUS_SUCCESS) {
        mcp23017_init_addr(MCP23017_ADDR_NP)
        is_connected = true;

        for (uint8_t row = 0; row < NP_ROWS; row++) {
            mcp23017_set_pin_direction(MCP23017_ADDR_NP, row_pins[row], false);
        }
        for (uint8_t col = 0; col < NP_COLS; col++) {
            mcp23017_set_pin_direction(MCP23017_ADDR_NP, col_pins[col], true);
            mcp23017_set_pin_value(MCP23017_ADDR_NP, col_pins[col], true);
        }
    } else {
        is_connected = false;
    }
}

bool numpad_connected(void) {
    return is_connected;
}

void numpad_scan(void) {
    if (!is_connected) {
        return;
    }

    matrix_row_t new_state[NP_ROWS] = {0};

    for(uint8_t row = 0; row < NP_ROWS; row++) {
        for (uint8_t i = 0; i < NP_ROWS; i++) {
            mcp23017_set_pin_value(MCP23017_ADDR_NP, row_pins[i], i == row ? 0 : 1);
        }

        wait_us(5);

        for (uint8_t col = 0; col < NP_COLS; col++) {
            bool col_val = mcp23017_read_pin(MCP23017_ADDR_NP, col_pins[col]);
            if (!col_val) {
                new_state[row] |= (1 << col);
            }
        }
    }

    for(uint8_t row = 0; row < NP_ROWS; row++) {
        matrix_row_t changed = new_state[row] ^ np_state[row];
        if (changed) {
            for (uint8_t col == 0; col < NP_COLS; col++) {
                if (changed & (1 << col)) {
                    bool pressed = new_state[row] & (1 << col);
                    action_exec((keyevent_t) {
                        .key = (keypos_t){.row = row + MATRIX_ROWS, .col = col},
                        .pressed = pressed,
                        .time = timer_read(),
                    });
                }
            }
        }
        np_state[row] = new_state[row];
    }
}