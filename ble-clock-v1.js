bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Fullstop), function () {
    if (Start == 0) {
        Start = input.runningTime()
        tick = Start
        BLE_Data = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Fullstop))
        Hour = BLE_Data.substr(0, 2)
        Minute = BLE_Data.substr(2, 2)
        Second = BLE_Data.substr(4, 2)
        LinearTime()
        zeroTime = lTime
    } else {
        newStart = input.runningTime()
        tick = newStart
        BLE_Data = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Fullstop))
        Hour = BLE_Data.substr(0, 2)
        Minute = BLE_Data.substr(2, 2)
        Second = BLE_Data.substr(4, 2)
        oldlTime = lTime
        LinearTime()
        numerator = lTime - oldlTime
        denominator = Math.trunc((newStart - Start) / 1000)
        coeff = (denominator + numerator) / denominator
        lTime = oldlTime
        showCoefficient()
    }
})
input.onButtonPressed(Button.B, function () {
    timeSignal = timeSignal * -1
    I2C_CMD(192, 1)
    if (timeSignal == 1) {
        I2CDATA(84)
    } else {
        I2CDATA(32)
    }
})
control.onEvent(EventBusSource.MICROBIT_ID_BUTTON_A, EventBusValue.MICROBIT_BUTTON_EVT_DOWN, function () {
    music.playTone(440, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Whole))
    music.rest(music.beat(BeatFraction.Quarter))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.playTone(440, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Whole))
    music.rest(music.beat(BeatFraction.Quarter))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.playTone(440, music.beat(BeatFraction.Half))
    music.rest(music.beat(BeatFraction.Whole))
    music.rest(music.beat(BeatFraction.Quarter))
    music.rest(music.beat(BeatFraction.Sixteenth))
    music.playTone(880, music.beat(BeatFraction.Double))
})
function showTime (Str: string) {
    temp_val = 0
    for (let i = 0; i < 2; i++) {
        Val = parseFloat(Str.charAt(temp_val))
        I2CDATA(Val + 48)
        temp_val += 1
    }
}
function I2C_CMD (Command: number, Time: number) {
    pins.i2cWriteNumber(
    AQM0802_Address,
    Command,
    NumberFormat.UInt16BE,
    false
    )
    basic.pause(Time)
}
function I2CDATA (Data: number) {
    pins.i2cWriteNumber(
    AQM0802_Address,
    Data + 16384,
    NumberFormat.UInt16BE,
    false
    )
}
function showCoefficient () {
    I2C_CMD(194, 1)
    I2CDATA(parseFloat(convertToText(coeff).charAt(0)) + 48)
    I2CDATA(46)
    I2CDATA(parseFloat(convertToText(coeff).charAt(2)) + 48)
    I2CDATA(parseFloat(convertToText(coeff).charAt(3)) + 48)
    I2CDATA(parseFloat(convertToText(coeff).charAt(4)) + 48)
}
function linearTostring () {
    Val = Math.trunc(zeroTime + (lTime - zeroTime) * coeff)
    Val = Val % 86400
    temp_val = Val % 60
    if (temp_val < 10) {
        Second = "0" + convertToText(temp_val)
    } else {
        Second = convertToText(temp_val)
    }
    temp_val = Val / 60
    temp_val = temp_val % 60
    if (temp_val < 10) {
        Minute = "0" + convertToText(temp_val)
    } else {
        Minute = convertToText(temp_val)
    }
    temp_val = Val / 3600
    if (temp_val < 10) {
        Hour = "0" + convertToText(temp_val)
    } else {
        Hour = convertToText(temp_val)
    }
}
function LinearTime () {
    lTime = parseFloat(Second)
    lTime = lTime + parseFloat(Minute) * 60
    lTime = lTime + parseFloat(Hour) * 3600
}
let Now = 0
let Val = 0
let temp_val = 0
let oldlTime = 0
let newStart = 0
let lTime = 0
let zeroTime = 0
let BLE_Data = ""
let coeff = 0
let timeSignal = 0
let denominator = 0
let numerator = 0
let tick = 0
let Start = 0
let Second = ""
let Minute = ""
let Hour = ""
let AQM0802_Address = 0
bluetooth.startUartService()
AQM0802_Address = 62
I2C_CMD(56, 1)
I2C_CMD(57, 1)
I2C_CMD(20, 1)
I2C_CMD(115, 1)
I2C_CMD(86, 1)
I2C_CMD(108, 300)
I2C_CMD(56, 1)
I2C_CMD(12, 1)
I2C_CMD(1, 2)
I2C_CMD(128, 1)
Hour = String.fromCharCode(48)
Minute = String.fromCharCode(48)
Second = String.fromCharCode(48)
Start = 0
tick = 0
numerator = 0
denominator = 1
timeSignal = -1
coeff = 1
basic.forever(function () {
    if (tick > 0) {
        Now = input.runningTime()
        if (Now - tick >= 1000) {
            tick = tick + 1000
            lTime += 1
            linearTostring()
            I2C_CMD(128, 1)
            showTime(Hour)
            I2CDATA(58)
            showTime(Minute)
            I2CDATA(58)
            showTime(Second)
            if (timeSignal == 1) {
                if (Second == "56") {
                    control.raiseEvent(
                    EventBusSource.MICROBIT_ID_BUTTON_A,
                    EventBusValue.MICROBIT_BUTTON_EVT_DOWN
                    )
                }
            }
        }
    }
})
