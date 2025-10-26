"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asignacion = void 0;
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
const Tip_1 = require("../util/Tip");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
let { errores } = require('../util/out');
class Asignacion extends inst_1.Instruccion {
    constructor(linea, columna, ids, valor) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.ASIGNAR_VALOR);
        this.ids = ids;
        this.valor = valor;
    }
    play(env) {
        try {
            // Caso asignación múltiple
            if (Array.isArray(this.valor)) {
                if (this.ids.length !== this.valor.length) {
                    errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Número de variables (${this.ids.length}) no coincide con valores (${this.valor.length})`));
                    return;
                }
                this.ids.forEach((id, index) => {
                    const valorExp = this.valor[index];
                    const valorEvaluado = valorExp.play(env);
                    this.validarYAsignar(env, id, valorEvaluado);
                });
                return;
            }
            // Caso asignación simple
            const resultado = this.valor.play(env);
            this.validarYAsignar(env, this.ids[0], resultado);
        }
        catch (error) {
            this.manejarError(error);
        }
    }
    validarYAsignar(env, id, valor) {
        const simbolo = env.getVar(id, this.linea, this.columna);
        // Validar que la variable exista
        if (!simbolo) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Variable '${id}' no declarada`));
            return;
        }
        // Validar compatibilidad de tipos
        if (simbolo.tipo !== valor.tip) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error de tipo en línea ${this.linea}, columna ${this.columna}: ` +
                `La variable '${id}' es de tipo '${Tip_1.Tip[simbolo.tipo]}', pero se intentó asignar un valor de tipo '${Tip_1.Tip[valor.tip]}'`));
            return;
        }
        // Guardar el valor en el entorno
        env.setVar(id, valor.value, simbolo.tipo, this.linea, this.columna);
    }
    manejarError(error) {
        let errorMessage = `Error en línea ${this.linea}, columna ${this.columna}: `;
        if (error instanceof Error) {
            errorMessage += error.message; // Obtener el mensaje de error usando la propiedad 'message'
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, errorMessage));
        }
        else {
            errorMessage += "Error desconocido en asignación";
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, errorMessage));
        }
        console.error(errorMessage);
    }
}
exports.Asignacion = Asignacion;
