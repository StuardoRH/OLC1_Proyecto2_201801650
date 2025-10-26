"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Retornar = void 0;
const inst_1 = require("../abs/inst");
const For_1 = require("./For");
const While_1 = require("./While");
const DoWhile_1 = require("./DoWhile");
const instructionsTypes_1 = require("../util/instructionsTypes");
class Retornar extends inst_1.Instruccion {
    constructor(line, column, value // Puede ser null
    ) {
        super(line, column, instructionsTypes_1.intructionsTypes.RETORNAR);
        this.line = line;
        this.column = column;
        this.value = value;
    }
    play(env) {
        if (For_1.ForLoop.Bandera_Esta_En_Uso_FOr) {
            // Manejo de retorno dentro de un ciclo For
            For_1.ForLoop.Bandera_Retornar = true;
            console.log("Activando bandera de retornar en ForLoop.");
        }
        else if (While_1.While.Bandera_Esta_En_Uso_While) {
            // Manejo de retorno dentro de un ciclo While
            While_1.While.Bandera_Retornar = true;
            console.log("Activando bandera de retornar en WhileLoop.");
        }
        else if (DoWhile_1.DoWhileLoop.Bandera_Esta_En_Uso_DoWhile) {
            // Manejo de retorno dentro de un ciclo Do-While
            DoWhile_1.DoWhileLoop.Bandera_Retornar = true;
            console.log("Activando bandera de retornar en DoWhileLoop.");
        }
        else {
            // Error semántico: 'retornar' fuera de un ciclo, función o procedimiento
            throw new Error("Error semántico: 'retornar' fuera de un ciclo, función o procedimiento.");
        }
    }
}
exports.Retornar = Retornar;
