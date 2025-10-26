import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error"; // Importa tu CustomError (ya está como 'Error')
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Tip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";

export class Truncar extends Exp {
    constructor(public line: number,public column: number,public expression: Exp ) {
        super(line, column, ExpresionsTypes.FUNCION_NATIVA);
    }

    public play(env: enviroment): { value: any, tip: Tip } {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // --- MANEJO DE ERROR ---
            if (result.tip !== Tip.DECIMAL && result.tip !== Tip.ENTERO) {
                errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`La función 'truncar' espera una expresión de tipo DECIMAL o ENTERO, pero se recibió ${Tip[result.tip]}.`));
                return { value: null, tip: Tip.NULO };
            }
            // Truncar el número
            const truncatedValue = Math.trunc(result.value);
            return { value: truncatedValue, tip: Tip.ENTERO };
        } catch (e: any) {
            errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`Error al ejecutar la función 'truncar': ${e.message}`));
            return { value: null, tip: Tip.NULO };
        }
    }
}