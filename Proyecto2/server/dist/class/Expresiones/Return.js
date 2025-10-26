"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const exp_1 = require("../abs/exp");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class Return extends exp_1.Exp {
    constructor(linea, columna, expresion) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.RETURN);
        this.expresion = expresion;
    }
    play(entorno) {
        // validación para la expresión de retorno
        if (this.expresion) {
            const valor = this.expresion.play(entorno);
            return { value: valor.value, tip: valor.tip };
        }
        return { value: this.ExpresionType, tip: Tip_1.Tip.NULO };
    }
}
exports.Return = Return;
