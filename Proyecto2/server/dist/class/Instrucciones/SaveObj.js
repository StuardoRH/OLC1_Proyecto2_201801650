"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardarObjeto = void 0;
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
class GuardarObjeto extends inst_1.Instruccion {
    constructor(linea, columna, id, atributos) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.CREAR_OBJETO);
        this.id = id;
        this.atributos = atributos;
    }
    play(entorno) {
        entorno.guardarObjeto(this.id, this.atributos);
    }
}
exports.GuardarObjeto = GuardarObjeto;
