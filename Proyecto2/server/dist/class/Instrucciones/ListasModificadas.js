"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyList = void 0;
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
class ModifyList {
    constructor(line, column, accessList, // Usar AccessList correctamente
    newValue) {
        this.line = line;
        this.column = column;
        this.accessList = accessList;
        this.newValue = newValue;
    }
    /**
     * Ejecuta la modificación de la lista.
     */
    play(env) {
        try {
            // Obtener la lista del entorno
            const listaSimbolo = env.getList(this.accessList.id);
            if (!listaSimbolo) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La lista '${this.accessList.id}' no existe.`));
                return;
            }
            // Evaluar el nuevo valor
            const evaluatedNewValue = this.newValue.play(env);
            const newValueType = evaluatedNewValue.tip;
            // Validar que el tipo del nuevo valor coincida con el tipo declarado
            if (newValueType !== listaSimbolo.tipo) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El tipo del nuevo valor (${Tip_1.Tip[newValueType]}) no coincide con el tipo declarado (${Tip_1.Tip[listaSimbolo.tipo]}).`));
                return;
            }
            // Obtener el valor actual de la lista
            let currentValue = listaSimbolo.value;
            // Recorrer recursivamente los índices para llegar al valor deseado
            const indices = this.accessList.indices;
            for (let i = 0; i < indices.length - 1; i++) {
                const index = indices[i];
                if (!Array.isArray(currentValue)) {
                    out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Intento de acceder a un índice en un valor no iterable.`));
                    return;
                }
                if (index < 0 || index >= currentValue.length) {
                    out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Índice fuera de rango: ${index}. Tamaño de la lista: ${currentValue.length}.`));
                    return;
                }
                currentValue = currentValue[index];
            }
            // Último índice para la modificación
            const lastIndex = indices[indices.length - 1];
            if (!Array.isArray(currentValue)) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Intento de acceder a un índice en un valor no iterable.`));
                return;
            }
            if (lastIndex < 0 || lastIndex >= currentValue.length) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Índice fuera de rango: ${lastIndex}. Tamaño de la lista: ${currentValue.length}.`));
                return;
            }
            // Actualizar el valor
            currentValue[lastIndex] = evaluatedNewValue.value;
        }
        catch (e) {
            console.error(`Error al modificar la lista '${this.accessList.id}': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error inesperado al modificar la lista '${this.accessList.id}'.`));
        }
    }
}
exports.ModifyList = ModifyList;
