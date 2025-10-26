"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Procedimiento = void 0;
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
class Procedimiento extends inst_1.Instruccion {
    constructor(linea, columna, nombreProce, tipo, parametros, instrucciones) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.PROCEDIMIENTO);
        this.nombreProce = nombreProce;
        this.tipo = tipo;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }
    play(entorno) {
        entorno.guardarProcedimiento(this.nombreProce, this, this.linea, this.columna);
    }
}
exports.Procedimiento = Procedimiento;
