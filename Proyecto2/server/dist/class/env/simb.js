"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListaSimbolo = exports.Simbolo = void 0;
class Simbolo {
    constructor(value, id, tipo) {
        this.value = value;
        this.id = id;
        this.tipo = tipo;
    }
}
exports.Simbolo = Simbolo;
class ListaSimbolo {
    constructor(value, id, tipo, dimension) {
        if (dimension < 1 || dimension > 3) {
            throw new Error(`Error: La lista '${id}' debe tener entre 1 y 3 dimensiones.`);
        }
        this.id = id;
        this.value = value;
        this.tipo = tipo;
        this.dimension = dimension;
    }
}
exports.ListaSimbolo = ListaSimbolo;
