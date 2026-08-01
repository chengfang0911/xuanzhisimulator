goog.provide('Blockly.Arduino.senseOne');

goog.require('Blockly.Arduino');

Blockly.Arduino['sense_inertia_motion_initialize_menu'] = function(block) {
    const code = block.getFieldValue('SENSE_INERTIA_MOTION_MENU');
    return [code, block.ORDER_ATOMIC];
};
Blockly.Arduino['sense_xyz_geomagnetism_initialize_menu'] = function(block) {
    const code = block.getFieldValue('SENSE_XYZ_GEOMAGNETISM_MENU');
    return [code, block.ORDER_ATOMIC];
};
Blockly.Arduino['sense_color_luminance_slider'] = function(block) {
    const code = block.getFieldValue('COLOR_LUMINANCE');
    return [code, block.ORDER_ATOMIC];
};
Blockly.Arduino['sense_row_menu'] = function(block) {
    const code = block.getFieldValue('SENSE_ROW_MENU');
    return [code, block.ORDER_ATOMIC];
};
Blockly.Arduino['sense_column_menu'] = function(block) {
    const code = block.getFieldValue('SENSE_COLUMN_MENU');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['SENSE_INERTIA_MOTION_INITIALIZE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_INERTIA_MOTION_MENU', block.ORDER_ATOMIC);
    return `BMI160_Init_Sensor1(${arg0});\n`;
};

Blockly.Arduino['SENSE_X_ACCELERATED_SPEED'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMI160_Get_One_ACC_X_Float()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_Y_ACCELERATED_SPEED'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMI160_Get_One_ACC_Y_Float()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_Z_ACCELERATED_SPEED'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMI160_Get_One_ACC_Z_Float()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_X_AXIAL_ANGLE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMI160_Get_One_GYR_X_Float()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_Y_AXIAL_ANGLE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMI160_Get_One_GYR_Y_Float()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_Z_AXIAL_ANGLE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMI160_Get_One_GYR_Z_Float()`, block.ORDER_ATOMIC];
};

Blockly.Arduino['SENSE_XYZ_GEOMAGNETISM_INITIALIZE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_XYZ_GEOMAGNETISM_MENU', block.ORDER_ATOMIC);
    return `BMM150_Init_Sensor1(${arg0});\n`;
};

Blockly.Arduino['SENSE_GEOMAGNETISM_DEFLECTION'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`BMM150_getCompassDegree_Float()`, block.ORDER_ATOMIC];
};

Blockly.Arduino['SENSE_COLOURS_LCD_INITIALIZE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'COLOR_R', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'COLOR_G', block.ORDER_ATOMIC);
    const arg2 = Blockly.Arduino.valueToCode(this, 'COLOR_B', block.ORDER_ATOMIC);
    const arg3 = Blockly.Arduino.valueToCode(this, 'LUMINANCE', block.ORDER_ATOMIC);
    return `LCD1602_Init_Sensor1(0x2D,${arg0},${arg1},${arg2},${arg3});\n`;
};

Blockly.Arduino['SENSE_COLOURS_IIC_INITIALIZE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'COLOR_IIC_R', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'COLOR_IIC_G', block.ORDER_ATOMIC);
    const arg2 = Blockly.Arduino.valueToCode(this, 'COLOR_IIC_B', block.ORDER_ATOMIC);
    const arg3 = Blockly.Arduino.valueToCode(this, 'LUMINANCE_IIC', block.ORDER_ATOMIC);
    return `LCD1602_Init_Sensor1(0x6B,${arg0},${arg1},${arg2},${arg3});\n`;
};

Blockly.Arduino['SENSE_LCD_PORT_SHOW_STRING'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_ROW_MENU', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'SENSE_COLUMN_MENU', block.ORDER_ATOMIC);
    const arg2 = Blockly.Arduino.valueToCode(this, 'SENSE_SHOW_STRING', block.ORDER_ATOMIC);
    return `LCD1602_PrintString_Sensor1(${arg0},${arg1},${arg2});\n`;
};
Blockly.Arduino['SENSE_LCD_PORT_SHOW_NUMBER'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_ROW_MENU', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'SENSE_COLUMN_MENU', block.ORDER_ATOMIC);
    const arg2 = Blockly.Arduino.valueToCode(this, 'SENSE_SHOW_NUMBER', block.ORDER_ATOMIC);
    return `LCD1602_PrintIntNum_Sensor1(${arg0},${arg1},${arg2});\n`;
};
Blockly.Arduino['SENSE_LCD_PORT_SHOW_FLOAT'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_ROW_MENU', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'SENSE_COLUMN_MENU', block.ORDER_ATOMIC);
    const arg2 = Blockly.Arduino.valueToCode(this, 'SENSE_SHOW_FLOAT', block.ORDER_ATOMIC);
    return `LCD1602_PrintFloatNum_Sensor1(${arg0},${arg1},${arg2});\n`;
};
Blockly.Arduino['SENSE_LCD_PORT_CLEAR_DATA'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return `LCD1602_Clear_Sensor1();\n`;
};


Blockly.Arduino['SENSE_OID_MODULE_INITIALIZE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return `OID_Init_Sensor1();\n`;
};

Blockly.Arduino['SENSE_OID_X_COORDINATES'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`OID_Data_Get_X_Value_Int()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_OID_Y_COORDINATES'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`OID_Data_Get_Y_Value_Int()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_OID_ANGLE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`OID_Data_Get_Roll_Value_Int()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_OID_CODE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`OID_Data_Get_Postion_Value_Int()`, block.ORDER_ATOMIC];
};
Blockly.Arduino['SENSE_OID_IS_UPLIFT'] = function(block) {
    Blockly.Arduino.includes_['include_sensor2'] = `#include "Sensor2.h"`;
    return [`OID_Check_Whether_Picked_up()`, block.ORDER_ATOMIC];
};