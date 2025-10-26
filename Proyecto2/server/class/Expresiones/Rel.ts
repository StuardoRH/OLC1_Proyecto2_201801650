import { Exp } from '../abs/exp';
import { ExpresionsTypes } from '../util/expresionsTypes';
import { ReturnTip } from '../util/Tip';
import { enviroment } from '../env/enviroment';
import { Tip } from '../util/Tip';

// --- 1. IMPORTAR SISTEMA DE ERRORES ---
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class Rel extends Exp {
        private Tip: Tip = Tip.NULO;
        constructor(linea: number, columna: number, public exp1: Exp, public signo: string, public exp2: Exp){
                super(linea, columna, ExpresionsTypes.RELACIONAL);
        }
        public play(enviroment: enviroment): ReturnTip{
                switch(this.signo){
                        case '==':
                                return this.igual(enviroment);
                        case '!=':
                                return this.dif(enviroment);
                        case '>=':
                                return this.MayIgual(enviroment);
                        case '<=':
                                return this.MenIgual(enviroment);
                        case '<':
                                return this.Men(enviroment);
                        case '>':
                                return this.May(enviroment);
                        default:
                                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operador relacional no reconocido: ${this.signo}`));
                                return { value: null, tip: Tip.NULO };
                        }
        }
    // --- 3. LÓGICA DE COMPARACIÓN  ---
    /**
     * Obtiene el valor numérico para comparación (maneja ASCII)
     */
    private getNumericValue(exp: ReturnTip): number {
        if (exp.tip === Tip.CARACTER) {
            return String(exp.value).charCodeAt(0); // Convertir 'A' -> 65
        }
        return Number(exp.value); // Convierte 5 -> 5, 5.5 -> 5.5
    }

    /**
     * Verifica si un tipo es numérico o comparable a numérico
     */
    private isNumericLike(tip: Tip): boolean {
        return tip === Tip.ENTERO || tip === Tip.DECIMAL || tip === Tip.CARACTER;
    }
        private igual(enviroment: enviroment): ReturnTip{
        let left = this.exp1.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = Tip.BOOLEANO;

        if (this.isNumericLike(left.tip) && this.isNumericLike(right.tip)) {
                let numLeft = this.getNumericValue(left);
                let numRight = this.getNumericValue(right);
                return { value: numLeft === numRight, tip: this.Tip };
        } 
        if (left.tip === Tip.CADENA && right.tip === Tip.CADENA) {
                return { value: String(left.value) === String(right.value), tip: this.Tip };
        }
        if (left.tip === Tip.BOOLEANO && right.tip === Tip.BOOLEANO) {
                return { value: left.value === right.value, tip: this.Tip };
        }
        // Error: tipos no comparables
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede comparar '==' entre ${Tip[left.tip]} y ${Tip[right.tip]}.`));
        return { value: null, tip: Tip.NULO };
}

        private dif(enviroment: enviroment): ReturnTip{
                let left = this.exp1.play(enviroment);
                let right = this.exp2.play(enviroment);
                this.Tip = Tip.BOOLEANO;

                if (this.isNumericLike(left.tip) && this.isNumericLike(right.tip)) {
                        let numLeft = this.getNumericValue(left);
                        let numRight = this.getNumericValue(right);
                        return { value: numLeft !== numRight, tip: this.Tip };
                } 
                if (left.tip === Tip.CADENA && right.tip === Tip.CADENA) {
                        return { value: String(left.value) !== String(right.value), tip: this.Tip };
                }
                if (left.tip === Tip.BOOLEANO && right.tip === Tip.BOOLEANO) {
                        return { value: left.value !== right.value, tip: this.Tip };
                }
                // Error: tipos no comparables
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede comparar '!=' entre ${Tip[left.tip]} y ${Tip[right.tip]}.`));
                return { value: null, tip: Tip.NULO };
        }
        private MayIgual(enviroment: enviroment): ReturnTip{
                let left = this.exp1.play(enviroment);
                let right = this.exp2.play(enviroment);
                this.Tip = Tip.BOOLEANO;
                if (this.isNumericLike(left.tip) && this.isNumericLike(right.tip)) {
                        let numLeft = this.getNumericValue(left);
                        let numRight = this.getNumericValue(right);
                        return { value: numLeft >= numRight, tip: this.Tip };
                } 
                if (left.tip === Tip.CADENA && right.tip === Tip.CADENA) {
                        return { value: String(left.value) >= String(right.value), tip: this.Tip };
                }
                // Error: > / < / >= / <= no son válidos para Booleano
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede comparar '>=' entre ${Tip[left.tip]} y ${Tip[right.tip]}.`));
                return { value: null, tip: Tip.NULO };
        }
        private MenIgual(enviroment: enviroment): ReturnTip{
                let left = this.exp1.play(enviroment);
                let right = this.exp2.play(enviroment);
                this.Tip = Tip.BOOLEANO;
                if (this.isNumericLike(left.tip) && this.isNumericLike(right.tip)) {
                        let numLeft = this.getNumericValue(left);
                        let numRight = this.getNumericValue(right);
                        return { value: numLeft <= numRight, tip: this.Tip };
                } 
                if (left.tip === Tip.CADENA && right.tip === Tip.CADENA) {
                        return { value: String(left.value) <= String(right.value), tip: this.Tip };
                } 
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede comparar '<=' entre ${Tip[left.tip]} y ${Tip[right.tip]}.`));
                return { value: null, tip: Tip.NULO };
        }
        private Men(enviroment: enviroment): ReturnTip{
                let left = this.exp1.play(enviroment);
                let right = this.exp2.play(enviroment);
                this.Tip = Tip.BOOLEANO;
                if (this.isNumericLike(left.tip) && this.isNumericLike(right.tip)) {
                        let numLeft = this.getNumericValue(left);
                        let numRight = this.getNumericValue(right);
                        return { value: numLeft < numRight, tip: this.Tip };
                } 
                if (left.tip === Tip.CADENA && right.tip === Tip.CADENA) {
                        return { value: String(left.value) < String(right.value), tip: this.Tip };
                }
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede comparar '<' entre ${Tip[left.tip]} y ${Tip[right.tip]}.`));
                return { value: null, tip: Tip.NULO };
        }
        private May(enviroment: enviroment): ReturnTip{
                let left = this.exp1.play(enviroment);
                let right = this.exp2.play(enviroment);
                this.Tip = Tip.BOOLEANO;
                if (this.isNumericLike(left.tip) && this.isNumericLike(right.tip)) {
                        let numLeft = this.getNumericValue(left);
                        let numRight = this.getNumericValue(right);
                        return { value: numLeft > numRight, tip: this.Tip };
                }        
                if (left.tip === Tip.CADENA && right.tip === Tip.CADENA) {
                        return { value: String(left.value) > String(right.value), tip: this.Tip };
                }
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede comparar '>' entre ${Tip[left.tip]} y ${Tip[right.tip]}.`));
                return { value: null, tip: Tip.NULO };
        }
}