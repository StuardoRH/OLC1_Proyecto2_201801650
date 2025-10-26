"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoWhileLoop = void 0;
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
const Tip_1 = require("../util/Tip");
const Rel_1 = require("../Expresiones/Rel");
class DoWhileLoop extends inst_1.Instruccion {
    constructor(line, column, body, // Cuerpo del ciclo (instrucciones)
    EXP1, // Expresión 1 (puede ser un identificador o un valor primitivo)
    Condicional, // Operador relacional ("==", "!=", ">", "<", ">=", "<=")
    EXP2 // Expresión 2 (puede ser un identificador o un valor primitivo)
    ) {
        super(line, column, instructionsTypes_1.intructionsTypes.HACER_MIENTRAS);
        this.line = line;
        this.column = column;
        this.body = body;
        this.EXP1 = EXP1;
        this.Condicional = Condicional;
        this.EXP2 = EXP2;
        // Validar que this.body sea un array
        if (!Array.isArray(this.body)) {
            console.error(`Error: 'this.body' no es un array. Valor recibido: ${this.body}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El cuerpo del ciclo 'repetir hasta' debe ser una lista de instrucciones válida.`));
        }
    }
    /**
     * Ejecuta el ciclo "repetir hasta".
     */
    play(env) {
        try {
            // Marcar que estamos en un ciclo DoWhile
            DoWhileLoop.Bandera_Esta_En_Uso_DoWhile = true;
            do {
                // Reiniciar las banderas antes de ejecutar el cuerpo
                DoWhileLoop.Bandera_Detener = false;
                DoWhileLoop.Bandera_Continuar = false;
                DoWhileLoop.Bandera_Retornar = false;
                // Ejecutar el cuerpo del ciclo
                this.executeBlock(this.body, env);
                // Evaluar las banderas globales después de ejecutar el cuerpo
                if (DoWhileLoop.Bandera_Detener || DoWhileLoop.Bandera_Retornar) {
                    console.log("Detener ejecución del ciclo en el dowhileloop.");
                    return; // Salir completamente del ciclo
                }
                // Crear una instancia de Rel para evaluar la condición
                const condition = new Rel_1.Rel(this.line, this.column, this.EXP1, this.Condicional, this.EXP2);
                // Evaluar la condición
                const conditionResult = condition.play(env);
                // Verificar si la condición es booleana
                if (conditionResult.tip !== Tip_1.Tip.BOOLEANO) {
                    throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La condición del ciclo 'repetir hasta' debe ser de tipo booleano.`);
                }
                // Si la condición es verdadera, salir del ciclo
                if (conditionResult.value) {
                    break;
                }
            } while (true); // El ciclo siempre se ejecuta al menos una vez
        }
        catch (e) {
            console.error(`Error al ejecutar el ciclo 'repetir hasta': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar el ciclo 'repetir hasta'.`));
        }
        finally {
            // Desactivar la bandera de ciclo DoWhile al salir
            DoWhileLoop.Bandera_Esta_En_Uso_DoWhile = false;
            DoWhileLoop.Bandera_Detener = false;
            DoWhileLoop.Bandera_Continuar = false;
            DoWhileLoop.Bandera_Retornar = false;
        }
    }
    /**
     * Ejecuta un bloque de instrucciones.
     */
    executeBlock(instructions, env) {
        if (!Array.isArray(instructions)) {
            console.error(`Error: Las instrucciones del cuerpo del ciclo no son válidas.`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El cuerpo del ciclo 'repetir hasta' debe ser una lista de instrucciones válida.`));
            return;
        }
        for (const inst of instructions) {
            if (inst instanceof inst_1.Instruccion) {
                inst.play(env);
                // Si alguna bandera fue activada, detener la ejecución del bloque inmediatamente
                if (DoWhileLoop.Bandera_Detener ||
                    DoWhileLoop.Bandera_Continuar ||
                    DoWhileLoop.Bandera_Retornar) {
                    return;
                }
            }
            else {
                console.error(`Error: La instrucción '${inst}' no es válida.`);
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La instrucción dentro del ciclo 'repetir hasta' no es válida.`));
            }
        }
    }
}
exports.DoWhileLoop = DoWhileLoop;
DoWhileLoop.Bandera_Detener = false; // Bandera para detener el ciclo DoWhile
DoWhileLoop.Bandera_Continuar = false; // Bandera para continuar el ciclo DoWhile
DoWhileLoop.Bandera_Retornar = false; // Bandera para retornar del ciclo DoWhile
DoWhileLoop.Bandera_Esta_En_Uso_DoWhile = false; // Bandera para indicar que el ciclo DoWhile está en uso
