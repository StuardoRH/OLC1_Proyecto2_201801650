import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error"; 
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Tip } from "../util/Tip";
import { ExpresionsTypes} from "../util/expresionsTypes";

export class Mayuscula extends Exp {
    constructor(public line: number,public column: number,public expression: Exp) {
        super(line, column, ExpresionsTypes.MAYUSCULA);
    }

    public play(env: enviroment): { value: any, tip: Tip } {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // --- MANEJO DE ERROR CORREGIDO ---
            if (result.tip !== Tip.CADENA) {
                errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO, `La función 'mayuscula' espera una expresión de tipo CADENA, pero se recibió ${Tip[result.tip]}.`));
                //Devolver NULO
                return { value: null, tip: Tip.NULO };
            }

            // Convertir a mayúsculas
            const upperCaseValue = String(result.value).toUpperCase(); // Añadido String() por seguridad
            return { value: upperCaseValue, tip: Tip.CADENA };
        } catch (e: any) { // Capturar si 'play' falla
        errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`Error al ejecutar la función 'mayuscula': ${e.message}`));
        return { value: null, tip: Tip.NULO };
        }
    }
}