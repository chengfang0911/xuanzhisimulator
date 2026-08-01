
// Blockly.Blocks.robot_motor_menu = {
//     init: function () {
//         this.jsonInit({
//             message0: "%1",
//             args0: [{
//                 type: "field_dropdown",
//                 name: "MOTOR_MENU",
//                 options: [
//                     ['1', "1"],
//                     ['2', "2"],
//                     ['3', "3"],
//                     ['4', "4"],
//                 ]
//             }],
//             colour: Blockly.Colours.motion.primary,
//             colourSecondary: Blockly.Colours.motion.primary,
//             colourTertiary: Blockly.Colours.motion.primary,
//             output: 'List',
//         })
//     }
// };

Blockly.Blocks.robot_telecontrol_menu = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_dropdown",
                name: "TELECONTROL_MENU",
                options: [
                    ['1', "1"],
                    ['2', "2"],
                    ['3', "3"],
                    ['4', "4"],
                    ['5', "5"],
                    ['6', "6"],
                    ['7', "7"],
                    ['8', "8"],
                ]
            }],
            colour: Blockly.Colours.motion.primary,
            colourSecondary: Blockly.Colours.motion.primary,
            colourTertiary: Blockly.Colours.motion.primary,
            "extensions": ["colours_motion", "output_number"]
        })
    }
};

Blockly.Blocks.robot_motor_slider = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_slider", name: "NUM", value: "0", precision: 1, min: "-100", max: "100"
            }],
            output: "Number",
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.workspace
        })
    }
}

Blockly.Blocks.robot_motor_steering_slider = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_slider", name: "STEERING_NUM", value: "0", precision: 1, min: "0", max: "90"
            }],
            output: "Number",
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.workspace
        })
    }
}

Blockly.Blocks.serial_output_menu = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_dropdown",
                name: "SERIAL_MENU",
                options: [
                    [Blockly.Msg.ROBOT_STRING, "string"],
                    [Blockly.Msg.ROBOT_NUMBER, "number"],
                    [Blockly.Msg.ROBOT_FLOAT, "float"],
                ]
            }],
            colour: Blockly.Colours.motion.primary,
            colourSecondary: Blockly.Colours.motion.primary,
            colourTertiary: Blockly.Colours.motion.primary,
            output: 'String',
        })
    }
}

Blockly.Blocks.serial_output_isFeed = {
    init: function() {
        this.jsonInit({
            "message0": '%1',
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SERIAL_IS_FEED",
                    "options": [
                        [Blockly.Msg.ROBOT_WRAP, "1"],
                        [Blockly.Msg.ROBOT_NO_WRAP, "0"]
                    ],
                }
            ],
            colour: Blockly.Colours.motion.primary,
            colourSecondary: Blockly.Colours.motion.primary,
            colourTertiary: Blockly.Colours.motion.primary,
            output: 'String',
        });
    }
};
// 主控器以N速度 旋转
Blockly.Blocks['robot_motor'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.ROBOT_MOTOR,
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "MOTOR_MENU",
                    options: [
                        ['1', "1"],
                        ['2', "2"],
                        ['3', "3"],
                        ['4', "4"],
                    ]
                },
                {
                    type: "input_value", name: "NUM", value: "0", precision: 1, min: "-100", max: "100"
                }
            ],
            "category": Blockly.Categories.motion,
            "extensions": ["colours_motion", "shape_statement"]
        });
    }
};
// 读取遥控器通道
Blockly.Blocks['robot_remote_control'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.ROBOT_TELECONTROL,
            "args0": [
                {
                    "type": "input_value",
                    "name": "TELECONTROL_MENU"
                }
            ],
            "category": Blockly.Categories.motion,
            "extensions": ["colours_motion", "output_string"]
        });
    }
};

// 设置舵机
Blockly.Blocks['robot_steering_engine'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.ROBOT_STEERING_ENGINE,
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "STEERING_ENGINE_MENU",
                    options: [
                        ['1', "1"],
                        ['2', "2"],
                        ['3', "3"],
                        ['4', "4"],
                    ]
                },
                {
                    type: "input_value", name: "STEERING_NUM", value: "0", precision: 1, min: "0", max: "90"
                }
            ],
            "category": Blockly.Categories.motion,
            "extensions": ["colours_motion", "shape_statement"]
        });
    }
};

// x35j 主控
Blockly.Blocks.event_x35j_begin = {
    init: function () {
        this.jsonInit({
            id: "event_x35j_begin",
            message0: Blockly.Msg.EVENT_X35J_BEGIN,
            nextStatement: null,
            category: Blockly.Categories.event,
            colour: Blockly.Colours.motion.primary,
            colourSecondary: Blockly.Colours.motion.secondary,
            colourTertiary: Blockly.Colours.motion.tertiary
        })
    }
};
// m40d 主控
Blockly.Blocks.event_m40d_begin = {
    init: function () {
        this.jsonInit({
            id: "event_m40d_begin",
            message0: Blockly.Msg.EVENT_M40D_BEGIN,
            nextStatement: null,
            category: Blockly.Categories.event,
            colour: Blockly.Colours.motion.primary,
            colourSecondary: Blockly.Colours.motion.secondary,
            colourTertiary: Blockly.Colours.motion.tertiary
        })
    }
};
// 串口 字符串
Blockly.Blocks['robot_serial_port_string'] = {
    init: function() {
        this.jsonInit({
            id: 'robot_serial_port_string',
            "args0": [
                {
                    "type": "input_value",
                    "name": "SERIAL"
                },
                {
                    "type": "input_value",
                    "name": "SERIAL_IS_FEED"
                },
            ],
            "message0": Blockly.Msg.ROBOT_SERIAL_PORT_STRING,
            "category": Blockly.Categories.motion,
            "extensions": ["colours_motion", "shape_statement"]
        });
    }
};
// 串口 整数
Blockly.Blocks['robot_serial_port_int'] = {
    init: function() {
        this.jsonInit({
            id: 'robot_serial_port_int',
            "args0": [
                {
                    "type": "input_value",
                    "name": "SERIAL"
                },
                {
                    "type": "input_value",
                    "name": "SERIAL_IS_FEED"
                },
            ],
            "message0": Blockly.Msg.ROBOT_SERIAL_PORT_INT,
            "category": Blockly.Categories.motion,
            "extensions": ["colours_motion", "shape_statement"]
        });
    }
};
// 串口 浮点数
Blockly.Blocks['robot_serial_port_float'] = {
    init: function() {
        this.jsonInit({
            id: 'robot_serial_port_float',
            "args0": [
                {
                    "type": "input_value",
                    "name": "SERIAL"
                },
                {
                    "type": "input_value",
                    "name": "SERIAL_IS_FEED"
                },
            ],
            "message0": Blockly.Msg.ROBOT_SERIAL_PORT_FLOAT,
            "category": Blockly.Categories.motion,
            "extensions": ["colours_motion", "shape_statement"]
        });
    }
};



