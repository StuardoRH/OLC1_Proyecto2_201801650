import { Tip } from "../util/Tip";

export class Parametro {
    constructor(public linea: number, public columna: number, public id: string, public tipo: Tip) {
    }
}