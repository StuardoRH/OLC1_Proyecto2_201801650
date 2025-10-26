import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error"; // Importa tu CustomError (ya está como 'Error')
import { ErroresTypes } from "../util/ErroresTypes";
import { ExpresionsTypes } from "../util/expresionsTypes";
import { errores } from "../util/out";
import { Tip } from "../util/Tip";

export class Minuscula extends Exp {
    constructor(public line: number,public column: number,public expression: Exp ) {
        super(line, column, ExpresionsTypes.MINUSCULA);
    }

    public play(env: enviroment): { value: any, tip: Tip } {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // --- MANEJO DE ERROR ---
            if (result.tip !== Tip.CADENA) {
                errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO, `La función 'minuscula' espera una expresión de tipo CADENA, pero se recibió ${Tip[result.tip]}.`));
                return { value: null, tip: Tip.NULO };
            }
            // Convertir a minúsculas
            const lowerCaseValue = String(result.value).toLowerCase(); 
            return { value: lowerCaseValue, tip: Tip.CADENA };
        } catch (e: any) { // Capturar si 'play' falla
            errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`Error al ejecutar la función 'minuscula': ${e.message}`));
            return { value: null, tip: Tip.NULO };
        }
    }
}