goog.provide('Blockly.Arduino.robot');

goog.require('Blockly.Arduino');


// Blockly.Arduino['robot_motor_menu'] = function(block) {
//     const code = block.getFieldValue('MOTOR_MENU');
//     return [code, block.ORDER_ATOMIC];
// };

Blockly.Arduino['robot_motor_slider'] = function(block) {
    const code = block.getFieldValue('NUM');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['robot_motor_steering_slider'] = function(block) {
    const code = block.getFieldValue('STEERING_NUM');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['serial_output_menu'] = function(block) {
    const code = block.getFieldValue('SERIAL_MENU');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['serial_output_isFeed'] = function(block) {
    const code = block.getFieldValue('SERIAL_IS_FEED');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['robot_telecontrol_menu'] = function(block) {
    const code = block.getFieldValue('TELECONTROL_MENU');
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['robot_motor'] = function(block) {
    const arg0 = block.getFieldValue('MOTOR_MENU');
    const arg1 = Blockly.Arduino.valueToCode(this, 'NUM', block.ORDER_ATOMIC);
    if (arg1 < -100 || arg1 > 100){
        alert('可选范围在-100~100之间')
    }
    return "xChannal_Motor_nSpeed_Run(" + arg0 + ", " + arg1 + ");\n";
};

Blockly.Arduino['robot_steering_engine'] = function(block) {
    const arg0 = block.getFieldValue('STEERING_ENGINE_MENU');
    const arg1 = Blockly.Arduino.valueToCode(this, 'STEERING_NUM', block.ORDER_ATOMIC);
    return "xChannal_SteeringEngine_RunTo_nAngle(" + arg0 + ", " + arg1 + ");\n";
};

Blockly.Arduino['robot_remote_control'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'TELECONTROL_MENU', block.ORDER_ATOMIC);
    const code = `Read_xChannal_Value(${arg0})`;
    return [code, block.ORDER_ATOMIC];
};

Blockly.Arduino['robot_serial_port_string'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'SERIAL', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'SERIAL_IS_FEED', block.ORDER_ATOMIC);
    const type = `%s${arg1 === '1' ? '\\n' : ''}`
    // const type = arg1 === 'string' ? `%s${arg0 === '1' ? '\\n' : ''}` : arg1 === 'number' ? `%d${arg0 === '1' ? '\\n' : ''}` : `%f${arg0 === '1' ? '\\n' : ''}`
    return `printf("${type}",${arg0});\n`;
};

Blockly.Arduino['robot_serial_port_int'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'SERIAL', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'SERIAL_IS_FEED', block.ORDER_ATOMIC);
    const type = `%d${arg1 === '1' ? '\\n' : ''}`
    return `printf("${type}",${arg0});\n`;
};

Blockly.Arduino['robot_serial_port_float'] = function(block) {
    const arg0 = Blockly.Arduino.valueToCode(this, 'SERIAL', block.ORDER_ATOMIC);
    const arg1 = Blockly.Arduino.valueToCode(this, 'SERIAL_IS_FEED', block.ORDER_ATOMIC);
    const type = `%f${arg1 === '1' ? '\\n' : ''}`
    return `printf("${type}",${arg0});\n`;
};

