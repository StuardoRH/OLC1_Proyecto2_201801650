import { Instruccion } from "../abs/inst"; // <-- 1. Importar Instruccion

export class Metodo {
    constructor(
        
        public linea: number, 
        public columna: number,
        public id: string, 
        public instrucciones: Instruccion[] // <-- 3. Tipo corregido
    ) {}        
}