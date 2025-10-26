//ForLoop
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Exp } from "../abs/exp";
import { Instruccion } from "../abs/inst";
import { intructionsTypes } from "../util/instructionsTypes";
import { Tip } from "../util/Tip";

export class For extends Instruccion {
    public static Bandera_Detener: boolean = false; // Bandera para detener el ciclo
    public static Bandera_Continuar: boolean = false; // Bandera para continuar el ciclo
    public static Bandera_Retornar: boolean = false; // Bandera para retornar del ciclo
    public static Bandera_Esta_En_Uso_FOr: boolean = false; // Bandera para indicar que el ciclo está en uso

    constructor(
        public line: number,
        public column: number,
        public variable: string,
        public initialValue: Exp,
        public finalValue: Exp,
        public operationType: string, // "incremento" o "decremento"
        public incrementDecrementValue: Exp,
        public body: Instruccion[] // Asegurarse de que sea un array de instrucciones
    ) {
        super(line, column, intructionsTypes.PARA);

        // Validar que this.body sea un array
        if (!Array.isArray(this.body)) {
            console.error(`Error: 'this.body' no es un array. Valor recibido: ${this.body}`);
            errores.push(new Error(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `El cuerpo del ciclo 'para' debe ser una lista de instrucciones válida.`
            ));
        }
    }

    /**
     * Ejecuta el ciclo "para".
     */
    public play(env: enviroment): void {
        try {
            // Marcar que estamos en un ciclo For
            For.Bandera_Esta_En_Uso_FOr = true;

            // Evaluar el valor inicial
            const initialVal = this.initialValue.play(env);

            // Verificar si la variable ya existe
            const existingVar = env.getVar(this.variable, this.line, this.column);
            if (existingVar) {
                // Si existe, actualizar su valor
                env.setVar(this.variable, initialVal.value, initialVal.tip, this.line, this.column);
            } else {
                // Si no existe, crearla
                env.SaveVar(this.variable, initialVal.value, initialVal.tip, this.line, this.column);
            }

            // Obtener el valor final
            const finalVal = this.finalValue.play(env).value;

            // Evaluar el valor del incremento/decremento
            const incDecValue = this.incrementDecrementValue.play(env).value;

            // Ejecutar el ciclo
            while (true) {
                // Obtener el valor actual de la variable de control
                const currentVal = env.getVar(this.variable, this.line, this.column)?.value;

                // Verificar si se debe terminar el ciclo
                if (
                    (this.operationType === "incremento" && currentVal > finalVal) ||
                    (this.operationType === "decremento" && currentVal < finalVal)
                ) {
                    break;
                }

                // Reiniciar las banderas antes de ejecutar el cuerpo
                For.Bandera_Detener = false;
                For.Bandera_Continuar = false;
                For.Bandera_Retornar = false;

                // Ejecutar el cuerpo del ciclo
                this.executeBlock(this.body, env);

                // Evaluar las banderas globales después de ejecutar el cuerpo
                if (For.Bandera_Detener || For.Bandera_Retornar) {
                    console.log("Detener ejecución del ciclo en el foorloop.");
                    return; // Salir completamente del ciclo
                } else if (For.Bandera_Continuar) {
                    console.log("Continuar ejecución del ciclo en el foorloop.");
                    // Incrementar/decrementar y saltar a la siguiente iteración
                    if (this.operationType === "incremento") {
                        env.setVar(this.variable, currentVal + incDecValue, Tip.ENTERO, this.line, this.column);
                    } else {
                        env.setVar(this.variable, currentVal - incDecValue, Tip.ENTERO, this.line, this.column);
                    }
                    continue;
                }

                // Incrementar o decrementar la variable de control
                if (this.operationType === "incremento") {
                    env.setVar(this.variable, currentVal + incDecValue, Tip.ENTERO, this.line, this.column);
                } else if (this.operationType === "decremento") {
                    env.setVar(this.variable, currentVal - incDecValue, Tip.ENTERO, this.line, this.column);
                }
            }
        } catch (e) {
            console.error(`Error al ejecutar el ciclo 'para': ${e}`);
            errores.push(new Error(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `Error al ejecutar el ciclo 'para'.`
            ));
        } finally {
            // Desactivar la bandera de ciclo For al salir
            For.Bandera_Esta_En_Uso_FOr = false;
            For.Bandera_Detener = false;
            For.Bandera_Continuar = false;
            For.Bandera_Retornar = false;
        }
    }

    /**
     * Ejecuta un bloque de instrucciones.
     */
    private executeBlock(instructions: Instruccion[], env: enviroment): void {
        if (!Array.isArray(instructions)) {
            console.error(`Error: Las instrucciones del cuerpo del ciclo no son válidas.`);
            errores.push(new Error(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `El cuerpo del ciclo 'para' debe ser una lista de instrucciones válida.`
            ));
            return;
        }

        for (const inst of instructions) {
            if (inst instanceof Instruccion) {
                inst.play(env);

                // Si alguna bandera fue activada, detener la ejecución del bloque inmediatamente
                if (For.Bandera_Detener || For.Bandera_Continuar || For.Bandera_Retornar) {
                    return;
                }
            } else {
                console.error(`Error: La instrucción '${inst}' no es válida.`);
                errores.push(new Error(
                    this.line,
                    this.column,
                    ErroresTypes.SEMANTICO,
                    `La instrucción dentro del ciclo 'para' no es válida.`
                ));
            }
        }
    }
}