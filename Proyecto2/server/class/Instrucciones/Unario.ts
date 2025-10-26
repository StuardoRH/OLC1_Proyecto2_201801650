import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { ErroresTypes } from "../util/ErroresTypes";
import { intructionsTypes } from "../util/instructionsTypes";
import { ReturnTip, Tip } from "../util/Tip";
import { Error } from "../util/Error";
let { errores } = require('../util/out');

export class Unario extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        private unario: string,
        private id: string // Identificador de la variable
    ) {
        super(linea, columna, intructionsTypes.UNITARIA);
    }

    public play(env: enviroment): void {
        switch (this.unario) {
            case "inc":
                this.incrementar(this.id, env);
                break;
            case "dec":
                this.decrementar(this.id, env);
                break;
            case "++":
                this.incrementar(this.id, env);
                break;
            case "--":
                this.decrementar(this.id, env);
                break;
            default:
                errores.push(new Error(this.linea, this.columna, ErroresTypes.SEMANTICO, `Operador unario '${this.unario}' no reconocido`));
                break;
        }
    }

    private incrementar(id: string, env: enviroment): void {
        // Obtener la variable del entorno usando su identificador
        const variable = env.getVar(id, this.linea, this.columna);
        if (!variable) {
            errores.push(new Error(this.linea, this.columna, ErroresTypes.SEMANTICO, `Variable '${id}' no declarada`));
            return;
        }

        // Validar que el tipo de la variable sea compatible (Entero o Decimal)
        if (variable.tipo !== Tip.ENTERO && variable.tipo !== Tip.DECIMAL) {
            errores.push(new Error(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede incrementar una variable de tipo '${Tip[variable.tipo]}'`));
            return;
        }

        // Incrementar el valor
        variable.value += 1;

        // Actualizar la variable en el entorno
        env.setVar(variable.id, variable.value, variable.tipo, this.linea, this.columna);
    }

    private decrementar(id: string, env: enviroment): void {
        // Obtener la variable del entorno usando su identificador
        const variable = env.getVar(id, this.linea, this.columna);
        if (!variable) {
            errores.push(new Error(this.linea, this.columna, ErroresTypes.SEMANTICO, `Variable '${id}' no declarada`));
            return;
        }

        // Validar que el tipo de la variable sea compatible (Entero o Decimal)
        if (variable.tipo !== Tip.ENTERO && variable.tipo !== Tip.DECIMAL) {
            errores.push(new Error(this.linea, this.columna, ErroresTypes.SEMANTICO, `No se puede decrementar una variable de tipo '${Tip[variable.tipo]}'`));
            return;
        }

        // Decrementar el valor
        variable.value -= 1;

        // Actualizar la variable en el entorno
        env.setVar(variable.id, variable.value, variable.tipo, this.linea, this.columna);
    }
}