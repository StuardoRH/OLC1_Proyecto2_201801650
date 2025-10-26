import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { Exp } from "../abs/exp";
import { intructionsTypes } from "../util/instructionsTypes";
import { ReturnTip, Tip } from "../util/Tip";
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
let { errores } = require('../util/out');

export class Asignaciones extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        private ids: string[],
        private valor: Exp | Exp[]
    ) {
        super(linea, columna, intructionsTypes.ASIGNAR_VALOR);
    }

    public play(env: enviroment): any {
        try {
            // Caso asignación múltiple
            if (Array.isArray(this.valor)) {
                if (this.ids.length !== this.valor.length) {
                    errores.push(new CustomError(
                        this.linea,
                        this.columna,
                        ErroresTypes.SEMANTICO,
                        `Número de variables (${this.ids.length}) no coincide con valores (${this.valor.length})`
                    ));
                    return;
                }

                this.ids.forEach((id, index) => {
                    const valorExp = (this.valor as Exp[])[index];
                    const valorEvaluado = valorExp.play(env);
                    this.validarYAsignar(env, id, valorEvaluado);
                });
                return;
            }

            // Caso asignación simple
            const resultado = (this.valor as Exp).play(env);
            this.validarYAsignar(env, this.ids[0], resultado);

        } catch (error: unknown) {
            this.manejarError(error);
        }
    }

    private validarYAsignar(env: enviroment, id: string, valor: ReturnTip): void {
        const simbolo = env.getVar(id, this.linea, this.columna);

        // Validar que la variable exista
        if (!simbolo) {
            errores.push(new CustomError(
                this.linea,
                this.columna,
                ErroresTypes.SEMANTICO,
                `Variable '${id}' no declarada`
            ));
            return;
        }

        // Validar compatibilidad de tipos
        if (simbolo.tipo !== valor.tip) {
            errores.push(new CustomError(
                this.linea,
                this.columna,
                ErroresTypes.SEMANTICO,
                `Error de tipo en línea ${this.linea}, columna ${this.columna}: ` +
                `La variable '${id}' es de tipo '${Tip[simbolo.tipo]}', pero se intentó asignar un valor de tipo '${Tip[valor.tip]}'`
            ));
            return;
        }

        // Guardar el valor en el entorno
        env.setVar(id, valor.value, simbolo.tipo, this.linea, this.columna);
    }

    private manejarError(error: unknown): void {
        let errorMessage = `Error en línea ${this.linea}, columna ${this.columna}: `;

        if (error instanceof Error) {
            errorMessage += error.message; // Obtener el mensaje de error usando la propiedad 'message'
            errores.push(new CustomError(
                this.linea,
                this.columna,
                ErroresTypes.SEMANTICO,
                errorMessage
            ));
        } else {
            errorMessage += "Error desconocido en asignación";
            errores.push(new CustomError(
                this.linea,
                this.columna,
                ErroresTypes.SEMANTICO,
                errorMessage
            ));
        }

        console.error(errorMessage);
    }
}