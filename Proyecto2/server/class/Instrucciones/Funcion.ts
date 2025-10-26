import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { Parametro } from "../Expresiones/Parametro";
import { intructionsTypes } from "../util/instructionsTypes";
import { Tip } from "../util/Tip";

export class Funcion extends Instruccion{
    constructor(linea: number, columna: number, public nombreFuncion: string, public tipo: Tip, public parametros: Parametro[], public instrucciones: Instruccion[]) {
        super(linea, columna, intructionsTypes.FUNCION);
    }

    public play(entorno: enviroment) {
        entorno.guardarFuncion(this.nombreFuncion, this, this.linea, this.columna);
    }
}