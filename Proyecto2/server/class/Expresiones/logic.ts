import { Exp } from '../abs/exp';
import { ExpresionsTypes } from '../util/expresionsTypes';
import { ReturnTip } from '../util/Tip';
import { enviroment } from '../env/enviroment';
import { Tip } from '../util/Tip';

// --- IMPORTAR SISTEMA DE ERRORES ---
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class logic extends Exp {
    private Tip: Tip = Tip.NULO;
    constructor(linea: number, columna: number, public exp1: Exp | null, public signo: string, public exp2: Exp){
        super(linea, columna, ExpresionsTypes.LOGICO);
    }

    public play(enviroment: enviroment): ReturnTip{
        switch(this.signo){
            case '&&':
                return this.and(enviroment);
            case '||':
                return this.or(enviroment);
            case '!':
                return this.not(enviroment);
            default:
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operador lógico no reconocido: ${this.signo}`));
                return { value: null, tip: Tip.NULO };
            }
        }

    private and(enviroment: enviroment): ReturnTip{
        let left = this.exp1!.play(enviroment); // Sabemos que exp1 no es null aquí
        let right = this.exp2.play(enviroment);

        // --- VALIDACIÓN SEMANTICA ---
        if (left.tip !== Tip.BOOLEANO || right.tip !== Tip.BOOLEANO) {
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operación AND no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}. Ambos deben ser BOOLEANO.`));
            return { value: null, tip: Tip.NULO };
        }

        return {value: left.value && right.value, tip: Tip.BOOLEANO};
    }

    private or(enviroment: enviroment): ReturnTip{
        let left = this.exp1!.play(enviroment); // Sabemos que exp1 no es null aquí
        let right = this.exp2.play(enviroment);

        // --- VALIDACIÓN SEMANTICA ---
        if (left.tip !== Tip.BOOLEANO || right.tip !== Tip.BOOLEANO) {
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operación OR no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}. Ambos deben ser BOOLEANO.`));
            return { value: null, tip: Tip.NULO };
        }
        
        return {value: left.value || right.value, tip: Tip.BOOLEANO};
    }

    private not(enviroment: enviroment): ReturnTip{
        let exp = this.exp2.play(enviroment); // Jison pone la expresión en exp2

        // ---VALIDACIÓN SEMANTICA ---
        if (exp.tip !== Tip.BOOLEANO) {
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operación NOT no válida para el tipo ${Tip[exp.tip]}. Debe ser BOOLEANO.`));
            return { value: null, tip: Tip.NULO };
        }


        return {value: !exp.value, tip: Tip.BOOLEANO};
    }
}