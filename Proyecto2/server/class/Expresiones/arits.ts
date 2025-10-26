import { Exp } from '../abs/exp';
import { ExpresionsTypes } from '../util/expresionsTypes';
import { ReturnTip } from '../util/Tip';
import { enviroment } from '../env/enviroment';
import { Tip } from '../util/Tip';
import { suma, resta, multiplicacion, division, potencia, modulo, negacionUnitaria } from '../util/OpAritmeticas';
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class arits extends Exp {
    private Tip: Tip = Tip.NULO;
    constructor(linea: number, columna: number, public exp1: Exp | null, public signo: string, public exp2: Exp) {
        super(linea, columna, ExpresionsTypes.ARITMETICO);
    }
    public play(enviroment: enviroment): ReturnTip {
        switch (this.signo) {
            case '+':
                return this.sum(enviroment);
            case '-':
                if (this.exp1 !== null) {
                    return this.resta(enviroment);
                }
                return this.negacionUnaria(enviroment);
            case '*':
                return this.multiplicacion(enviroment);
            case '/':
                return this.division(enviroment);
            case '^':
                return this.pot(enviroment);
            case '%':
                return this.mod(enviroment);
            default:
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operador aritmético no reconocido: ${this.signo}`));
                return { value: null, tip: Tip.NULO };
        }
    }
    private sum(enviroment: enviroment): ReturnTip {
        let left = this.exp1!.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = suma[left.tip][right.tip];

        if (this.Tip === Tip.INVALIDO || this.Tip === Tip.NULO) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Suma no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}`));
            return { value: null, tip: Tip.NULO };
        }
        
        if (this.Tip === Tip.CADENA) {
            return { value: String(left.value) + String(right.value), tip: this.Tip };
        }
        
        if (left.tip === Tip.CARACTER) left.value = left.value.charCodeAt(0);
        if (right.tip === Tip.CARACTER) right.value = right.value.charCodeAt(0);
        if (left.tip === Tip.BOOLEANO) left.value = left.value ? 1 : 0;
        if (right.tip === Tip.BOOLEANO) right.value = right.value ? 1 : 0;

        if (this.Tip === Tip.ENTERO) {
            return { value: Math.trunc(left.value + right.value), tip: this.Tip };
        }
        if (this.Tip === Tip.DECIMAL) {
            return { value: parseFloat(left.value) + parseFloat(right.value), tip: this.Tip };
        }

        // --- ¡CORREGIDO! ---
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en suma.`));
        return { value: null, tip: Tip.NULO };
    }

    private resta(enviroment: enviroment): ReturnTip {
        let left = this.exp1!.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = resta[left.tip][right.tip];

        if (this.Tip === Tip.INVALIDO || this.Tip === Tip.NULO) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Resta no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}`));
            return { value: null, tip: Tip.NULO };
        }
        
        if (left.tip === Tip.CARACTER) left.value = left.value.charCodeAt(0);
        if (right.tip === Tip.CARACTER) right.value = right.value.charCodeAt(0);
        if (left.tip === Tip.BOOLEANO) left.value = left.value ? 1 : 0;
        if (right.tip === Tip.BOOLEANO) right.value = right.value ? 1 : 0;

        if (this.Tip === Tip.ENTERO) {
            return { value: Math.trunc(left.value - right.value), tip: this.Tip };
        }
        if (this.Tip === Tip.DECIMAL) {
            return { value: parseFloat(left.value) - parseFloat(right.value), tip: this.Tip };
        }
        
        // --- ¡CORREGIDO! ---
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en resta.`));
        return { value: null, tip: Tip.NULO };
    }

    private multiplicacion(enviroment: enviroment): ReturnTip {
        let left = this.exp1!.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = multiplicacion[left.tip][right.tip];

        if (this.Tip === Tip.INVALIDO || this.Tip === Tip.NULO) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Multiplicación no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}`));
            return { value: null, tip: Tip.NULO };
        }
        
        if (left.tip === Tip.CARACTER) left.value = left.value.charCodeAt(0);
        if (right.tip === Tip.CARACTER) right.value = right.value.charCodeAt(0);

        if (this.Tip === Tip.ENTERO) {
            return { value: Math.trunc(left.value * right.value), tip: this.Tip };
        }
        if (this.Tip === Tip.DECIMAL) {
            return { value: parseFloat(left.value) * parseFloat(right.value), tip: this.Tip };
        }

        // --- ¡CORREGIDO! ---
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en multiplicación.`));
        return { value: null, tip: Tip.NULO };
    }

    private division(enviroment: enviroment): ReturnTip {
        let left = this.exp1!.play(enviroment);
        let right = this.exp2.play(enviroment);

        if (Number(right.value) === 0) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error: División por cero.`));
            return { value: null, tip: Tip.NULO };
        }
        
        this.Tip = division[left.tip][right.tip];

        if (this.Tip === Tip.INVALIDO || this.Tip === Tip.NULO) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `División no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}`));
            return { value: null, tip: Tip.NULO };
        }
        
        if (left.tip === Tip.CARACTER) left.value = left.value.charCodeAt(0);
        if (right.tip === Tip.CARACTER) right.value = right.value.charCodeAt(0);

        if (this.Tip === Tip.DECIMAL) {
            return { value: parseFloat(left.value) / parseFloat(right.value), tip: this.Tip };
        }

        // --- ¡CORREGIDO! ---
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en división.`));
        return { value: null, tip: Tip.NULO };
    }

    private pot(enviroment: enviroment): ReturnTip {
        let left = this.exp1!.play(enviroment);
        let right = this.exp2.play(enviroment);
        this.Tip = potencia[left.tip][right.tip];

        if (this.Tip === Tip.INVALIDO || this.Tip === Tip.NULO) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Potencia no válida entre ${Tip[left.tip]} y ${Tip[right.tip]}`));
            return { value: null, tip: Tip.NULO };
        }

        if (this.Tip === Tip.ENTERO) {
            return { value: Math.trunc(Math.pow(left.value, right.value)), tip: this.Tip };
        }
        if (this.Tip === Tip.DECIMAL) {
            return { value: Math.pow(left.value, right.value), tip: this.Tip };
        }

        // --- ¡CORREGIDO! ---
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en potencia.`));
        return { value: null, tip: Tip.NULO };
    }

    private mod(enviroment: enviroment): ReturnTip {
        let left = this.exp1!.play(enviroment);
        let right = this.exp2.play(enviroment);
        
        if (Number(right.value) === 0) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error: Módulo por cero.`));
            return { value: null, tip: Tip.NULO };
        }
        
        this.Tip = modulo[left.tip][right.tip];

        if (this.Tip === Tip.INVALIDO || this.Tip === Tip.NULO) {
            // --- ¡CORREGIDO! ---
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Módulo no válido entre ${Tip[left.tip]} y ${Tip[right.tip]}`));
            return { value: null, tip: Tip.NULO };
        }

        if (this.Tip === Tip.DECIMAL) {
            return { value: parseFloat(left.value) % parseFloat(right.value), tip: this.Tip };
        }

        // --- ¡CORREGIDO! ---
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en módulo.`));
        return { value: null, tip: Tip.NULO };
    }


    private negacionUnaria(enviroment: enviroment): ReturnTip {
        let exp = this.exp2.play(enviroment);
        
        this.Tip = negacionUnitaria[exp.tip]; 
        
        if (this.Tip === Tip.INVALIDO) {
            
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Negación unaria no válida para el tipo ${Tip[exp.tip]}.`));
            return { value: null, tip: Tip.NULO };
        }
        
        if (this.Tip === Tip.ENTERO || this.Tip === Tip.DECIMAL) {
            return { value: -exp.value, tip: this.Tip };
        }
        errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Error inesperado en negación unaria.`));
        return { value: null, tip: Tip.NULO };
    }
}