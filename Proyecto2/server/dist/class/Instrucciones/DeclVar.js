"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclaracionV = void 0;
const inst_1 = require("../abs/inst");
const Tip_1 = require("../util/Tip");
const instructionsTypes_1 = require("../util/instructionsTypes");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
let { errores } = require('../util/out');
//DeclVar
class DeclaracionV extends inst_1.Instruccion {
    constructor(linea, columna, id, tipo, valor) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.CREAR_VARIABLE);
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;
    }
    play(env) {
        try {
            // Normalizar a arrays
            const ids = Array.isArray(this.id) ? this.id : [this.id];
            const tipos = Array.isArray(this.tipo) ? this.tipo : [this.tipo];
            // Validar consistencia de tipos
            if (tipos.length > 1 && tipos.length !== ids.length) {
                errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Número de tipos (${tipos.length}) no coincide con variables (${ids.length})`));
                return;
            }
            // Validar unicidad de variables
            this.validarVariablesUnicas(env, ids);
            // Procesar valores
            if (!this.valor) {
                this.declararSinValor(env, ids, tipos);
            }
            else {
                this.declararConValor(env, ids, tipos);
            }
        }
        catch (error) {
            this.handleError(error);
        }
    }
    validarVariablesUnicas(env, ids) {
        const duplicados = ids.filter(id => {
            const variable = env.getVar(id, this.linea, this.columna);
            return variable !== null && variable !== undefined;
        });
        if (duplicados.length > 0) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Variables ya declaradas: ${duplicados.join(', ')}`));
        }
    }
    declararSinValor(env, ids, tipos) {
        ids.forEach((id, index) => {
            const tipoActual = tipos[index] ?? tipos[0];
            const valorPorDefecto = this.getValorPorDefecto(tipoActual);
            if (env) {
                env.SaveVar(id, valorPorDefecto, tipoActual, this.linea, this.columna);
            }
        });
    }
    declararConValor(env, ids, tipos) {
        const valores = Array.isArray(this.valor) ? this.valor : [this.valor];
        if (valores.length !== ids.length) {
            errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Número de valores (${valores.length}) no coincide con variables (${ids.length})`));
            return;
        }
        ids.forEach((id, index) => {
            const tipoActual = tipos[index] ?? tipos[0];
            const valorExp = valores[index];
            if (!valorExp) {
                errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Expresión no definida para variable '${id}'`));
                return;
            }
            const resultado = valorExp.play(env);
            // Validar que el tipo del valor coincida con el tipo declarado
            if (!this.validarTipo(resultado, tipoActual)) {
                errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error de tipo en línea ${this.linea}, columna ${this.columna}: ` +
                    `La variable '${id}' es de tipo '${Tip_1.Tip[tipoActual]}', pero se recibió un valor de tipo '${Tip_1.Tip[resultado.tip]}'`));
                return;
            }
            if (env) {
                env.SaveVar(id, resultado.value, tipoActual, this.linea, this.columna);
            }
        });
    }
    handleError(error) {
        let errorMessage = `Error en línea ${this.linea}, columna ${this.columna}: `;
        if (error instanceof Error) {
            errorMessage += error.message; // Retrieve the error message using the 'message' property
            errores.push(error); // Agregar el error a la lista global
        }
        else {
            errorMessage += "Error desconocido al declarar variable";
            errores.push(new Error(`${errorMessage} Línea: ${this.linea}, Columna: ${this.columna}`));
        }
        console.error(errorMessage);
    }
    getValorPorDefecto(tipo) {
        switch (tipo) {
            case Tip_1.Tip.ENTERO:
                return 0;
            case Tip_1.Tip.DECIMAL:
                return 0.0;
            case Tip_1.Tip.BOOLEANO:
                return true; // Valor por defecto para booleanos
            case Tip_1.Tip.CARACTER:
                return '\0';
            case Tip_1.Tip.CADENA:
                return "";
            case Tip_1.Tip.NULO:
                return null;
            case Tip_1.Tip.INVALIDO:
                return null;
            default:
                errores.push(new Error(`Error en línea ${this.linea}, columna ${this.columna}: Tipo desconocido: ${tipo}`));
                return null;
        }
    }
    validarTipo(resultado, tipoEsperado) {
        // Verificar si los tipos coinciden exactamente
        if (resultado.tip !== tipoEsperado) {
            return false;
        }
        // Validaciones adicionales para tipos específicos
        switch (tipoEsperado) {
            case Tip_1.Tip.BOOLEANO:
                // Solo permitir valores booleanos
                if (typeof resultado.value !== "boolean") {
                    return false;
                }
                break;
            case Tip_1.Tip.CADENA:
                // Asegurarse de que el valor sea una cadena
                if (typeof resultado.value !== "string") {
                    return false;
                }
                break;
            case Tip_1.Tip.ENTERO:
                // Asegurarse de que el valor sea un número entero
                if (!Number.isInteger(resultado.value)) {
                    return false;
                }
                break;
            case Tip_1.Tip.DECIMAL:
                // Asegurarse de que el valor sea un número decimal
                if (typeof resultado.value !== "number") {
                    return false;
                }
                break;
            case Tip_1.Tip.CARACTER:
                // Asegurarse de que el valor sea un carácter
                if (typeof resultado.value !== "string" || resultado.value.length !== 1) {
                    return false;
                }
                break;
            case Tip_1.Tip.NULO:
                // Aceptar solo valores nulos
                if (resultado.value !== null) {
                    return false;
                }
                break;
            default:
                // Para otros tipos, confiar en la comparación básica de tipos
                break;
        }
        return true; // Si pasa todas las validaciones, el tipo es correcto
    }
}
exports.DeclaracionV = DeclaracionV;
