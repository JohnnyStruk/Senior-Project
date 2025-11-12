#include "quantum.h"
#include "untitled_super_keyboard_numpad/numpad_config.h"
#include "i2c_master.h"
#include "mcp23017.h"

void keyboard_pre_init_kb(void) {
    i2c_init();

    mcp23017_init_addr(MCP23017_ADDR_0);
    mcp23017_init_addr(MCP23017_ADDR_1);
    mcp23017_init_addr(MCP23017_ADDR_2);

    numpad_init();

#ifdef RGBLIGHT_ENABLE
    rgblight_init();
#endif

    keyboard_pre_init_user();
}

void matrix_scan_kb(void) {
    matrix_scan_user();

    if (numpad_connected()) {
        numpad_scan();
    }
}

void keyboard_post_init_kb(void) {
    keyboard_post_init_user();
}