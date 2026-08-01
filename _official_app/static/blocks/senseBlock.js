Blockly.Blocks.sense_LED_menu = {
    init: function() {
        this.jsonInit({
            "message0": '%1',
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "SENSE_ON_OFF",
                    "options": [
                        [Blockly.Msg.SENSE_ON, "1"],
                        [Blockly.Msg.SENSE_OFF, "0"]
                    ],
                }
            ],
            colour: Blockly.Colours.pen.primary,
            colourSecondary: Blockly.Colours.pen.primary,
            colourTertiary: Blockly.Colours.pen.primary,
            output: 'String',
        });
    }
};

Blockly.Blocks.sense_port_menu = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_dropdown",
                name: "SENSE_PORT_MENU",
                options: [
                    ['P0', "0"],
                    ['P1', "1"],
                    ['P2', "2"],
                    ['P3', "3"],
                    ['P4', "4"],
                    ['P5', "5"],
                    ['P6', "6"],
                    ['P7', "7"],
                ]
            }],
            colour: Blockly.Colours.pen.primary,
            colourSecondary: Blockly.Colours.pen.primary,
            colourTertiary: Blockly.Colours.pen.primary,
            extensions: ["colours_looks", "output_number"]
        })
    }
}

//  呼吸灯滑块ms
Blockly.Blocks.sense_breathe_led_slider = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_slider", name: "NUM", value: "0", precision: 1, min: "100", max: "6000"
            }],
            output: "Number",
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.valueReportBackground,
        })
    }
}

// 按钮被按下滑块ms
Blockly.Blocks.sense_button_down_slider = {
    init: function () {
        this.jsonInit({
            message0: "%1",
            args0: [{
                type: "field_slider", name: "NUM", value: "0", precision: 1, min: "10", max: "10000"
            }],
            output: "Number",
            outputShape: Blockly.OUTPUT_SHAPE_ROUND,
            colour: Blockly.Colours.valueReportBackground,
        })
    }
}

// LED开关
Blockly.Blocks['SENSE_LED'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_LED,
            "args0": [
                {
                    "type": "field_image",
                    "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
                    "width": 24,
                    "height": 24
                },
                {
                    type: "input_value",
                    name: "SENSE_ON_OFF"
                }
            ],
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "shape_statement"]
        });
    }
}

Blockly.Blocks['SENSE_BREATHE_LED'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_BREATHE_LED,
            "args0": [
                {
                    type: "input_value", name: "BREATHE_TIME", value: "0", precision: 1, min: "100", max: "6000"
                }
            ],
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "shape_statement"]
        });
    }
}

// 按钮被按下
Blockly.Blocks['SENSE_BUTTON_DOWN'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_BUTTON_DOWN,
            "args0": [
                {
                    type: "input_value", name: "BUTTON_DOWN",value: "0", precision: 1, min: "100", max: "6000"
                }
            ],
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_boolean"]
        });
    }
}

// 读取 LM35温度
Blockly.Blocks['SENSE_TEMPERATURE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_TEMPERATURE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 多圈旋转角度传感器
Blockly.Blocks['SENSE_ROTATION_ANGLE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_ROTATION_ANGLE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 压电陶瓷震动传感器
Blockly.Blocks['SENSE_CERAMIC_SHAKE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_CERAMIC_SHAKE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 人体红外热射电运动传感器
Blockly.Blocks['SENSE_HUMAN_BODY'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_HUMAN_BODY,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_boolean"]
        });
    }
}

// 读取 火焰传感器
Blockly.Blocks['SENSE_FLAME'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_FLAME,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 声音强度
Blockly.Blocks['SENSE_SOUND'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_SOUND,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 检测到磁铁？
Blockly.Blocks['SENSE_ELECTROMAGNETIC'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_ELECTROMAGNETIC,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_boolean"]
        });
    }
}

// 检测到触摸？
Blockly.Blocks['SENSE_TOUCH'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_TOUCH,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_boolean"]
        });
    }
}

// 检测到震动？
Blockly.Blocks['SENSE_SHAKE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_SHAKE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_boolean"]
        });
        // this.jsonInit({
        //     id: "vibration_detected",
        //     message0: Blockly.Msg.SENSE_SHAKE,
        //     nextStatement: null,
        //     category: Blockly.Categories.looks,
        //     colour: Blockly.Colours.looks.primary,
        //     colourSecondary: Blockly.Colours.looks.secondary,
        //     colourTertiary: Blockly.Colours.looks.tertiary
        // })
    }

}

// 读取 灰度值
Blockly.Blocks['SENSE_GRAY_VALUE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_GRAY_VALUE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 一氧化碳气体传感器
Blockly.Blocks['SENSE_CARBONIC_OXIDE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_CARBONIC_OXIDE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 电压值
Blockly.Blocks['SENSE_VOLTAGE'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_VOLTAGE,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 读取 土壤湿度传感器
Blockly.Blocks['SENSE_SOIL_HUMIDITY'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_SOIL_HUMIDITY,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 检测到倾斜？
Blockly.Blocks['SENSE_SLANT'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_SLANT,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_boolean"]
        });
    }
}

// 继电器开关
Blockly.Blocks['SENSE_RELAY'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_RELAY,
            "args0": [
                {
                    type: "input_value",
                    name: "SENSE_ON_OFF"
                }
            ],
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "shape_statement"]
        });
    }
}
// 模拟超声波传感器
Blockly.Blocks['SENSE_TWO_ULTRASONIC'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_TWO_ULTRASONIC,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}

// 超声波传感器
Blockly.Blocks['SENSE_ULTRASONIC'] = {
    init: function() {
        this.jsonInit({
            "message0": Blockly.Msg.SENSE_ULTRASONIC,
            "category": Blockly.Categories.pen,
            "extensions": ["colours_pen", "output_number"]
        });
    }
}


