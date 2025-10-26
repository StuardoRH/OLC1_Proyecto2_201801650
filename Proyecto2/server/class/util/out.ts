import { Error } from './Error'
import { Node } from './nodo'
module.exports = require('./out.ts'); 

export var salidasConsola: string[] = []
export var errores: Error[] = []
export var tokens: string[] = []
let astRoot: Node | null = null;

export function getSalida(): string {
    let out = '';
    
    // Salidas de consola
    for(let i = 0; i < salidasConsola.length; i++) {
        out += salidasConsola[i];
        if(i < salidasConsola.length - 1) {
            out += "\n";
        }
    }

    // Tokens
    if (tokens.length > 0) {
        if(out !== "") {
            out += "\n\n↳ TOKENS\n";
        } else {
            out += "↳ TOKENS\n";
        }
        for(let i = 0; i < tokens.length; i++) {
            // Asume que tokens[i] es una instancia de la clase Tokens
            out += tokens[i].toString();
            if(i < tokens.length - 1) {
                out += "\n";
            }
        }
    }

    // Errores
    if(errores.length > 0) {
        if(out !== "") {
            out += "\n\n↳ ERRORES\n";
        } else {
            out += "↳ ERRORES\n";
        }
        for(let i = 0; i < errores.length; i++) {
            out += errores[i].toString();
            if(i < errores.length - 1) {
                out += "\n";
            }
        }
    }
    
    return out;
}


export function getErrores() {
	return errores;
}

export function getTokens() {
	return tokens;
}
export function limpiarSalidas() {
	salidasConsola.splice(0, salidasConsola.length)
	errores.splice(0, errores.length)
	tokens.splice(0, tokens.length)
}

// nodos AST
export function setAST(root: Node): void {
    astRoot = root;
}

export function getASTGraphviz(): string {
    if (!astRoot) {
        return 'digraph AST { }'; // AST vacío
    }
    return astRoot.toGraphviz();
}