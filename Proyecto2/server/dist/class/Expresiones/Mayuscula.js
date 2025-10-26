"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mayuscula = void 0;
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class Mayuscula extends exp_1.Exp {
    constructor(line, column, expression // Expresión de entrada (cadena)
    ) {
        super(line, column, expresionsTypes_1.ExpresionsTypes.MAYUSCULA);
        this.line = line;
        this.column = column;
        this.expression = expression;
    }
    play(env) {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // Verificar si el resultado es una cadena
            if (result.tip !== Tip_1.Tip.CADENA) {
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La función 'mayuscula' espera una expresión de tipo STRING.`);
            }
            // Convertir a mayúsculas
            const upperCaseValue = result.value.toUpperCase();
            return { value: upperCaseValue, tip: Tip_1.Tip.CADENA };
        }
        catch (e) {
            console.error(`Error al ejecutar la función 'mayuscula': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar la función 'mayuscula'.`));
            return { value: null, tip: Tip_1.Tip.NULO };
        }
    }
}
exports.Mayuscula = Mayuscula;
