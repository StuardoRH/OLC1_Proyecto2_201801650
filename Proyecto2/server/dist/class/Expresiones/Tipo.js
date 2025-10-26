"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tipo = void 0;
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class Tipo extends exp_1.Exp {
    constructor(line, column, expression // Expresión de entrada
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
            // Obtener el tipo de dato
            const typeName = result.tip;
            if (typeName === Tip_1.Tip.ENTERO) {
                return { value: "Entero", tip: Tip_1.Tip.CADENA };
            }
            if (typeName === Tip_1.Tip.DECIMAL) {
                return { value: "Decimal", tip: Tip_1.Tip.CADENA };
            }
            if (typeName === Tip_1.Tip.CADENA) {
                return { value: "Cadena", tip: Tip_1.Tip.CADENA };
            }
            if (typeName === Tip_1.Tip.BOOLEANO) {
                return { value: "Booleano", tip: Tip_1.Tip.CADENA };
            }
            if (typeName === Tip_1.Tip.NULO) {
                return { value: "Null", tip: Tip_1.Tip.CADENA };
            }
            return { value: "Desconocido", tip: Tip_1.Tip.CADENA };
        }
        catch (e) {
            console.error(`Error al ejecutar la función 'tipo': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar la función 'tipo'.`));
            return { value: null, tip: Tip_1.Tip.NULO };
        }
    }
}
exports.Tipo = Tipo;
