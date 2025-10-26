"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rel = void 0;
const exp_1 = require("../abs/exp");
const expresionsTypes_1 = require("../util/expresionsTypes");
const Tip_1 = require("../util/Tip");
class Rel extends exp_1.Exp {
    constructor(linea, columna, exp1, signo, exp2) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.RELACIONAL);
        this.exp1 = exp1;
        this.signo = signo;
        this.exp2 = exp2;
        this.Tip = Tip_1.Tip.NULO;
    }
    play(enviroment) {
        //console.log(this.signo);
        switch (this.signo) {
            case '==':
                return this.igual(enviroment);
            case '!=':
                return this.dif(enviroment);
            case '>=':
                return this.MayIgual(enviroment);
            case '<=':
                return this.MenIgual(enviroment);
            case '<':
                return this.Men(enviroment);
            case '>':
                return this.May(enviroment);
            default:
                throw new Error(`Operador logico no reconocido: ${this.signo}`);
        }
    }
    igual(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        if (left.tip === Tip_1.Tip.ENTERO || left.tip === Tip_1.Tip.DECIMAL || left.tip === Tip_1.Tip.CARACTER) {
            if (right.tip === Tip_1.Tip.ENTERO || right.tip === Tip_1.Tip.DECIMAL || right.tip === Tip_1.Tip.CARACTER) {
                return { value: left.value === right.value, tip: this.Tip };
            }
        }
        if (left.tip === Tip_1.Tip.CADENA && right.tip === Tip_1.Tip.CADENA) {
            return { value: left.value.toString() === right.value.toString(), tip: this.Tip };
        }
        return { value: "NULL", tip: Tip_1.Tip.NULO };
    }
    dif(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        if (left.tip === Tip_1.Tip.ENTERO || left.tip === Tip_1.Tip.DECIMAL || left.tip === Tip_1.Tip.CARACTER) {
            if (right.tip === Tip_1.Tip.ENTERO || right.tip === Tip_1.Tip.DECIMAL || right.tip === Tip_1.Tip.CARACTER) {
                return { value: left.value !== right.value, tip: this.Tip };
            }
        }
        if (left.tip === Tip_1.Tip.CADENA && right.tip === Tip_1.Tip.CADENA) {
            return { value: left.value.toString() !== right.value.toString(), tip: this.Tip };
        }
        return { value: "NULL", tip: Tip_1.Tip.NULO };
    }
    MayIgual(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        if (left.tip === Tip_1.Tip.ENTERO || left.tip === Tip_1.Tip.DECIMAL || left.tip === Tip_1.Tip.CARACTER) {
            if (right.tip === Tip_1.Tip.ENTERO || right.tip === Tip_1.Tip.DECIMAL || right.tip === Tip_1.Tip.CARACTER) {
                return { value: left.value >= right.value, tip: this.Tip };
            }
        }
        return { value: "NULL", tip: Tip_1.Tip.NULO };
    }
    MenIgual(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        if (left.tip === Tip_1.Tip.ENTERO || left.tip === Tip_1.Tip.DECIMAL || left.tip === Tip_1.Tip.CARACTER) {
            if (right.tip === Tip_1.Tip.ENTERO || right.tip === Tip_1.Tip.DECIMAL || right.tip === Tip_1.Tip.CARACTER) {
                return { value: left.value <= right.value, tip: this.Tip };
            }
        }
        return { value: "NULL", tip: Tip_1.Tip.NULO };
    }
    Men(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        if (left.tip === Tip_1.Tip.ENTERO || left.tip === Tip_1.Tip.DECIMAL || left.tip === Tip_1.Tip.CARACTER) {
            if (right.tip === Tip_1.Tip.ENTERO || right.tip === Tip_1.Tip.DECIMAL || right.tip === Tip_1.Tip.CARACTER) {
                return { value: left.value < right.value, tip: this.Tip };
            }
        }
        return { value: "NULL", tip: Tip_1.Tip.NULO };
    }
    May(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        if (left.tip === Tip_1.Tip.ENTERO || left.tip === Tip_1.Tip.DECIMAL || left.tip === Tip_1.Tip.CARACTER) {
            if (right.tip === Tip_1.Tip.ENTERO || right.tip === Tip_1.Tip.DECIMAL || right.tip === Tip_1.Tip.CARACTER) {
                return { value: left.value > right.value, tip: this.Tip };
            }
        }
        return { value: "NULL", tip: Tip_1.Tip.NULO };
    }
}
exports.Rel = Rel;
