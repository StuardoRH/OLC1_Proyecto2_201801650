import { enviroment } from "../env/enviroment";
import { Error as CustomError } from "../util/Error"; // Renombrado para evitar conflicto
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Exp } from "../abs/exp";
import { Instruccion } from "../abs/inst";
import { intructionsTypes } from "../util/instructionsTypes";
import { Tip } from "../util/Tip";


export class DoWhile extends Instruccion {
    public static Bandera_Detener: boolean = false;
    public static Bandera_Continuar: boolean = false;
    public static Bandera_Retornar: boolean = false;
    public static Bandera_Esta_En_Uso_DoWhile: boolean = false;

    constructor(
        public line: number,
        public column: number,
        public body: Instruccion[], // Cuerpo del ciclo (instrucciones)
        public condition: Exp      // ¡CAMBIO AQUÍ! Se recibe una sola EXPR
    ) {
        super(line, column, intructionsTypes.HACER_MIENTRAS);

        if (!Array.isArray(this.body)) {
            console.error(`Error: 'this.body' no es un array. Valor recibido: ${this.body}`);
            errores.push(new CustomError(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `El cuerpo del ciclo 'repetir hasta' debe ser una lista de instrucciones válida.`
            ));
        }
    }

    public play(env: enviroment): void {
        try {
            DoWhile.Bandera_Esta_En_Uso_DoWhile = true;

            do {
                DoWhile.Bandera_Detener = false;
                DoWhile.Bandera_Continuar = false;
                DoWhile.Bandera_Retornar = false;

                // Crear un nuevo entorno para el cuerpo del bucle
                const loopEnv = new enviroment(env, "Loop DoWhile");
                this.executeBlock(this.body, loopEnv);

                if (DoWhile.Bandera_Detener || DoWhile.Bandera_Retornar) {
                    console.log("Detener ejecución del ciclo en el dowhileloop.");
                    return; // Salir completamente del ciclo
                }
                
                if (DoWhile.Bandera_Continuar) {
                    // Si es 'continuar', simplemente saltamos al final y re-evaluamos
                    // (En un do-while, 'continuar' te lleva a la condición)
                }

                // ¡CAMBIO AQUÍ! Evaluar la expresión directamente
                const conditionResult = this.condition.play(env);

                if (conditionResult.tip !== Tip.BOOLEANO) {
                    throw new CustomError( // Usar CustomError
                        this.line,
                        this.column,
                        ErroresTypes.SEMANTICO,
                        `La condición del ciclo 'repetir hasta' debe ser de tipo booleano.`
                    );
                }

                // El ciclo 'repetir... hasta que (condicion)' se detiene cuando la condición es VERDADERA
                if (conditionResult.value) {
                    break;
                }
                
            } while (true); // La condición de salida está en el 'break'

        } catch (e: any) {
            console.error(`Error al ejecutar el ciclo 'repetir hasta': ${e.message || e}`);
            // Si ya es un CustomError, solo lo agregamos
            if (e instanceof CustomError) {
                errores.push(e);
            } else {
                errores.push(new CustomError(
                    this.line,
                    this.column,
                    ErroresTypes.SEMANTICO,
                    `Error al ejecutar el ciclo 'repetir hasta'.`
                ));
            }
        } finally {
            DoWhile.Bandera_Esta_En_Uso_DoWhile = false;
            DoWhile.Bandera_Detener = false;
            DoWhile.Bandera_Continuar = false;
            DoWhile.Bandera_Retornar = false;
        }
    }

    private executeBlock(instructions: Instruccion[], env: enviroment): void {
        if (!Array.isArray(instructions)) {
            console.error(`Error: Las instrucciones del cuerpo del ciclo no son válidas.`);
            errores.push(new CustomError(
                this.line,
                this.column,
                ErroresTypes.SEMANTICO,
                `El cuerpo del ciclo 'repetir hasta' debe ser una lista de instrucciones válida.`
            ));
            return;
        }

        for (const inst of instructions) {
            if (inst instanceof Instruccion) {
                inst.play(env);

                if (
                    DoWhile.Bandera_Detener ||
                    DoWhile.Bandera_Continuar ||
                    DoWhile.Bandera_Retornar
                ) {
                    return;
                }
            } else {
                console.error(`Error: La instrucción '${inst}' no es válida.`);
                errores.push(new CustomError(
                    this.line,
                    this.column,
                    ErroresTypes.SEMANTICO,
                    `La instrucción dentro del ciclo 'repetir hasta' no es válida.`
                ));
            }
        }
    }
}