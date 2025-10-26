"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.negacionUnitaria = exports.modulo = exports.potencia = exports.division = exports.multiplicacion = exports.resta = exports.suma = void 0;
const Tip_1 = require("../util/Tip");
//OpDomin
//  ENTERO  DECIMAL  BOOLEANO  CARACTER  CADENA
exports.suma = [
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.ENTERO, Tip_1.Tip.ENTERO, Tip_1.Tip.CADENA],
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.CADENA],
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.NULO, Tip_1.Tip.NULO, Tip_1.Tip.CADENA],
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.NULO, Tip_1.Tip.CADENA, Tip_1.Tip.CADENA],
    [Tip_1.Tip.CADENA, Tip_1.Tip.CADENA, Tip_1.Tip.CADENA, Tip_1.Tip.CADENA, Tip_1.Tip.CADENA]
];
exports.resta = [
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.ENTERO, Tip_1.Tip.ENTERO, Tip_1.Tip.INVALIDO], //ENTERO
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO], //DECIMAL
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.NULO, Tip_1.Tip.NULO, Tip_1.Tip.INVALIDO], //BOOLEANO
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.NULO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //CARACTER
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO] //CADENA   
];
exports.multiplicacion = [
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.ENTERO, Tip_1.Tip.INVALIDO], //ENTERO 
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO], //DECIMAL
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //BOOLEANO
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.NULO, Tip_1.Tip.INVALIDO], //CARACTER
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO] //CADENA
];
//  ENTERO  DECIMAL  BOOLEANO  CARACTER  CADENA
exports.division = [
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO], //ENTERO
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO], //DECIMAL
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //BOOLEANO
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.NULO, Tip_1.Tip.INVALIDO], //CARACTER
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO] //CADENA
];
exports.potencia = [
    [Tip_1.Tip.ENTERO, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //ENTERO
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //DECIMAL
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //BOOLEANO
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //CARACTER
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO] //CADENA
];
exports.modulo = [
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //ENTERO
    [Tip_1.Tip.DECIMAL, Tip_1.Tip.DECIMAL, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //DECIMAL
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //BOOLEANO
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO], //CARACTER
    [Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO, Tip_1.Tip.INVALIDO] //CADENA
];
exports.negacionUnitaria = [
    Tip_1.Tip.ENTERO,
    Tip_1.Tip.DECIMAL,
    Tip_1.Tip.INVALIDO,
    Tip_1.Tip.INVALIDO,
    Tip_1.Tip.INVALIDO
];
