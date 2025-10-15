#pragma once

#include "config_common.h"

/* RP2040 I2C setup */
#define I2C_DRIVER I2CD1
#define I2C1_SDA_PIN GP4
#define I2C1_SCL_PIN GP5
#define I2C1_SDA_PAL_MODE 4
#define I2C1_SCL_PAL_MODE 4
#define I2C1_CLOCK_SPEED 400000

/* Matrix size */
#define MATRIX_ROWS 8
#define MATRIX_COLS 8

/* Diode direction */
#define DIODE_DIRECTION COL2ROW