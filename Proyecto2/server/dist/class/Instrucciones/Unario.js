"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unarios = void 0;
const inst_1 = require("../abs/inst");
const ErroresTypes_1 = require("../util/ErroresTypes");
const instructionsTypes_1 = require("../util/instructionsTypes");
const Tip_1 = require("../util/Tip");
const Error_1 = require("../util/Error");
let { errores } = require('../util/out');
class Unarios extends inst_1.Instruccion {
    constructor(linea, columna, unario, id // Identificador de la variable
    ) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.UNITARIA);
        this.unario = unario;
        this.id = id;
    }
    play(env) {
        switch (this.unario) {
            case "inc":
                this.incrementar(this.id, env);
                break;
            case "dec":
                this.decrementar(this.id, env);
                break;
            case "++":
                this.incrementar(this.id, env);
                break;
            case "--":
                this.decrementar(this.id, env);
                break;
            default:
                errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Operador unario '${this.unario}' no reconocido`));
                break;
        }
    }
    incrementar(id, env) {
        // Obtener la variable del entorno usando su identificador
        const variable = env.getVar(id, this.linea, this.columna);
        if (!variable) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Variable '${id}' no declarada`));
            return;
        }
        // Validar que el tipo de la variable sea compatible (Entero o Decimal)
        if (variable.tipo !== Tip_1.Tip.ENTERO && variable.tipo !== Tip_1.Tip.DECIMAL) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `No se puede incrementar una variable de tipo '${Tip_1.Tip[variable.tipo]}'`));
            return;
        }
        // Incrementar el valor
        variable.value += 1;
        // Actualizar la variable en el entorno
        env.setVar(variable.id, variable.value, variable.tipo, this.linea, this.columna);
    }
    decrementar(id, env) {
        // Obtener la variable del entorno usando su identificador
        const variable = env.getVar(id, this.linea, this.columna);
        if (!variable) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Variable '${id}' no declarada`));
            return;
        }
        // Validar que el tipo de la variable sea compatible (Entero o Decimal)
        if (variable.tipo !== Tip_1.Tip.ENTERO && variable.tipo !== Tip_1.Tip.DECIMAL) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `No se puede decrementar una variable de tipo '${Tip_1.Tip[variable.tipo]}'`));
            return;
        }
        // Decrementar el valor
        variable.value -= 1;
        // Actualizar la variable en el entorno
        env.setVar(variable.id, variable.value, variable.tipo, this.linea, this.columna);
    }
}
exports.Unarios = Unarios;
