"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListDeclaration = void 0;
const Tip_1 = require("../util/Tip");
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
const exp_1 = require("../abs/exp");
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
class ListDeclaration extends inst_1.Instruccion {
    constructor(line, column, id, dimension, // Permitimos que sea tanto número como cadena
    tipo, valores) {
        super(line, column, instructionsTypes_1.intructionsTypes.LISTAS);
        this.line = line;
        this.column = column;
        // Inicialización explícita de propiedades
        this.id = id;
        this.dimension = Number(dimension); // Convertir explícitamente a número
        this.tipo = tipo;
        this.valores = valores;
        // Validar que la dimensionalidad esté entre 1 y 3
        if (this.dimension < 1 || this.dimension > 3) {
            out_1.errores.push(new Error_1.Error(line, column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La dimensionalidad de la lista '${id}' debe estar entre 1 y 3.`));
            return; // Detener la inicialización si la dimensionalidad es inválida
        }
    }
    /**
     * Ejecuta la declaración de la lista en el entorno.
     */
    play(env) {
        try {
            // Evaluar los valores antes de validar
            const evaluatedValues = this.evaluateValues(this.valores, env);
            // Validar dimensionalidad de los valores
            if (!this.validateDimensionality(evaluatedValues, this.dimension)) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La dimensionalidad de los valores no coincide con la declarada para la lista '${this.id}'. Dimensionalidad esperada: ${this.dimension}.`));
                return; // Detener la ejecución si la dimensionalidad es inválida
            }
            // Validar tipos
            if (!this.validateTypes(evaluatedValues, this.tipo, env)) {
                // console.log(`Tipo de valores: ${typeof evaluatedValues}`);
                // console.log(`Tipo de valores evaluados: ${evaluatedValues}`);
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Los valores de la lista '${this.id}' no coinciden con el tipo declarado. Tipo esperado: ${this.tipo}.`));
                return; // Detener la ejecución si los tipos no coinciden
            }
            // Guardar la lista en el entorno
            env.SaveList(this.id, this.valores, this.tipo, this.dimension, this.line, this.column);
        }
        catch (e) {
            // Verificación de tipo para acceder a e.message
            if (e instanceof Error_1.Error) {
                console.error(`Error al declarar lista '${this.id}'`);
            }
            else {
                console.error(`Error desconocido al declarar lista '${this.id}'`);
            }
        }
    }
    /**
     * Evalúa los valores de la lista para obtener sus representaciones reales.
     */
    evaluateValues(valores, env) {
        if (Array.isArray(valores)) {
            return valores.map((element) => {
                if (Array.isArray(element)) {
                    return this.evaluateValues(element, env);
                }
                else if (element instanceof exp_1.Exp) {
                    const evaluated = element.play(env); // Evalúa la expresión
                    return evaluated.value; // Retornar el valor real
                }
                else {
                    return null; // Valor inválido
                }
            });
        }
        else if (valores instanceof exp_1.Exp) {
            const evaluated = valores.play(env); // Evalúa la expresión
            return evaluated.value; // Retornar el valor real
        }
        return null; // Valor inválido
    }
    /**
     * Verifica que la dimensionalidad de los valores coincida con la declarada.
     */
    validateDimensionality(valores, dimension) {
        const isArray = Array.isArray(valores);
        if (!isArray) {
            return dimension === 1; // Un solo valor solo es válido para dimensión 1
        }
        let currentDimension = 1;
        let ref = valores;
        while (Array.isArray(ref[0])) {
            currentDimension++;
            ref = ref[0];
        }
        // console.log(`Dimensionalidad actual: ${currentDimension}`);
        // console.log(`Dimensionalidad esperada: ${dimension}`);
        // console.log(`Tipo de currentDimension: ${typeof currentDimension}`);
        // console.log(`Tipo de dimension: ${typeof dimension}`);
        return currentDimension === dimension; // Comparación directa ya que ambos son números
    }
    /**
     * Evalúa los valores de la lista y verifica que coincidan con el tipo declarado.
     */
    /**
     * Evalúa los valores de la lista y verifica que coincidan con el tipo declarado.
     */
    /**
     * Evalúa los valores de la lista y verifica que coincidan con el tipo declarado.
     */
    validateTypes(valores, tipo, env) {
        if (Array.isArray(valores)) {
            for (const element of valores) {
                if (Array.isArray(element)) {
                    if (!this.validateTypes(element, tipo, env)) {
                        return false;
                    }
                }
                else {
                    let evaluated = null;
                    if (typeof element === "object" && element !== null) {
                        // Si es una instancia de Exp, usa su propiedad tip
                        evaluated = element.tip;
                    }
                    else {
                        // Si es un valor primitivo, mapea su tipo JavaScript a Tip
                        evaluated = this.mapToTip(typeof element, element);
                    }
                    // Agregar logs para depurar
                    // console.log(`Valor evaluado: ${evaluated}`);
                    // console.log(`Tipo esperado: ${tipo}`);
                    // console.log(`Coincide: ${evaluated === tipo}`);
                    if (evaluated !== tipo) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
    /**
     * Mapea un tipo JavaScript a un tipo Tip.
     */
    /**
     * Mapea un tipo JavaScript a un tipo Tip.
     */
    mapToTip(evaluated, value) {
        switch (evaluated) {
            case "number":
                // Distinguir entre Entero y Decimal
                return Number.isInteger(value) ? Tip_1.Tip.ENTERO : Tip_1.Tip.DECIMAL;
            case "string":
                // Distinguir entre Caracter y Cadena
                return value.length === 1 ? Tip_1.Tip.CARACTER : Tip_1.Tip.CADENA;
            case "boolean":
                return Tip_1.Tip.BOOLEANO;
            default:
                return null; // Tipo desconocido
        }
    }
}
exports.ListDeclaration = ListDeclaration;
