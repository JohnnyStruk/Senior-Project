// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = {
        {KC_ESC,    KC_F1,      KC_F2,      KC_F3,  KC_F4,  KC_F5,  KC_F6},
        {KC_GRV,    KC_1,       KC_2,       KC_3,   KC_4,   KC_5,   KC_6},
        {KC_TAB,    KC_Q,       KC_W,       KC_E,   KC_R,   KC_T,   KC_NO},
        {KC_CAPS,   KC_A,       KC_S,       KC_D,   KC_F,   KC_G,   KC_NO},
        {KC_LSFT,   KC_Z,       KC_X,       KC_C,   KC_V,   KC_B,   KC_NO},
        {KC_LCTL,   KC_LGUI,    KC_LALT,    KC_NO,  KC_SPC, KC_SPC, KC_NO}
    }
};
