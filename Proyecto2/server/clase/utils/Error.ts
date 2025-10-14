import { ErroresTypes } from "./ErroresTypes";
export class Error {
    constructor(
        public tipo: ErroresTypes,
        public descripcion: string,
        public linea: number,
        public columna: number
    ){}
    
    public toString(): string {
        return `→ Error ${this.tipo}, ${this.descripcion}. ${this.linea}:${this.columna}`
    }

    public getData(): string[] {
        return [String(this.tipo), this.descripcion, String(this.linea), String(this.columna)]
    }
}