"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessList = void 0;
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const exp_1 = require("../abs/exp");
const expresionsTypes_1 = require("../util/expresionsTypes");
const Tip_1 = require("../util/Tip");
class AccessList extends exp_1.Exp {
    constructor(line, column, id, indices) {
        super(line, column, expresionsTypes_1.ExpresionsTypes.ACCESS_LIST);
        this.line = line;
        this.column = column;
        this.id = id;
        this.indices = [];
        this.indices = indices;
    }
    /**
     * Ejecuta el acceso a la lista.
     */
    play(env) {
        try {
            // Obtener la lista del entorno
            const listaSimbolo = env.getList(this.id);
            if (!listaSimbolo) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La lista '${this.id}' no existe.`));
                return { value: null, tip: Tip_1.Tip.NULO }; // Devolver un valor nulo en caso de error
            }
            // Validar que los índices coincidan con la dimensionalidad
            if (this.indices.length !== listaSimbolo.dimension) {
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La dimensionalidad del acceso (${this.indices.length}) no coincide con la declarada (${listaSimbolo.dimension}).`));
                return { value: null, tip: Tip_1.Tip.NULL }; // Devolver un valor nulo en caso de error
            }
            // Recorrer recursivamente los índices para obtener el valor
            let value;
            try {
                value = this.getValueFromIndices(listaSimbolo.value, this.indices);
            }
            catch (e) {
                console.error(`Error al acceder a la lista '${this.id}': ${e}`);
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al acceder a la lista '${this.id}'.`));
                return { value: null, tip: Tip_1.Tip.NULO }; // Devolver un valor nulo en caso de error
            }
            // Determinar el tipo del valor
            const tip = this.mapToTip(typeof value, value);
            // Devolver el valor y su tipo
            return { value, tip };
        }
        catch (e) {
            console.error(`Error inesperado al acceder a la lista '${this.id}': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error inesperado al acceder a la lista '${this.id}'.`));
            return { value: null, tip: Tip_1.Tip.NULO }; // Devolver un valor nulo en caso de error
        }
    }
    /**
     * Obtiene el valor de la lista dada una lista de índices.
     */
    getValueFromIndices(value, indices) {
        if (indices.length === 0) {
            return value; // Caso base: se llegó al valor deseado
        }
        const [currentIndex, ...restIndices] = indices;
        if (!Array.isArray(value)) {
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Intento de acceder a un índice en un valor no iterable.`));
            throw new Error("Valor no iterable");
        }
        if (currentIndex < 0 || currentIndex >= value.length) {
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Índice fuera de rango: ${currentIndex}. Tamaño de la lista: ${value.length}.`));
            throw new Error("Índice fuera de rango");
        }
        return this.getValueFromIndices(value[currentIndex], restIndices);
    }
    /**
     * Mapea un tipo JavaScript a un tipo Tip.
     */
    mapToTip(evaluated, value) {
        switch (evaluated) {
            case "number":
                return Number.isInteger(value) ? Tip_1.Tip.ENTERO : Tip_1.Tip.DECIMAL;
            case "string":
                return value.length === 1 ? Tip_1.Tip.CARACTER : Tip_1.Tip.CADENA;
            case "boolean":
                return Tip_1.Tip.BOOLEANO;
            default:
                return Tip_1.Tip.NULO; // Tipo desconocido
        }
    }
}
exports.AccessList = AccessList;
