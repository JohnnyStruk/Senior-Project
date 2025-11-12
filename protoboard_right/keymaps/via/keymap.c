// Copyright 2023 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

#include QMK_KEYBOARD_H

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
    [0] = {
        {KC_Y,      KC_U,   KC_I,       KC_O,       KC_P},
        {KC_G,      KC_H,   KC_J,       KC_K,       KC_L},
        {KC_B,      KC_N,   KC_M,       KC_COMM,    KC_DOT},
        {KC_ESC,    KC_SPC, KC_RALT,    KC_RCTL,    KC_BSPC},
    }
};
