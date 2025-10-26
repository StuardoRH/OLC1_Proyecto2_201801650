import {Tip} from "../util/Tip"
import {Exp} from "../abs/exp";

// --- 1. IMPORTAR SISTEMA DE ERRORES ---
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class Simbolo {
    constructor(public value: any,public id: string,public tipo: Tip) {}
}

export class ListaSimbolo {
    public id: string;
    public value: Exp | Exp[]; // Valor almacenado (array multidimensional)
    public tipo: Tip; // Tipo de datos de la lista (Entero, Caracter, etc.)
    public dimension: number; // Número de dimensiones (1, 2 o 3)

    constructor(value: any, id: string, tipo: Tip, dimension: number) {

        // --- 2. MANEJO DE ERROR CORREGIDO ---
        if (dimension < 1 || dimension > 3) {
            // Reportar error en lugar de crashear
            errores.push(new CustomError(
                0, 0, // No tenemos línea/columna aquí, pero 'SaveList' sí
                ErroresTypes.SEMANTICO,
                `Error: La lista '${id}' debe tener entre 1 y 3 dimensiones, pero se especificaron ${dimension}.`
            ));
            // Asignar valores por defecto para evitar más errores
            this.id = id;
            this.value = [];
            this.tipo = tipo;
            this.dimension = 0; // Marcar como inválida
        } else {
            // Constructor normal
            this.id = id;
            this.value = value;
            this.tipo = tipo;
            this.dimension = dimension;
        }
    }
}