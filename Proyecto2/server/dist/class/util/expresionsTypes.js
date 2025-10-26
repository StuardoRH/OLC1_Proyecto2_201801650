"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpresionsTypes = void 0;
var ExpresionsTypes;
(function (ExpresionsTypes) {
    ExpresionsTypes[ExpresionsTypes["PRIMITIVO"] = 0] = "PRIMITIVO";
    ExpresionsTypes[ExpresionsTypes["ARITMETICO"] = 1] = "ARITMETICO";
    ExpresionsTypes[ExpresionsTypes["RELACIONAL"] = 2] = "RELACIONAL";
    ExpresionsTypes[ExpresionsTypes["LOGICO"] = 3] = "LOGICO";
    ExpresionsTypes[ExpresionsTypes["ACCESO_ID"] = 4] = "ACCESO_ID";
    ExpresionsTypes[ExpresionsTypes["FUNCION_NATIVA"] = 5] = "FUNCION_NATIVA";
    ExpresionsTypes[ExpresionsTypes["CASTEO"] = 6] = "CASTEO";
    ExpresionsTypes[ExpresionsTypes["ACCESS_LIST"] = 7] = "ACCESS_LIST";
    ExpresionsTypes[ExpresionsTypes["MINUSCULA"] = 8] = "MINUSCULA";
    ExpresionsTypes[ExpresionsTypes["MAYUSCULA"] = 9] = "MAYUSCULA";
    ExpresionsTypes[ExpresionsTypes["LLAMADA_FUNCION"] = 10] = "LLAMADA_FUNCION";
    ExpresionsTypes[ExpresionsTypes["RETURN"] = 11] = "RETURN";
    ExpresionsTypes[ExpresionsTypes["TERNARIO"] = 12] = "TERNARIO";
})(ExpresionsTypes || (exports.ExpresionsTypes = ExpresionsTypes = {}));
