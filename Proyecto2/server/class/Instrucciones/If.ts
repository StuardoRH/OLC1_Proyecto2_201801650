import { Instruccion } from "../abs/inst";
import { Exp } from "../abs/exp";
import { intructionsTypes } from "../util/instructionsTypes";
import { enviroment } from "../env/enviroment";
import { ErroresTypes } from "../util/ErroresTypes";
import { Tip } from "../util/Tip";
import { Error } from "../util/Error";
let { errores } = require('../util/out');

export class If extends Instruccion {
    constructor(
        public line: number,
        public column: number,
        public condition: Exp,
        public ifBody: Instruccion[],
        public elseBody: Instruccion[] | null = null,
        public elseIfs: {condition: Exp, body: Instruccion[]}[] = []
    ) {
        super(line, column, intructionsTypes.SI);
    }

    public play(env: enviroment): void {
        try {
            // Validación de condición principal
            if (!this.condition) {
                throw new Error(this.line, this.column, ErroresTypes.SEMANTICO, "La condición del 'si' no puede estar vacía");
            }

            // Evaluar condición principal
            const mainConditionResult = this.condition.play(env);
            
            // Validar que la condición devolvió un valor
            if (mainConditionResult === null || mainConditionResult === undefined) {
                throw new Error(this.line, this.column, ErroresTypes.SEMANTICO, 
                    "La condición del 'si' no devolvió un valor válido. ¿La variable está declarada?");
            }

            // Validar tipo booleano
            if (mainConditionResult.tip !== Tip.BOOLEANO) {
                throw new Error(
                    this.line, 
                    this.column, 
                    ErroresTypes.SEMANTICO, 
                    `Se esperaba condición booleana pero se obtuvo ${Tip[mainConditionResult.tip]}`
                );
            }

            // Ejecutar bloque if si la condición es verdadera
            if (mainConditionResult.value === true) {
                //console.log('el tipo de ifbody es: ', typeof this.ifBody);
                this.executeBlock(this.ifBody, env);
                return;
            }

            // Evaluar else ifs
            for (const elseIf of this.elseIfs) {
                const elseIfResult = elseIf.condition.play(env);
                
                // Validaciones para else if
                if (elseIfResult === null || elseIfResult === undefined) {
                    errores.push(new Error(this.line, this.column, ErroresTypes.SEMANTICO, 
                        "La condición del 'o si' no devolvió un valor válido"));
                    continue;
                }

                if (elseIfResult.tip !== Tip.BOOLEANO) {
                    errores.push(new Error(
                        this.line, 
                        this.column, 
                        ErroresTypes.SEMANTICO, 
                        `La condición del 'o si' debe ser booleana (se obtuvo ${Tip[elseIfResult.tip]})`
                    ));
                    continue;
                }

                if (elseIfResult.value === true) {
                   // console.log('el tipo de body es: ', typeof elseIf.body);
                    this.executeBlock(elseIf.body, env);
                    return;
                }
            }

            // Ejecutar else si existe
            if (this.elseBody) {
                this.executeBlock(this.elseBody, env);
            }

        } catch (error) {
            if (error instanceof Error) {
                errores.push(error);
            } else {
                errores.push(new Error(this.line, this.column, ErroresTypes.SEMANTICO, 
                    `Error inesperado en la estructura condicional: ${error}`));
            }
        }
    }

    private executeBlock(instructions: Instruccion[], env: enviroment): void {
        for (const inst of instructions) {
            try {
                inst.play(env);
            } catch (error) {
                if (error instanceof Error) {
                    errores.push(error);
                } else {
                    errores.push(new Error(this.line, this.column, ErroresTypes.SEMANTICO, 
                        `Error al ejecutar instrucción: ${error}`));
                }
            }
        }
    }
}