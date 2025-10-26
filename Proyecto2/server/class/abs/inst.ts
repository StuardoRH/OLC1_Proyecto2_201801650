import { enviroment } from "../env/enviroment";
import { intructionsTypes } from "../util/instructionsTypes";

export abstract class Instruccion {
    constructor(public linea: number, public columna: number, public InstructionType: intructionsTypes) {}
    public abstract play(enviroment: enviroment): any
}