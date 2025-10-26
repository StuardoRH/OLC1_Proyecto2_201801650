"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Funcion = void 0;
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
class Funcion extends inst_1.Instruccion {
    constructor(linea, columna, nombreFuncion, tipo, parametros, instrucciones) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.FUNCION);
        this.nombreFuncion = nombreFuncion;
        this.tipo = tipo;
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }
    play(entorno) {
        entorno.guardarFuncion(this.nombreFuncion, this, this.linea, this.columna);
    }
}
exports.Funcion = Funcion;
