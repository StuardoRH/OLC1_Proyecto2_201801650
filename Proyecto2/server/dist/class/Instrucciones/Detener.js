"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Detener = void 0;
const inst_1 = require("../abs/inst");
const For_1 = require("./For");
const While_1 = require("./While");
const DoWhile_1 = require("./DoWhile");
const instructionsTypes_1 = require("../util/instructionsTypes");
class Detener extends inst_1.Instruccion {
    constructor(line, column) {
        super(line, column, instructionsTypes_1.intructionsTypes.DETENER);
        this.line = line;
        this.column = column;
    }
    play(env) {
        if (For_1.ForLoop.Bandera_Esta_En_Uso_FOr) {
            For_1.ForLoop.Bandera_Detener = true;
            console.log("Activando bandera de detener en ForLoop.");
        }
        else if (While_1.While.Bandera_Esta_En_Uso_While) {
            While_1.While.Bandera_Detener = true;
            console.log("Activando bandera de detener en WhileLoop.");
        }
        else if (DoWhile_1.DoWhileLoop.Bandera_Esta_En_Uso_DoWhile) {
            DoWhile_1.DoWhileLoop.Bandera_Detener = true;
            console.log("Activando bandera de detener en DoWhileLoop.");
        }
        else {
            console.error("Error: 'detener' fuera de un ciclo.");
        }
    }
}
exports.Detener = Detener;
