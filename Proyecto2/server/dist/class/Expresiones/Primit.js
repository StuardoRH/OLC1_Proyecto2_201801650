"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Primit = void 0;
const exp_1 = require("../abs/exp");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class Primit extends exp_1.Exp {
    constructor(linea, columna, value, tipo) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.PRIMITIVO);
        this.value = value;
        this.tipo = tipo;
    }
    play(_) {
        switch (this.tipo) {
            case Tip_1.Tip.ENTERO:
                return { value: parseInt(this.value), tip: this.tipo };
            case Tip_1.Tip.DECIMAL:
                return { value: parseFloat(this.value), tip: this.tipo };
            case Tip_1.Tip.BOOLEANO:
                return { value: this.value.toString() === 'verdadero', tip: this.tipo };
            case Tip_1.Tip.CARACTER:
                return { value: this.value.toString(), tip: this.tipo };
            case Tip_1.Tip.CADENA:
                return { value: this.value.toString(), tip: this.tipo };
            default:
                return { value: this.value, tip: this.tipo };
        }
    }
}
exports.Primit = Primit;
