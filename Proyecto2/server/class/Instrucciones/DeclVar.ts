import { Exp } from "../abs/exp";
import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { Tip, ReturnTip } from "../util/Tip";
import { intructionsTypes } from "../util/instructionsTypes";
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
let { errores } = require('../util/out');
//DeclVar
export class DeclVar extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        private id: string | string[],
        private tipo: Tip | Tip[],
        private valor: Exp | Exp[] | null
    ) {
        super(linea, columna, intructionsTypes.CREAR_VARIABLE);
    }

    public play(env: enviroment): void {
        try {
            // Normalizar a arrays
            const ids = Array.isArray(this.id) ? this.id : [this.id];
            const tipos = Array.isArray(this.tipo) ? this.tipo : [this.tipo];

            // Validar consistencia de tipos
            if (tipos.length > 1 && tipos.length !== ids.length) {
                errores.push(new CustomError(
                    this.linea,
                    this.columna,
                    ErroresTypes.SEMANTICO,
                    `Número de tipos (${tipos.length}) no coincide con variables (${ids.length})`
                ));
                return;
            }

            // Validar unicidad de variables
            this.validarVariablesUnicas(env, ids);

            // Procesar valores
            if (!this.valor) {
                this.declararSinValor(env, ids, tipos);
            } else {
                this.declararConValor(env, ids, tipos);
            }
        } catch (error: unknown) {
            this.handleError(error);
        }
    }

    private validarVariablesUnicas(env: enviroment, ids: string[]): void {
        const duplicados = ids.filter(id => {
            const variable = env.getVar(id, this.linea, this.columna);
            return variable !== null && variable !== undefined;
        });

        if (duplicados.length > 0) {
            errores.push(new CustomError(
                this.linea,
                this.columna,
                ErroresTypes.SEMANTICO,
                `Variables ya declaradas: ${duplicados.join(', ')}`
            ));
        }
    }

    private declararSinValor(env: enviroment, ids: string[], tipos: Tip[]): void {
        ids.forEach((id, index) => {
            const tipoActual = tipos[index] ?? tipos[0];
            const valorPorDefecto = this.getValorPorDefecto(tipoActual);

            if (env) {
                env.SaveVar(id, valorPorDefecto, tipoActual, this.linea, this.columna);
            }
        });
    }

    private declararConValor(env: enviroment, ids: string[], tipos: Tip[]): void {
        const valores = Array.isArray(this.valor) ? this.valor : [this.valor];

        if (valores.length !== ids.length) {
            errores.push(new CustomError(
                this.linea,
                this.columna,
                ErroresTypes.SEMANTICO,
                `Número de valores (${valores.length}) no coincide con variables (${ids.length})`
            ));
            return;
        }

        ids.forEach((id, index) => {
            const tipoActual = tipos[index] ?? tipos[0];
            const valorExp = valores[index];

            if (!valorExp) {
                errores.push(new CustomError(
                    this.linea,
                    this.columna,
                    ErroresTypes.SEMANTICO,
                    `Expresión no definida para variable '${id}'`
                ));
                return;
            }

            const resultado = valorExp.play(env);

            // Validar que el tipo del valor coincida con el tipo declarado
            if (!this.validarTipo(resultado, tipoActual)) {
                errores.push(new CustomError(
                    this.linea,
                    this.columna,
                    ErroresTypes.SEMANTICO,
                    `Error de tipo en línea ${this.linea}, columna ${this.columna}: ` +
                    `La variable '${id}' es de tipo '${Tip[tipoActual]}', pero se recibió un valor de tipo '${Tip[resultado.tip]}'`
                ));
                return;
            }

            if (env) {
                env.SaveVar(id, resultado.value, tipoActual, this.linea, this.columna);
            }
        });
    }

    private handleError(error: unknown): void {
        let errorMessage = `Error en línea ${this.linea}, columna ${this.columna}: `;

        if (error instanceof Error) {
            errorMessage += error.message; // Retrieve the error message using the 'message' property
            errores.push(error); // Agregar el error a la lista global
        } else {
            errorMessage += "Error desconocido al declarar variable";
            errores.push(new Error(
                `${errorMessage} Línea: ${this.linea}, Columna: ${this.columna}`
            ));
        }

        console.error(errorMessage);
    }

    private getValorPorDefecto(tipo: Tip): any {
        switch (tipo) {
            case Tip.ENTERO:
                return 0;
            case Tip.DECIMAL:
                return 0.0;
            case Tip.BOOLEANO:
                return true; // Valor por defecto para booleanos
            case Tip.CARACTER:
                return '\0';
            case Tip.CADENA:
                return "";
            case Tip.NULO:
                return null;
            case Tip.INVALIDO:
                return null;
            default:
                errores.push(new Error(
                    `Error en línea ${this.linea}, columna ${this.columna}: Tipo desconocido: ${tipo}`
                ));
                return null;
        }
    }

    private validarTipo(resultado: ReturnTip, tipoEsperado: Tip): boolean {
        // Verificar si los tipos coinciden exactamente
        if (resultado.tip !== tipoEsperado) {
            return false;
        }

        // Validaciones adicionales para tipos específicos
        switch (tipoEsperado) {
            case Tip.BOOLEANO:
                // Solo permitir valores booleanos
                if (typeof resultado.value !== "boolean") {
                    return false;
                }
                break;

            case Tip.CADENA:
                // Asegurarse de que el valor sea una cadena
                if (typeof resultado.value !== "string") {
                    return false;
                }
                break;

            case Tip.ENTERO:
                // Asegurarse de que el valor sea un número entero
                if (!Number.isInteger(resultado.value)) {
                    return false;
                }
                break;

            case Tip.DECIMAL:
                // Asegurarse de que el valor sea un número decimal
                if (typeof resultado.value !== "number") {
                    return false;
                }
                break;

            case Tip.CARACTER:
                // Asegurarse de que el valor sea un carácter
                if (typeof resultado.value !== "string" || resultado.value.length !== 1) {
                    return false;
                }
                break;

            case Tip.NULO:
                // Aceptar solo valores nulos
                if (resultado.value !== null) {
                    return false;
                }
                break;

            default:
                // Para otros tipos, confiar en la comparación básica de tipos
                break;
        }

        return true; // Si pasa todas las validaciones, el tipo es correcto
    }

}