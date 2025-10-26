"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tokens = void 0;
class Tokens {
    constructor(id, tipo1, tipo2, valor, entorno, linea, columna) {
        this.id = id;
        this.tipo1 = tipo1;
        this.tipo2 = tipo2;
        this.valor = valor;
        this.entorno = entorno;
        this.linea = linea;
        this.columna = columna;
    }
    toString() {
        return `id: ${this.id}, tipo1: ${this.tipo1}, tipo2: ${this.tipo2}, valor: ${this.valor}, entorno: ${this.entorno}, linea: ${this.linea}, columna: ${this.columna}`;
    }
}
exports.Tokens = Tokens;
