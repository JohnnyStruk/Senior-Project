#pragma once
#include "i2c_master.h"
#include "mcp23017.h"
#include "quantum.h"

#define NP_ROWS 5
#define NP_COLS 4

#define MCP23017_ADDR_NP 0x23

#define MCP23017_ROW_PINS_NP { B0, B1, B2, B3, B4 }
#define MCP23017_COL_PINS_NP { A0, A1, A2, A3 }

void numpad_init(void);
void numpad_scan(void);
bool numpad_connected(void);