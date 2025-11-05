// Copyright 2025 QMK
// SPDX-License-Identifier: GPL-2.0-or-later

/*******************************************************************************
  88888888888 888      d8b                .d888 d8b 888               d8b
      888     888      Y8P               d88P"  Y8P 888               Y8P
      888     888                        888        888
      888     88888b.  888 .d8888b       888888 888 888  .d88b.       888 .d8888b
      888     888 "88b 888 88K           888    888 888 d8P  Y8b      888 88K
      888     888  888 888 "Y8888b.      888    888 888 88888888      888 "Y8888b.
      888     888  888 888      X88      888    888 888 Y8b.          888      X88
      888     888  888 888  88888P'      888    888 888  "Y8888       888  88888P'
                                                        888                 888
                                                        888                 888
                                                        888                 888
     .d88b.   .d88b.  88888b.   .d88b.  888d888 8888b.  888888 .d88b.   .d88888
    d88P"88b d8P  Y8b 888 "88b d8P  Y8b 888P"      "88b 888   d8P  Y8b d88" 888
    888  888 88888888 888  888 88888888 888    .d888888 888   88888888 888  888
    Y88b 888 Y8b.     888  888 Y8b.     888    888  888 Y88b. Y8b.     Y88b 888
     "Y88888  "Y8888  888  888  "Y8888  888    "Y888888  "Y888 "Y8888   "Y88888
         888
    Y8b d88P
     "Y88P"
*******************************************************************************/

#pragma once

#include "quantum.h"

// Layout content

#define XXX KC_NO

#define LAYOUT(k0A, k0B, k0C, k0D, k0E, k0F, k0G, k1A, k1B, k1C, k1D, k1E, k1F, k1G, k2A, k2B, k2C, k2D, k2E, k2F, k3A, k3B, k3C, k3D, k3E, k3F, k4A, k4B, k4C, k4D, k4E, k4F, k5A, k5B, k5C, k5E, k5F) { \
    { k0A, k0B, k0C, k0D, k0E, k0F, k0G, XXX }, \
    { k1A, k1B, k1C, k1D, k1E, k1F, k1G, XXX }, \
    { k2A, k2B, k2C, k2D, k2E, k2F, XXX, XXX }, \
    { k3A, k3B, k3C, k3D, k3E, k3F, XXX, XXX }, \
    { k4A, k4B, k4C, k4D, k4E, k4F, XXX, XXX }, \
    { k5A, k5B, k5C, XXX, k5E, k5F, XXX, XXX }, \
    { XXX, XXX, XXX, XXX, XXX, XXX, XXX, XXX }, \
    { XXX, XXX, XXX, XXX, XXX, XXX, XXX, XXX } \
}
