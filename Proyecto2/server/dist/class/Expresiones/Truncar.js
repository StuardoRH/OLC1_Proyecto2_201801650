"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Truncar = void 0;
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const errtype_1 = require("../util/errtype");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
const expresionType_1 = require("../util/expresionType");
class Truncar extends exp_1.Exp {
    constructor(line, column, expression // Expresión de entrada (número)
    ) {
        super(line, column, expresionType_1.ExpresionType.FUNCION_NATIVA);
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
                throw new Error_1.Error(this.line, this.column, errtype_1.ErrType.SEMANTIC, `La función 'truncar' espera una expresión de tipo FLOAT o INTEGER.`);
            }
            // Truncar el número
            const truncatedValue = Math.trunc(result.value);
            return { value: truncatedValue, tip: Tip_1.Tip.ENTERO };
        }
        catch (e) {
            console.error(`Error al ejecutar la función 'truncar': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, errtype_1.ErrType.SEMANTIC, `Error al ejecutar la función 'truncar'.`));
            return { value: null, tip: Tip_1.Tip.NULL };
        }
    }
}
exports.Truncar = Truncar;
