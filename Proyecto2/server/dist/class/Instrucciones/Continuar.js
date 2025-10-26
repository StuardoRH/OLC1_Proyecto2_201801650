"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Continuar = void 0;
const inst_1 = require("../abs/inst");
const For_1 = require("./For");
const While_1 = require("./While");
const DoWhile_1 = require("./DoWhile");
const instructionsTypes_1 = require("../util/instructionsTypes");
class Continuar extends inst_1.Instruccion {
    constructor(line, column) {
        super(line, column, instructionsTypes_1.intructionsTypes.CONTINUAR);
        this.line = line;
        this.column = column;
    }
    play(env) {
        if (For_1.ForLoop.Bandera_Esta_En_Uso_FOr) {
            For_1.ForLoop.Bandera_Continuar = true;
            console.log("Activando bandera de continuar en ForLoop.");
        }
        else if (While_1.While.Bandera_Esta_En_Uso_While) {
            While_1.While.Bandera_Continuar = true;
            console.log("Activando bandera de continuar en WhileLoop.");
        }
        else if (DoWhile_1.DoWhileLoop.Bandera_Esta_En_Uso_DoWhile) {
            DoWhile_1.DoWhileLoop.Bandera_Continuar = true;
            console.log("Activando bandera de continuar en DoWhileLoop.");
        }
        else {
            console.error("Error: 'continuar' fuera de un ciclo.");
        }
    }
}
exports.Continuar = Continuar;
