// BMI160初始化 列表
Blockly.Blocks.sense_inertia_motion_initialize_menu = {
    init: function() {
        this.jsonInit({
            "message0": '%1',
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSE_INERTIA_MOTION_MENU",
                    "options": [
                        ["0x69", "0x69"],
                        ["0x68", "0x68"]
                    ],
                }
            ],
            colour: Blockly.Colours.event.primary,
            colourSecondary: Blockly.Colours.event.primary,
            colourTertiary: Blockly.Colours.event.primary,
            output: 'String',
        });
    }
};
// BMM150初始化 列表
Blockly.Blocks.sense_xyz_geomagnetism_initialize_menu = {
    init: function() {
        this.jsonInit({
            "message0": '%1',
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSE_XYZ_GEOMAGNETISM_MENU",
                    "options": [
                        ["0x10", "0x10"],
                        ["0x11", "0x11"],
                        ["0x12", "0x12"],
                        ["0x13", "0x13"]
                    ],
                }
            ],
            colour: Blockly.Colours.event.primary,
            colourSecondary: Blockly.Colours.event.primary,
            colourTertiary: Blockly.Colours.event.primary,
            output: 'String',
        });
    }
}
// 颜色亮度滑块
Blockly.Blocks.sense_color_luminance_slider = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_slider", name: "COLOR_LUMINANCE", value: "0", precision: 1, min: "0", max: "255"
            }],
            output: "Number",
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.valueReportBackground,
        })
    }
}

// 显示行
Blockly.Blocks.sense_row_menu = {
    init: function() {
        this.jsonInit({
            "message0": '%1',
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSE_ROW_MENU",
                    "options": [
                        ["1", "1"],
                        ["2", "2"]
                    ],
                }
            ],
            colour: Blockly.Colours.event.primary,
            colourSecondary: Blockly.Colours.event.primary,
            colourTertiary: Blockly.Colours.event.primary,
            output: 'String',
        });
    }
}

// 显示列
Blockly.Blocks.sense_column_menu = {
    init: function() {
        this.jsonInit({
            "message0": '%1',
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSE_COLUMN_MENU",
                    "options": [
                        ["1", "1"],
                        ["2", "2"],
                        ["3", "3"],
                        ["4", "4"],
                        ["5", "5"],
                        ["6", "6"],
                        ["7", "7"],
                        ["8", "8"],
                        ["9", "9"],
                        ["10", "10"],
                        ["11", "11"],
                        ["12", "12"],
                        ["13", "13"],
                        ["14", "14"],
                        ["15", "15"],
                        ["16", "16"],
                    ],
                }
            ],
            colour: Blockly.Colours.event.primary,
            colourSecondary: Blockly.Colours.event.primary,
            colourTertiary: Blockly.Colours.event.primary,
            output: 'String',
        });
    }
}

// BMI160初始化
Blockly.Blocks['SENSE_INERTIA_MOTION_INITIALIZE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_INERTIA_MOTION_INITIALIZE,
            "args0": [
                {
                    type: "input_value",
                    name: "SENSE_INERTIA_MOTION_MENU"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// BMM150初始化
Blockly.Blocks['SENSE_XYZ_GEOMAGNETISM_INITIALIZE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_XYZ_GEOMAGNETISM_INITIALIZE,
            "args0": [
                {
                    type: "input_value",
                    name: "SENSE_XYZ_GEOMAGNETISM_MENU"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// LCD1602初始化
Blockly.Blocks['SENSE_COLOURS_LCD_INITIALIZE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_COLOURS_LCD_INITIALIZE,
            "args0": [
                {
                    type: "input_value", name: "COLOR_R", value: "0", precision: 1, min: "0", max: "255"
                },
                {
                    type: "input_value", name: "COLOR_G", value: "0", precision: 1, min: "0", max: "255"
                },
                {
                    type: "input_value", name: "COLOR_B", value: "0", precision: 1, min: "0", max: "255"
                },
                {
                    type: "input_value", name: "LUMINANCE", value: "0", precision: 1, min: "0", max: "255"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// LCD1602 IIC初始化
Blockly.Blocks['SENSE_COLOURS_IIC_INITIALIZE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_COLOURS_LCD_INITIALIZE,
            "args0": [
                {
                    type: "input_value", name: "COLOR_IIC_R", value: "0", precision: 1, min: "0", max: "255"
                },
                {
                    type: "input_value", name: "COLOR_IIC_G", value: "0", precision: 1, min: "0", max: "255"
                },
                {
                    type: "input_value", name: "COLOR_IIC_B", value: "0", precision: 1, min: "0", max: "255"
                },
                {
                    type: "input_value", name: "LUMINANCE_IIC", value: "0", precision: 1, min: "0", max: "255"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// 地面识别模块初始化
Blockly.Blocks['SENSE_OID_MODULE_INITIALIZE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_OID_MODULE_INITIALIZE,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// BMI160获取x轴加速度值（g）
Blockly.Blocks['SENSE_X_ACCELERATED_SPEED'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_X_ACCELERATED_SPEED,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// BMI160获取y轴加速度值（g）
Blockly.Blocks['SENSE_Y_ACCELERATED_SPEED'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_Y_ACCELERATED_SPEED,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// BMI160获取z轴加速度值（g）
Blockly.Blocks['SENSE_Z_ACCELERATED_SPEED'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_Z_ACCELERATED_SPEED,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// BMI160获取x轴角速度（dps）
Blockly.Blocks['SENSE_X_AXIAL_ANGLE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_X_AXIAL_ANGLE,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// BMI160获取y轴加速度值（g）
Blockly.Blocks['SENSE_Y_AXIAL_ANGLE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_Y_AXIAL_ANGLE,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// BMI160获取z轴加速度值（g）
Blockly.Blocks['SENSE_Z_AXIAL_ANGLE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_Z_AXIAL_ANGLE,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// 获取地磁偏角(°)
Blockly.Blocks['SENSE_GEOMAGNETISM_DEFLECTION'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_GEOMAGNETISM_DEFLECTION,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// LCD显示字符串
Blockly.Blocks['SENSE_LCD_PORT_SHOW_STRING'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_LCD_PORT_SHOW_STRING,
            "args0": [
                {
                    type: "input_value",
                    name: "SENSE_ROW_MENU"
                },
                {
                    type: "input_value",
                    name: "SENSE_COLUMN_MENU"
                },
                {
                    type: "input_value",
                    name: "SENSE_SHOW_STRING"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// LCD显示整数
Blockly.Blocks['SENSE_LCD_PORT_SHOW_NUMBER'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_LCD_PORT_SHOW_NUMBER,
            "args0": [
                {
                    type: "input_value",
                    name: "SENSE_ROW_MENU"
                },
                {
                    type: "input_value",
                    name: "SENSE_COLUMN_MENU"
                },
                {
                    type: "input_value",
                    name: "SENSE_SHOW_NUMBER"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// LCD显示浮点数
Blockly.Blocks['SENSE_LCD_PORT_SHOW_FLOAT'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_LCD_PORT_SHOW_FLOAT,
            "args0": [
                {
                    type: "input_value",
                    name: "SENSE_ROW_MENU"
                },
                {
                    type: "input_value",
                    name: "SENSE_COLUMN_MENU"
                },
                {
                    type: "input_value",
                    name: "SENSE_SHOW_FLOAT"
                }
            ],
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// LCD清空显示屏
Blockly.Blocks['SENSE_LCD_PORT_CLEAR_DATA'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_LCD_PORT_CLEAR_DATA,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "shape_statement"]
        });
    }
}

// 读取当前位置x轴坐标
Blockly.Blocks['SENSE_OID_X_COORDINATES'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_OID_GET_X_COORDINATES,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// 读取当前位置y轴坐标
Blockly.Blocks['SENSE_OID_Y_COORDINATES'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_OID_GET_Y_COORDINATES,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// 读取当前位置对应角度数值
Blockly.Blocks['SENSE_OID_ANGLE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_OID_GET_ANGLE,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// 读取当前位置对应角度数值
Blockly.Blocks['SENSE_OID_CODE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_OID_GET_CODE,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_number"]
        });
    }
}

// 检测到地面识别模块抬起?
Blockly.Blocks['SENSE_OID_IS_UPLIFT'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_OID_GET_IS_UPLIFT,
            "category": Blockly.Categories.event,
            "extensions": ["colours_event", "output_boolean"]
        });
    }
}