"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokens = exports.errores = exports.salidasConsola = void 0;
exports.getSalida = getSalida;
exports.getErrores = getErrores;
exports.getTokens = getTokens;
exports.limpiarSalidas = limpiarSalidas;
exports.setAST = setAST;
exports.getASTGraphviz = getASTGraphviz;
exports.salidasConsola = [];
exports.errores = [];
exports.tokens = [];
let astRoot = null;
function getSalida() {
    let out = '';
    // Salidas de consola
    for (let i = 0; i < exports.salidasConsola.length; i++) {
        out += exports.salidasConsola[i];
        if (i < exports.salidasConsola.length - 1) {
            out += "\n";
        }
    }
    // Tokens
    if (exports.tokens.length > 0) {
        if (out !== "") {
            out += "\n\n↳ TOKENS\n";
        }
        else {
            out += "↳ TOKENS\n";
        }
        for (let i = 0; i < exports.tokens.length; i++) {
            // Asume que tokens[i] es una instancia de la clase Tokens
            out += exports.tokens[i].toString();
            if (i < exports.tokens.length - 1) {
                out += "\n";
            }
        }
    }
    // Errores
    if (exports.errores.length > 0) {
        if (out !== "") {
            out += "\n\n↳ ERRORES\n";
        }
        else {
            out += "↳ ERRORES\n";
        }
        for (let i = 0; i < exports.errores.length; i++) {
            out += exports.errores[i].toString();
            if (i < exports.errores.length - 1) {
                out += "\n";
            }
        }
    }
    return out;
}
function getErrores() {
    return exports.errores;
}
function getTokens() {
    return exports.tokens;
}
function limpiarSalidas() {
    exports.salidasConsola.splice(0, exports.salidasConsola.length);
    exports.errores.splice(0, exports.errores.length);
    exports.tokens.splice(0, exports.tokens.length);
}
// nodos AST
function setAST(root) {
    astRoot = root;
}
function getASTGraphviz() {
    if (!astRoot) {
        return 'digraph AST { }'; // AST vacío
    }
    return astRoot.toGraphviz();
}
