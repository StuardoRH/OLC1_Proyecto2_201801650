import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { For } from "./For";
import { While } from "./While";
import { DoWhile } from "./DoWhile";
import { intructionsTypes } from "../util/instructionsTypes";

export class Continuar extends Instruccion {
    constructor(
        public line: number,
        public column: number
    ) {
        super(line, column, intructionsTypes.CONTINUAR);
    }

    public play(env: enviroment): void {
        if (For.Bandera_Esta_En_Uso_FOr) {
            For.Bandera_Continuar = true;
            console.log("Activando bandera de continuar en ForLoop.");
        } else if (While.Bandera_Esta_En_Uso_While) {
            While.Bandera_Continuar = true;
            console.log("Activando bandera de continuar en WhileLoop.");
        } else if (DoWhile.Bandera_Esta_En_Uso_DoWhile) {
            DoWhile.Bandera_Continuar = true;
            console.log("Activando bandera de continuar en DoWhileLoop.");
        } else {
            console.error("Error: 'continuar' fuera de un ciclo.");
        }
    }
}