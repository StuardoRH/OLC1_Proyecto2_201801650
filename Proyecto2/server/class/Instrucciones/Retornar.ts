import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { intructionsTypes } from "../util/instructionsTypes";
import { ExpresionsTypes } from "../util/expresionsTypes"; // Importante para la señal

export class Retornar extends Instruccion {
    constructor(
        public line: number,
        public column: number
        // ¡CORREGIDO! No se recibe 'value'
    ) {
        super(line, column, intructionsTypes.RETORNAR);
    }

    /**
     * 'play' debe *retornar* un objeto especial (una señal)
     */
    public play(env: enviroment): any {
        // Esta señal será capturada por 'Bloque.ts' o 'LlamadaFUncion.ts'
        return {
            tipo: ExpresionsTypes.RETURN, // Una señal para identificar que es un 'return'
            valor: null, // No hay valor de retorno (void)
            tip: null // No aplica
        };
    }
}