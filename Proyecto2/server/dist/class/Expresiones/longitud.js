"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Longitud = void 0;
//Longitud
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const expresionsTypes_1 = require("../util/expresionsTypes");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
class Longitud extends exp_1.Exp {
    constructor(line, column, expression // Expresión de entrada (cadena)
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
            // Verificar si el resultado es una cadena
            if (result.tip !== Tip_1.Tip.CADENA) {
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La función 'longitud' espera una expresión de tipo STRING.`);
            }
            // Calcular la longitud
            const length = result.value.length;
            return { value: length, tip: Tip_1.Tip.ENTERO };
        }
        catch (e) {
            console.error(`Error al ejecutar la función 'longitud': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar la función 'longitud'.`));
            return { value: null, tip: Tip_1.Tip.NULO };
        }
    }
}
exports.Longitud = Longitud;
