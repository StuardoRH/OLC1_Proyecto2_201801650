import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { Parametro } from "../Expresiones/Parametro";
import { intructionsTypes } from "../util/instructionsTypes";

export class Procedimiento extends Instruccion{
    constructor(linea: number, columna: number, public nombreProce: string, public tipo: string, public parametros: Parametro[], public instrucciones: Instruccion[]) {
        super(linea, columna, intructionsTypes.PROCEDIMIENTO);
    }

    public play(entorno: enviroment) {
        entorno.guardarProcedimiento(this.nombreProce, this, this.linea, this.columna);
    }
}