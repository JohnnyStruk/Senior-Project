#include "quantum.h"
#include "i2c_master.h"
#include "mcp23017.h"

void keyboard_pre_init_kb(void) {
    i2c_init();
    mcp23017_init();

    // Debug confirmation
    dprintf("MCP23017 initialized on address 0x24\n");
}

void keyboard_post_init_kb(void) {
    keybord_post_init_user();
}