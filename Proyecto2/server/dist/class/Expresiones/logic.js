"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logic = void 0;
const exp_1 = require("../abs/exp");
const expresionsTypes_1 = require("../util/expresionsTypes");
const Tip_1 = require("../util/Tip");
class logic extends exp_1.Exp {
    constructor(linea, columna, exp1, signo, exp2) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.LOGICO);
        this.exp1 = exp1;
        this.signo = signo;
        this.exp2 = exp2;
        this.Tip = Tip_1.Tip.NULO;
    }
    play(enviroment) {
        //console.log(this.signo);
        switch (this.signo) {
            case '&&':
                return this.and(enviroment);
            case '||':
                return this.or(enviroment);
            case '!':
                return this.not(enviroment);
            default:
                throw new Error(`Operador logico no reconocido: ${this.signo}`);
        }
    }
    and(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        console.log(left.value, right.value);
        return { value: left.value && right.value, tip: this.Tip };
    }
    or(enviroment) {
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        return { value: left.value || right.value, tip: this.Tip };
    }
    not(enviroment) {
        let left = this.exp2.play(enviroment);
        this.Tip = Tip_1.Tip.BOOLEANO;
        //console.log(left.value);
        return { value: !left.value, tip: this.Tip };
    }
}
exports.logic = logic;
