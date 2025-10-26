"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
const Tip_1 = require("../util/Tip");
class While extends inst_1.Instruccion {
    constructor(line, column, condition, // Condición del ciclo
    body // Cuerpo del ciclo (instrucciones)
    ) {
        super(line, column, instructionsTypes_1.intructionsTypes.MIENTRAS);
        this.line = line;
        this.column = column;
        this.condition = condition;
        this.body = body;
        // Validar que this.body sea un array
        if (!Array.isArray(this.body)) {
            console.error(`Error: 'this.body' no es un array. Valor recibido: ${this.body}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El cuerpo del ciclo 'mientras' debe ser una lista de instrucciones válida.`));
        }
    }
    /**
     * Ejecuta el ciclo "mientras".
     */
    play(env) {
        try {
            // Marcar que estamos en un ciclo While
            While.Bandera_Esta_En_Uso_While = true;
            while (true) {
                // Evaluar la condición
                const conditionResult = this.condition.play(env);
                // Verificar si la condición es verdadera
                if (conditionResult.tip !== Tip_1.Tip.BOOLEANO) {
                    throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La condición del ciclo 'mientras' debe ser de tipo booleano.`);
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
                }
                else if (While.Bandera_Continuar) {
                    console.log("Continuar ejecución del ciclo en el whileloop.");
                    continue; // Saltar a la siguiente iteración
                }
            }
        }
        catch (e) {
            console.error(`Error al ejecutar el ciclo 'mientras': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar el ciclo 'mientras'.`));
        }
        finally {
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
    executeBlock(instructions, env) {
        if (!Array.isArray(instructions)) {
            console.error(`Error: Las instrucciones del cuerpo del ciclo no son válidas.`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El cuerpo del ciclo 'mientras' debe ser una lista de instrucciones válida.`));
            return;
        }
        for (const inst of instructions) {
            if (inst instanceof inst_1.Instruccion) {
                inst.play(env);
                // Si alguna bandera fue activada, detener la ejecución del bloque inmediatamente
                if (While.Bandera_Detener ||
                    While.Bandera_Continuar ||
                    While.Bandera_Retornar) {
                    return;
                }
            }
            else {
                console.error(`Error: La instrucción '${inst}' no es válida.`);
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La instrucción dentro del ciclo 'mientras' no es válida.`));
            }
        }
    }
}
exports.While = While;
While.Bandera_Detener = false; // Bandera para detener el ciclo While
While.Bandera_Continuar = false; // Bandera para continuar el ciclo While
While.Bandera_Retornar = false; // Bandera para retornar del ciclo While
While.Bandera_Esta_En_Uso_While = false; // Bandera para indicar que el ciclo While está en uso
