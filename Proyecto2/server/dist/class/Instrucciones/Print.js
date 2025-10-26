"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
class print extends inst_1.Instruccion {
    constructor(linea, columna, expresion) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.IMPRIMIR);
        this.expresion = expresion;
    }
    play(enviroment) {
        let valor = this.expresion ? this.expresion.play(enviroment) : null;
        enviroment.setPrint(valor ? valor.value : '');
    }
}
exports.print = print;
