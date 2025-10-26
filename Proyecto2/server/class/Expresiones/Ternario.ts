import { Exp } from '../abs/exp';
import { ExpresionsTypes } from '../util/expresionsTypes';
import { ReturnTip, Tip } from '../util/Tip';
import { enviroment } from '../env/enviroment';

// --- 1. IMPORTAR SISTEMA DE ERRORES ---
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class Ternario extends Exp {
    constructor(linea: number,columna: number,public condicion: Exp,public expVerdadera: Exp,public expFalsa: Exp) {
        super(linea, columna, ExpresionsTypes.TERNARIO);
    }

    public play(env: enviroment): ReturnTip {
        const c = this.condicion.play(env);
        // La condición debe ser booleana
        if (c.tip !== Tip.BOOLEANO) {
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO,`La condición del operador ternario debe ser de tipo BOOLEANO, pero se recibió ${Tip[c.tip]}.`));
            return { value: null, tip: Tip.NULO };
        }
        // Evalúa SOLO la rama necesaria 
        if (Boolean(c.value)) {
            const r = this.expVerdadera.play(env);
            return { value: r.value, tip: r.tip };
        } else {
            const r = this.expFalsa.play(env);
            return { value: r.value, tip: r.tip };
        }
    }
}
