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
#include <stdint.h>
#include <stdbool.h>
#include <keycodes.h>

#include "compiler_support.h"

#define COMMUNITY_MODULES_API_VERSION_BUILDER(ver_major,ver_minor,ver_patch) (((((uint32_t)(ver_major))&0xFF) << 24) | ((((uint32_t)(ver_minor))&0xFF) << 16) | (((uint32_t)(ver_patch))&0xFF))
#define COMMUNITY_MODULES_API_VERSION COMMUNITY_MODULES_API_VERSION_BUILDER(1,1,1)
#define ASSERT_COMMUNITY_MODULES_MIN_API_VERSION(ver_major,ver_minor,ver_patch) STATIC_ASSERT(COMMUNITY_MODULES_API_VERSION_BUILDER(ver_major,ver_minor,ver_patch) <= COMMUNITY_MODULES_API_VERSION, "Community module requires a newer version of QMK modules API -- needs: " #ver_major "." #ver_minor "." #ver_patch ", current: 1.1.1.")

typedef struct keyrecord_t keyrecord_t; // forward declaration so we don't need to include quantum.h

