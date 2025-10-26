import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Tip, ReturnTip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class Return extends Exp {
    constructor(
        linea: number,
        columna: number,
        private expresion: Exp
    ) {
        super(linea, columna, ExpresionsTypes.RETURN);
    }

    public play(entorno: enviroment): ReturnTip {
        try {
            // 1. Evaluar el valor que se va a retornar
            const valorReal: ReturnTip = this.expresion.play(entorno);

            // 2. Devolver una *señal* especial que *contenga* el valor
            // Esta señal será capturada por 'Bloque.ts'
            return {
                tip: Tip.NULO, // La señal en sí no tiene tipo, pero debe cumplir la interfaz
                value: {
                    tipo: ExpresionsTypes.RETURN, // La señal
                    valor: valorReal // El valor real (que es un objeto ReturnTip {value, tip})
                }
            };
        } catch (e: any) {
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error al evaluar la expresión de retorno.`));
            // Retornar nulo en caso de error
            return {
                tip: Tip.NULO,
                value: {
                    tipo: ExpresionsTypes.RETURN,
                    valor: { tip: Tip.NULO, value: null } 
                }
            };
        }
    }
}