"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchStatement = void 0;
//switch statement
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
class SwitchStatement extends inst_1.Instruccion {
    constructor(linea, columna, expression, cases, defaultCase) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.SWITH);
        this.expression = expression;
        this.cases = cases;
        this.defaultCase = defaultCase;
    }
    play(entorno) {
        const value = this.expression.play(entorno); // Evaluar la expresión principal
        let matched = false; // Bandera para verificar si se encontró un caso coincidente
        // Iterar sobre los casos
        for (const caseItem of this.cases) {
            const conditionValue = caseItem.condition.play(entorno);
            // Comparar valores (asegúrate de que ambos sean cadenas para evitar problemas de tipo)
            if (String(value.value) === String(conditionValue.value)) {
                matched = true; // Marcar como coincidente
                // Ejecutar el cuerpo del caso
                for (const instruccion of caseItem.body) {
                    instruccion.play(entorno);
                }
                return; // Terminar después de ejecutar un caso
            }
        }
        // Si no hay coincidencia, ejecutar el caso por defecto
        if (!matched && this.defaultCase) {
            for (const instruccion of this.defaultCase) {
                instruccion.play(entorno);
            }
        }
    }
}
exports.SwitchStatement = SwitchStatement;
