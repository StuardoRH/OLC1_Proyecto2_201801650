"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simboloTabla = void 0;
const Tip_1 = require("../util/Tip");
class simboloTabla {
    constructor(linea, columna, isVariable, isPrimitive, valor, tipo, id, nombreEntorno) {
        this.linea = linea;
        this.columna = columna;
        this.isVariable = isVariable;
        this.isPrimitive = isPrimitive;
        this.valor = valor;
        this.tipo = tipo;
        this.id = id;
        this.nombreEntorno = nombreEntorno;
        this.indice = 0;
    }
    toString() {
        return '║ ' + `${this.id}`.padEnd(20) + ' ║ ' + `${this.getTipo(this.tipo)}`.padEnd(10) + ' ║ ' + `${this.nombreEntorno}`.padEnd(15) + ' ║ ' + `${this.linea}`.padEnd(5) + ' ║ ' + `${this.columna}`.padEnd(7) + ' ║ ';
    }
    hash() {
        return `${this.id}_${this.tipo}_${this.nombreEntorno}_${this.linea}_${this.columna}_${this.isVariable}_${this.isPrimitive}`;
    }
    getTipo(tipo) {
        switch (this.tipo) {
            case Tip_1.Tip.ENTERO:
                return "entero";
            case Tip_1.Tip.DECIMAL:
                return "decimal";
            case Tip_1.Tip.BOOLEANO:
                return "booleano";
            case Tip_1.Tip.CARACTER:
                return "caracter";
            case Tip_1.Tip.CADENA:
                return "cadena";
            case Tip_1.Tip.NULO:
                return "null";
            case Tip_1.Tip.INVALIDO:
                return "invalido";
            default:
                return "desconocido";
        }
    }
}
exports.simboloTabla = simboloTabla;
