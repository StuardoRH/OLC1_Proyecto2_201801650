"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Minuscula = void 0;
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const expresionsTypes_1 = require("../util/expresionsTypes");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
class Minuscula extends exp_1.Exp {
    constructor(line, column, expression // Expresión de entrada (cadena)
    ) {
        super(line, column, expresionsTypes_1.ExpresionsTypes.MINUSCULA);
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
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La función 'minuscula' espera una expresión de tipo STRING.`);
            }
            // Convertir a minúsculas
            const lowerCaseValue = result.value.toLowerCase();
            return { value: lowerCaseValue, tip: Tip_1.Tip.CADENA };
        }
        catch (e) {
            console.error(`Error al ejecutar la función 'minuscula': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar la función 'minuscula'.`));
            return { value: null, tip: Tip_1.Tip.NULO };
        }
    }
}
exports.Minuscula = Minuscula;
