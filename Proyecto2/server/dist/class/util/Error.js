"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Error = void 0;
class Error {
    constructor(tipo, descripcion, linea, columna) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna = columna;
    }
    toString() {
        return `→ Error ${this.tipo}, ${this.descripcion}. ${this.linea}:${this.columna}`;
    }
    getData() {
        return [String(this.tipo), this.descripcion, String(this.linea), String(this.columna)];
    }
}
exports.Error = Error;
