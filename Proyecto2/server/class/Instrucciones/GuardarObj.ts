//GuardarObjetos
import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { intructionsTypes } from "../util/instructionsTypes";

export class GuardarObjeto extends Instruccion{
    constructor(linea: number, columna: number, public id: string, public atributos: []) {
        super(linea, columna, intructionsTypes.CREAR_OBJETO);
    }

    public play(entorno: enviroment) {
        entorno.guardarObjeto(this.id, this.atributos)
    }
}