"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Casteo = void 0;
const exp_1 = require("../abs/exp");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class Casteo extends exp_1.Exp {
    constructor(linea, columna, tipo, exp) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.CASTEO);
        this.tipo = tipo;
        this.exp = exp;
    }
    play(entorno) {
        const valor = this.exp.play(entorno);
        // console.log('ingreso al casteo');
        // console.log('tipo del expresion', valor.tip);
        // console.log('tipo del casteo', this.tipo);
        // Validar que el tipo origen sea compatible con el tipo destino
        if (!this.esConversionValida(valor.tip, this.tipo)) {
            throw new Error(`Error de casteo en línea ${this.linea}, columna ${this.columna}: ` +
                `No se puede convertir '${Tip_1.Tip[valor.tip]}' a '${Tip_1.Tip[this.tipo]}'`);
        }
        // Realizar la conversión según el tipo destino
        switch (this.tipo) {
            case Tip_1.Tip.ENTERO:
                return this.convertirAEntero(valor);
            case Tip_1.Tip.DECIMAL:
                return this.convertirADecimal(valor);
            case Tip_1.Tip.CADENA:
                return this.convertirACadena(valor);
            case Tip_1.Tip.CARACTER:
                return this.convertirACaracter(valor);
            default:
                throw new Error(`Tipo de casteo no soportado: ${Tip_1.Tip[this.tipo]}`);
        }
    }
    esConversionValida(tipoOrigen, tipoDestino) {
        // Reglas permitidas de casteo
        const reglasPermitidas = {
            [Tip_1.Tip.ENTERO]: [Tip_1.Tip.DECIMAL, Tip_1.Tip.CADENA, Tip_1.Tip.CARACTER],
            [Tip_1.Tip.DECIMAL]: [Tip_1.Tip.ENTERO, Tip_1.Tip.CADENA],
            [Tip_1.Tip.CARACTER]: [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL],
        };
        // Verificar si la conversión es válida
        const reglas = reglasPermitidas[tipoOrigen];
        return reglas ? reglas.includes(tipoDestino) : false;
    }
    convertirAEntero(valor) {
        switch (valor.tip) {
            case Tip_1.Tip.CARACTER:
                // Asegurarse de que el valor sea una cadena antes de usar charCodeAt
                const charValue = String(valor.value); // Coerción explícita a string
                return { value: charValue.charCodeAt(0), tip: Tip_1.Tip.ENTERO };
            case Tip_1.Tip.DECIMAL:
                // Truncar decimal a entero
                return { value: Math.trunc(valor.value), tip: Tip_1.Tip.ENTERO };
            default:
                throw new Error(`No se puede convertir '${Tip_1.Tip[valor.tip]}' a ENTERO`);
        }
    }
    convertirADecimal(valor) {
        switch (valor.tip) {
            case Tip_1.Tip.ENTERO:
                // Convertir entero a decimal
                return { value: parseFloat(valor.value), tip: Tip_1.Tip.DECIMAL };
            case Tip_1.Tip.CARACTER:
                // Asegurarse de que el valor sea una cadena antes de usar charCodeAt
                const charValue = String(valor.value); // Coerción explícita a string
                return { value: parseFloat(charValue), tip: Tip_1.Tip.DECIMAL };
            default:
                throw new Error(`No se puede convertir '${Tip_1.Tip[valor.tip]}' a DECIMAL`);
        }
    }
    convertirACadena(valor) {
        switch (valor.tip) {
            case Tip_1.Tip.ENTERO:
            case Tip_1.Tip.DECIMAL:
            case Tip_1.Tip.CARACTER:
                // Convertir cualquier tipo a cadena
                return { value: String(valor.value), tip: Tip_1.Tip.CADENA }; // Coerción explícita a string
            default:
                throw new Error(`No se puede convertir '${Tip_1.Tip[valor.tip]}' a CADENA`);
        }
    }
    convertirACaracter(valor) {
        switch (valor.tip) {
            case Tip_1.Tip.ENTERO:
                // Convertir entero a carácter usando su valor ASCII
                return { value: String.fromCharCode(valor.value), tip: Tip_1.Tip.CARACTER };
            case Tip_1.Tip.DECIMAL:
                // Convertir decimal a carácter usando su valor ASCII truncado
                return { value: String.fromCharCode(Math.trunc(valor.value)), tip: Tip_1.Tip.CARACTER };
            default:
                throw new Error(`No se puede convertir '${Tip_1.Tip[valor.tip]}' a CARACTER`);
        }
    }
}
exports.Casteo = Casteo;
