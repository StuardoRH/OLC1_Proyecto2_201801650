"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arit = void 0;
//Arit
const exp_1 = require("../abs/exp");
const expresionsTypes_1 = require("../util/expresionsTypes");
const Tip_1 = require("../util/Tip");
const OpAritmeticas_1 = require("../util/OpAritmeticas");
const OpAritmeticas_2 = require("../util/OpAritmeticas");
const OpAritmeticas_3 = require("../util/OpAritmeticas");
const OpAritmeticas_4 = require("../util/OpAritmeticas");
const OpAritmeticas_5 = require("../util/OpAritmeticas");
const OpAritmeticas_6 = require("../util/OpAritmeticas");
class Arit extends exp_1.Exp {
    constructor(linea, columna, exp1, signo, exp2) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.ARITMETICO);
        this.exp1 = exp1;
        this.signo = signo;
        this.exp2 = exp2;
        this.Tip = Tip_1.Tip.NULO;
    }
    play(enviroment) {
        //console.log(this.signo);
        switch (this.signo) {
            case '+':
                return this.sum(enviroment);
            case '-':
                if (this.exp1 !== undefined) {
                    return this.resta(enviroment);
                }
                return this.negacionUnaria(enviroment);
            case '*':
                return this.multiplicacion(enviroment);
            case '/':
                return this.division(enviroment);
            case '^':
                return this.pot(enviroment);
            case '%':
                return this.mod(enviroment);
            default:
                throw new Error(`Operador logico no reconocido: ${this.signo}`);
        }
    }
    sum(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = OpAritmeticas_1.suma[left.tip][right.tip];
        console.log(this.Tip);
        console.log(left.tip, right.tip, this.Tip);
        if (this.Tip !== Tip_1.Tip.NULO) {
            if (this.Tip === Tip_1.Tip.ENTERO) {
                if (typeof (left.tip) === 'string') {
                    left.value = left.value.charCodeAt(0);
                }
                if (typeof (right.tip) === 'string') {
                    right.value = right.value.charCodeAt(0);
                }
                if (left.tip === Tip_1.Tip.CARACTER) {
                    left.value = left.value.charCodeAt(0);
                }
                if (right.tip === Tip_1.Tip.CARACTER) {
                    right.value = right.value.charCodeAt(0);
                }
                return { value: left.value + right.value, tip: this.Tip };
            }
            if (this.Tip === Tip_1.Tip.DECIMAL) {
                return { value: left.value + right.value, tip: this.Tip };
            }
            if (this.Tip === Tip_1.Tip.CADENA) {
                return { value: left.value.toString() + right.value.toString(), tip: this.Tip };
            }
        }
        throw new Error(`Error de tipos en la suma: ${this.Tip}`);
    }
    resta(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = OpAritmeticas_2.resta[left.tip][right.tip];
        if (this.Tip !== Tip_1.Tip.NULO) {
            if (this.Tip === Tip_1.Tip.ENTERO) {
                return { value: left.value - right.value, tip: this.Tip };
            }
            if (this.Tip === Tip_1.Tip.DECIMAL) {
                return { value: left.value - right.value, tip: this.Tip };
            }
        }
        throw new Error(`Error de tipos en la resta: ${this.Tip}`);
    }
    multiplicacion(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = OpAritmeticas_3.multiplicacion[left.tip][right.tip];
        if (this.Tip !== Tip_1.Tip.NULO) {
            if (this.Tip === Tip_1.Tip.ENTERO) {
                return { value: left.value * right.value, tip: this.Tip };
            }
            if (this.Tip === Tip_1.Tip.DECIMAL) {
                return { value: left.value * right.value, tip: this.Tip };
            }
        }
        throw new Error(`Error de tipos en la multiplicacion: ${this.Tip}`);
    }
    division(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = OpAritmeticas_4.division[left.tip][right.tip];
        if (this.Tip !== Tip_1.Tip.NULO) {
            if (this.Tip === Tip_1.Tip.DECIMAL) {
                return { value: left.value / right.value, tip: this.Tip };
            }
        }
        throw new Error(`Error de tipos en la division: ${this.Tip}`);
    }
    pot(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = OpAritmeticas_5.potencia[left.tip][right.tip];
        if (this.Tip !== Tip_1.Tip.NULO) {
            if (this.Tip === Tip_1.Tip.ENTERO) {
                return { value: Math.pow(left.value, right.value), tip: this.Tip };
            }
            if (this.Tip === Tip_1.Tip.DECIMAL) {
                return { value: Math.pow(left.value, right.value), tip: this.Tip };
            }
        }
        throw new Error(`Error de tipos en la potencia: ${this.Tip}`);
    }
    mod(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = OpAritmeticas_6.modulo[left.tip][right.tip];
        if (this.Tip !== Tip_1.Tip.NULO) {
            if (this.Tip === Tip_1.Tip.DECIMAL) {
                return { value: left.value % right.value, tip: this.Tip };
            }
        }
        throw new Error(`Error de tipos en el modulo: ${this.Tip}`);
    }
    negacionUnaria(enviroment) {
        let left = this.exp2.play(enviroment);
        this.Tip = left.tip;
        if (this.Tip === Tip_1.Tip.ENTERO || this.Tip === Tip_1.Tip.DECIMAL) {
            return { value: -left.value, tip: this.Tip };
        }
        return { value: 'NULL', tip: Tip_1.Tip.NULO };
    }
}
exports.Arit = Arit;
