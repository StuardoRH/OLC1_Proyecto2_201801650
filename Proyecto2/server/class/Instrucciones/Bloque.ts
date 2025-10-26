import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { intructionsTypes } from "../util/instructionsTypes";

export class Bloque extends Instruccion{
    constructor(linea: number, columna: number, private instrucciones: Instruccion[]) {
        super(linea, columna, intructionsTypes.LLAMADA_BLOQUE_INSTRUCCIONES);
    }

    public play(entorno: enviroment) {
        const nuevoEntorno = new enviroment(entorno, entorno.nombre)
        for (const instruccion of this.instrucciones) {
            try {
                const result = instruccion.play(nuevoEntorno);
                if (result) {
                    return result;
                }
            } catch (error) {}
        }
    }
}