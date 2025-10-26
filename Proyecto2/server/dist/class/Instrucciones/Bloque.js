"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bloque = void 0;
const inst_1 = require("../abs/inst");
const enviroment_1 = require("../env/enviroment");
const instructionsTypes_1 = require("../util/instructionsTypes");
class Bloque extends inst_1.Instruccion {
    constructor(linea, columna, instrucciones) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.LLAMADA_BLOQUE_INSTRUCCIONES);
        this.instrucciones = instrucciones;
    }
    play(entorno) {
        const nuevoEntorno = new enviroment_1.enviroment(entorno, entorno.nombre);
        for (const instruccion of this.instrucciones) {
            try {
                const result = instruccion.play(nuevoEntorno);
                if (result) {
                    return result;
                }
            }
            catch (error) { }
        }
    }
}
exports.Bloque = Bloque;
