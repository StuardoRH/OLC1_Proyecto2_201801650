//while lloop
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Exp } from "../abs/exp";
import { Instruccion } from "../abs/inst";
import { intructionsTypes } from "../util/instructionsTypes";
import { Tip } from "../util/Tip";

export class While extends Instruccion {
    public static Bandera_Detener: boolean = false; // Bandera para detener el ciclo While
    public static Bandera_Continuar: boolean = false; // Bandera para continuar el ciclo While
    public static Bandera_Retornar: boolean = false; // Bandera para retornar del ciclo While
    public static Bandera_Esta_En_Uso_While: boolean = false; // Bandera para indicar que el ciclo While está en uso

    constructor(
        public line: number,
        public column: number,
        public condition: Exp, // Condición del ciclo
        public body: Instruccion[] // Cuerpo del ciclo (instrucciones)
    ) {
        super(line, column, intructionsTypes.MIENTRAS);

        // Validar que this.body sea un array
        if (!Array.isArray(this.body)) {
            console.error(`Error: 'this.body' no es un array. Valor recibido: ${this.body}`);
            errores.push(new Error(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `El cuerpo del ciclo 'mientras' debe ser una lista de instrucciones válida.`
            ));
        }
    }

    /**
     * Ejecuta el ciclo "mientras".
     */
    public play(env: enviroment): void {
        try {
            // Marcar que estamos en un ciclo While
            While.Bandera_Esta_En_Uso_While = true;

            while (true) {
                // Evaluar la condición
                const conditionResult = this.condition.play(env);

                // Verificar si la condición es verdadera
                if (conditionResult.tip !== Tip.BOOLEANO) {
                    throw new Error(
                        this.line,
                        this.column,
                        ErroresTypes.SEMANTICO,
                        `La condición del ciclo 'mientras' debe ser de tipo booleano.`
                    );
                }

                if (!conditionResult.value) {
                    break; // Salir del ciclo si la condición es falsa
                }

                // Reiniciar las banderas antes de ejecutar el cuerpo
                While.Bandera_Detener = false;
                While.Bandera_Continuar = false;
                While.Bandera_Retornar = false;

                // Ejecutar el cuerpo del ciclo
                this.executeBlock(this.body, env);

                // Evaluar las banderas globales después de ejecutar el cuerpo
                if (While.Bandera_Detener || While.Bandera_Retornar) {
                    console.log("Detener ejecución del ciclo en el whileloop.");
                    return; // Salir completamente del ciclo
                } else if (While.Bandera_Continuar) {
                    console.log("Continuar ejecución del ciclo en el whileloop.");
                    continue; // Saltar a la siguiente iteración
                }
            }
        } catch (e) {
            console.error(`Error al ejecutar el ciclo 'mientras': ${e}`);
            errores.push(new Error(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `Error al ejecutar el ciclo 'mientras'.`
            ));
        } finally {
            // Desactivar la bandera de ciclo While al salir
            While.Bandera_Esta_En_Uso_While = false;
            While.Bandera_Detener = false;
            While.Bandera_Continuar = false;
            While.Bandera_Retornar = false;
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
                `El cuerpo del ciclo 'mientras' debe ser una lista de instrucciones válida.`
            ));
            return;
        }

        for (const inst of instructions) {
            if (inst instanceof Instruccion) {
                inst.play(env);

                // Si alguna bandera fue activada, detener la ejecución del bloque inmediatamente
                if (
                    While.Bandera_Detener ||
                    While.Bandera_Continuar ||
                    While.Bandera_Retornar
                ) {
                    return;
                }
            } else {
                console.error(`Error: La instrucción '${inst}' no es válida.`);
                errores.push(new Error(
                    this.line,
                    this.column,
                    ErroresTypes.SEMANTICO,
                    `La instrucción dentro del ciclo 'mientras' no es válida.`
                ));
            }
        }
    }
}