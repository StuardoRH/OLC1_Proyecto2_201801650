//Longitud
import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error"; // Importa tu CustomError (ya está como 'Error')
import { ErroresTypes } from "../util/ErroresTypes";
import { ExpresionsTypes } from "../util/expresionsTypes";
import { errores } from "../util/out";
import { Tip } from "../util/Tip";

export class longitud extends Exp {
    constructor(public line: number,public column: number,public expression: Exp ) {
        super(line, column, ExpresionsTypes.FUNCION_NATIVA);
    }

    public play(env: enviroment): { value: any, tip: Tip } {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // --- MANEJO DE ERROR ---
            if (result.tip !== Tip.CADENA) {
                // Reportar el error
                errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`La función 'longitud' espera una expresión de tipo CADENA, pero se recibió ${Tip[result.tip]}.`));
                
                return { value: null, tip: Tip.NULO };
            }
            // Calcular la longitud
            const length = result.value.length;
            return { value: length, tip: Tip.ENTERO };

        } catch (e: any) {  
            errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`Error al ejecutar la función 'longitud': ${e.message}`));
            return { value: null, tip: Tip.NULO };
        }
    }
}