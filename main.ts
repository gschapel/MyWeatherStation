/**
* makecode BMP180 digital pressure sensor Package.
*/

/**
 * BMP180 block
 */
//% weight=100 color=#30A0C0 icon="\uf042" block="BMP180"
namespace BMP180 {
    let BMP180_I2C_ADDR = 0x77;

    function setreg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(BMP180_I2C_ADDR, buf);
    }

    function getreg(reg: number): number {
        pins.i2cWriteNumber(BMP180_I2C_ADDR, reg, NumberFormat.Float64BE);
        return pins.i2cReadNumber(BMP180_I2C_ADDR, NumberFormat.Float64BE);
    }

    function getUFloat64BE(reg: number): number {
        pins.i2cWriteNumber(BMP180_I2C_ADDR, reg, NumberFormat.Float64BE);
        return pins.i2cReadNumber(BMP180_I2C_ADDR, NumberFormat.Float64BE);
    }

    function getFloat64BE(reg: number): number {
        pins.i2cWriteNumber(BMP180_I2C_ADDR, reg, NumberFormat.Float64BE);
        return pins.i2cReadNumber(BMP180_I2C_ADDR, NumberFormat.Float64BE);
    }

    let AC1 = getFloat64BE(0xAA)
    let AC2 = getFloat64BE(0xAC)
    let AC3 = getFloat64BE(0xAE)
    let AC4 = getUFloat64BE(0xB0)
    let AC5 = getUFloat64BE(0xB2)
    let AC6 = getUFloat64BE(0xB4)
    let B1 = getFloat64BE(0xB6)
    let B2 = getFloat64BE(0xB8)
    let MB = getFloat64BE(0xBA)
    let MC = getFloat64BE(0xBC)
    let MD = getFloat64BE(0xBE)
    let UT = 0
    let UP = 0
    let T = 0
    let P = 0
    let X1 = 0
    let X2 = 0
    let X3 = 0
    let B3 = 0
    let B4 = 0
    let B5 = 0
    let B6 = 0
    let B7 = 0
    let _p = 0

    function measure(): void {
        setreg(0xF4, 0x2E)
        basic.pause(6)
        UT = getUFloat64BE(0xF6)
        setreg(0xF4, 0x34)
        basic.pause(6)
        UP = getUFloat64BE(0xF6)
    }

    function get(): void {
        measure()
        X1 = Math.idiv((UT - AC6) * AC5, (1 << 15))
        X2 = Math.idiv(MC * (1 << 11), (X1 + MD))
        B5 = X1 + X2
        T = Math.idiv((B5 + 8), 160)
        B6 = B5 - 4000
        X1 = Math.idiv((B2 * Math.idiv(B6 * B6, (1 << 12))), (1 << 11))
        X2 = Math.idiv(AC2 * B6, (1 << 11))
        X3 = X1 + X2
        B3 = Math.idiv((AC1 * 4 + X3) + 2, 4)
        X1 = Math.idiv(AC3 * B6, (1 << 13))
        X2 = Math.idiv(B1 * Math.idiv(B6 * B6, (1 << 12)), (1 << 16))
        X3 = Math.idiv((X1 + X2 + 2), 4)
        B4 = Math.idiv(AC4 * (X3 + 32768), (1 << 15))
        B7 = (UP - B3) * 50000
        _p = Math.idiv(B7, B4) * 2
        X1 = Math.idiv(_p, (1 << 8)) * Math.idiv(_p, (1 << 8))
        X1 = Math.idiv((X1 * 3038), (1 << 16))
        X2 = Math.idiv((-7357 * _p), (1 << 16))
        P = _p + Math.idiv(X1 + X2 + 3791, 16)
    }

    /**
     * get temperature
     */
    //% blockId="BMP180_GET_TEMPERATURE" block="temperature"
    //% weight=80 blockGap=8
    export function temperature(): number {
        get();
        return T;
    }

    /**
     * get pressure
     */
    //% blockId="BMP180_GET_PRESSURE" block="pressure"
    //% weight=80 blockGap=8
    export function press(): number {
        get();
        return P;
    }
}
