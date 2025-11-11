#include "quantum.h"
#include "i2c_master.h"
#include "mcp23017.h"

void keyboard_pre_init_kb(void) {
    i2c_init();
    mcp23017_init();

#ifdef RGBLIGHT_ENABLE
    rgblight_init();
#endif

    keyboard_pre_init_user();
}

void keyboard_post_init_kb(void) {
    keyboard_post_init_user();
}