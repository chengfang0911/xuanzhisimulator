goog.provide('Blockly.Arduino.sense');

goog.require('Blockly.Arduino');

Blockly.Arduino['sense_LED_menu'] = function(block) {
    const code = block.getFieldValue('SENSE_ON_OFF');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['sense_port_menu'] = function(block) {
    const code = block.getFieldValue('SENSE_PORT_MENU');
    return [code, block.ORDER_ATOMIC];
};
// 滑块 led
Blockly.Arduino['sense_breathe_led_slider'] = function(block) {
    const code = block.getFieldValue('NUM');
    return [code, block.ORDER_ATOMIC];
};
// 滑块 数字
Blockly.Arduino['sense_button_down_slider'] = function(block) {
    const code = block.getFieldValue('NUM');
    return [code, block.ORDER_ATOMIC];
};

// LED开关
Blockly.Arduino['SENSE_LED'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_ON_OFF', block.ORDER_ATOMIC);
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    // Blockly.Arduino.definitions_['definitions_servo' + arg1] = 'Servo servo_' + arg1 + ';';
    Blockly.Arduino.setups_['LED'] = 'HAL_GPIO_Init_LED_Sensor2();';
    if (arg0 === '1')return "LED_Open_Sensor2();\n";
    else return "LED_Close_Sensor2();\n";
};
// LED开关
Blockly.Arduino['SENSE_BREATHE_LED'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'BREATHE_TIME', block.ORDER_ATOMIC);
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['LED'] = 'HAL_GPIO_Init_LED_Sensor2();';
    return `LED_Breath_Sensor2(${arg0});\n`;
};
// 按钮被按下
Blockly.Arduino['SENSE_BUTTON_DOWN'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'BUTTON_DOWN', block.ORDER_ATOMIC);
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['BUTTON_DOWN'] = 'HAL_GPIO_Init_Digital_Push_Button_Sensor2();';
    return [`Digital_Push_Button_Press_Sensor2_Int(${arg0})`, block.ORDER_ATOMIC];
};
// 读取 LM35温度
Blockly.Arduino['SENSE_TEMPERATURE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['TEMPERATURE'] = 'HAL_ADC_MspInit_LM35_Temperature_Sensor2();';
    return [`Temperature_Read_LM35_Temperature_Sensor2_Float()`, block.ORDER_ATOMIC];
};
// 读取 多圈旋转角度传感器
Blockly.Arduino['SENSE_ROTATION_ANGLE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['ROTATION_ANGLE'] = 'HAL_ADC_MspInit_Rotation_Sensor2();';
    return [`Rotation_Read_Rotation_Sensor2_Float()`, block.ORDER_ATOMIC];
};
// 读取 压电陶瓷震动传感器
Blockly.Arduino['SENSE_CERAMIC_SHAKE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['CERAMIC_SHAKE'] = 'HAL_ADC_MspInit_PiezoDiskVibration_Sensor2();';
    return [`PiezoDiskVibration_ReadADC_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 读取 人体红外热射电运动传感器
Blockly.Arduino['SENSE_HUMAN_BODY'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['HUMAN_BODY'] = 'HAL_GPIO_Init_PIR_MOTION_Sensor2();';
    return [`PIR_MOTION_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 读取 火焰传感器
Blockly.Arduino['SENSE_FLAME'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['FLAME'] = 'HAL_ADC_MspInit_Flame_Sensor2();';
    return [`Flame_ReadADC_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 读取 声音强度
Blockly.Arduino['SENSE_SOUND'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['SOUND'] = 'HAL_ADC_MspInit_Analog_Sound_Sensor2();';
    return [`Analog_Sound_ReadADC_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 检测到磁铁？
Blockly.Arduino['SENSE_ELECTROMAGNETIC'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['ELECTROMAGNETIC'] = 'HAL_ADC_Magnetic_Sensor2();';
    return [`Magnetic_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 检测到触摸？
Blockly.Arduino['SENSE_TOUCH'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['TOUCH'] = 'HAL_GPIO_Init_Touch_Sensor2();';
    return [`Touch_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 检测到震动？
Blockly.Arduino['SENSE_SHAKE'] = function(block) {
    // let methodCode = `void sense()`
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    // Blockly.Arduino.includes_['SHAKE'] = `${methodCode};  \n`
    Blockly.Arduino.setups_['SHAKE'] = 'HAL_GPIO_Digital_Vibration_Sensor2();';
    // let code = `${methodCode} {\n`;
    // code = Blockly.Arduino.scrub_(block, code);
    // code += '}\n';
    // console.log(code)
    // Blockly.Arduino.customFunctions_['SHAKE'] = code;
    // return null
    // return `Digital_Vibration_Sensor2_Int();\n`
    return [`Digital_Vibration_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 读取 灰度值
Blockly.Arduino['SENSE_GRAY_VALUE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['GRAYVALUE'] = 'HAL_ADC_MspInit_Analog_Grayscale_Sensor2();';
    return [`Analog_Grayscale_ReadADC_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 读取 一氧化碳气体传感器
Blockly.Arduino['SENSE_CARBONIC_OXIDE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['CARBONIC_OXIDE'] = 'HAL_ADC_MspInit_AnalogGas_Sensor2();';
    return [`Gas_ReadADC_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 读取 电压值
Blockly.Arduino['SENSE_VOLTAGE'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['VOLTAGE'] = 'HAL_ADC_MspInit_AnalogVoltage_Sensor2();';
    return [`Voltage_Read_AnalogVoltage_Sensor2_Float()`, block.ORDER_ATOMIC];
};
// 读取 土壤湿度传感器
Blockly.Arduino['SENSE_SOIL_HUMIDITY'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['SOIL_HUMIDITY'] = 'HAL_ADC_MspInit_AnalogMoisture_Sensor2();';
    return [`AnalogMoisture_ReadADC_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 检测到倾斜？
Blockly.Arduino['SENSE_SLANT'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['SLANT'] = 'HAL_GPIO_Digital_Tilt_Sensor2();';
    return [`Digital_Tilt_Sensor2_Int()`, block.ORDER_ATOMIC];
};
// 继电器开关
Blockly.Arduino['SENSE_RELAY'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'SENSE_ON_OFF', block.ORDER_ATOMIC);
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['RELAY'] = 'HAL_GPIO_Init_DigitalRelayModulue_Sensor2();';
    if (arg0 === '1')return "DigitalRelayModulue_NOConnect_Sensor2();\n";
    else return "DigitalRelayModulue_NODisConnect_Sensor2();\n";
};
// 模拟超声波传感器
Blockly.Arduino['SENSE_TWO_ULTRASONIC'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['ULTRASONIC'] = 'HAL_ADC_MspInit_AnalogURM09_Ultrasonic_Sensor2();';
    return [`Analog_URM09_Ultrasonic_Distance_Sensor2_Float()`, block.ORDER_ATOMIC];
};

// 超声波传感器
Blockly.Arduino['SENSE_ULTRASONIC'] = function(block) {
    Blockly.Arduino.includes_['include_sensor1'] = `#include "Sensor1.h"`;
    Blockly.Arduino.setups_['ULTRASONIC'] = 'HAL_ADC_MspInit_AnalogXZ0002_Ultrasonic_Sensor2();';
    return [`Analog_XZ0002_Ultrasonic_Distance_Sensor2_Float()`, block.ORDER_ATOMIC];
};

