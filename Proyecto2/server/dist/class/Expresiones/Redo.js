"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redo = void 0;
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class Redo extends exp_1.Exp {
    constructor(line, column, expression // Expresión de entrada (número)
    ) {
        super(line, column, expresionsTypes_1.ExpresionsTypes.FUNCION_NATIVA);
        this.line = line;
        this.column = column;
        this.expression = expression;
    }
    play(env) {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // Verificar si el resultado es un número
            if (result.tip !== Tip_1.Tip.DECIMAL && result.tip !== Tip_1.Tip.ENTERO) {
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La función 'redondear' espera una expresión de tipo FLOAT o INTEGER.`);
            }
            // Redondear el número
            const roundedValue = Math.round(result.value);
            return { value: roundedValue, tip: Tip_1.Tip.ENTERO };
        }
        catch (e) {
            console.error(`Error al ejecutar la función 'redondear': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar la función 'redondear'.`));
            return { value: null, tip: Tip_1.Tip.NULO };
        }
    }
}
exports.Redo = Redo;
