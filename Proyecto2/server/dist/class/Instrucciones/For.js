"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForLoop = void 0;
const Error_1 = require("../util/Error");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
const Tip_1 = require("../util/Tip");
class ForLoop extends inst_1.Instruccion {
    constructor(line, column, variable, initialValue, finalValue, operationType, // "incremento" o "decremento"
    incrementDecrementValue, body // Asegurarse de que sea un array de instrucciones
    ) {
        super(line, column, instructionsTypes_1.intructionsTypes.SI);
        this.line = line;
        this.column = column;
        this.variable = variable;
        this.initialValue = initialValue;
        this.finalValue = finalValue;
        this.operationType = operationType;
        this.incrementDecrementValue = incrementDecrementValue;
        this.body = body;
        // Validar que this.body sea un array
        if (!Array.isArray(this.body)) {
            console.error(`Error: 'this.body' no es un array. Valor recibido: ${this.body}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El cuerpo del ciclo 'para' debe ser una lista de instrucciones válida.`));
        }
    }
    /**
     * Ejecuta el ciclo "para".
     */
    play(env) {
        try {
            // Marcar que estamos en un ciclo For
            ForLoop.Bandera_Esta_En_Uso_FOr = true;
            // Evaluar el valor inicial
            const initialVal = this.initialValue.play(env);
            // Verificar si la variable ya existe
            const existingVar = env.getVar(this.variable, this.line, this.column);
            if (existingVar) {
                // Si existe, actualizar su valor
                env.setVar(this.variable, initialVal.value, initialVal.tip, this.line, this.column);
            }
            else {
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
                if ((this.operationType === "incremento" && currentVal > finalVal) ||
                    (this.operationType === "decremento" && currentVal < finalVal)) {
                    break;
                }
                // Reiniciar las banderas antes de ejecutar el cuerpo
                ForLoop.Bandera_Detener = false;
                ForLoop.Bandera_Continuar = false;
                ForLoop.Bandera_Retornar = false;
                // Ejecutar el cuerpo del ciclo
                this.executeBlock(this.body, env);
                // Evaluar las banderas globales después de ejecutar el cuerpo
                if (ForLoop.Bandera_Detener || ForLoop.Bandera_Retornar) {
                    console.log("Detener ejecución del ciclo en el foorloop.");
                    return; // Salir completamente del ciclo
                }
                else if (ForLoop.Bandera_Continuar) {
                    console.log("Continuar ejecución del ciclo en el foorloop.");
                    // Incrementar/decrementar y saltar a la siguiente iteración
                    if (this.operationType === "incremento") {
                        env.setVar(this.variable, currentVal + incDecValue, Tip_1.Tip.ENTERO, this.line, this.column);
                    }
                    else {
                        env.setVar(this.variable, currentVal - incDecValue, Tip_1.Tip.ENTERO, this.line, this.column);
                    }
                    continue;
                }
                // Incrementar o decrementar la variable de control
                if (this.operationType === "incremento") {
                    env.setVar(this.variable, currentVal + incDecValue, Tip_1.Tip.ENTERO, this.line, this.column);
                }
                else if (this.operationType === "decremento") {
                    env.setVar(this.variable, currentVal - incDecValue, Tip_1.Tip.ENTERO, this.line, this.column);
                }
            }
        }
        catch (e) {
            console.error(`Error al ejecutar el ciclo 'para': ${e}`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar el ciclo 'para'.`));
        }
        finally {
            // Desactivar la bandera de ciclo For al salir
            ForLoop.Bandera_Esta_En_Uso_FOr = false;
            ForLoop.Bandera_Detener = false;
            ForLoop.Bandera_Continuar = false;
            ForLoop.Bandera_Retornar = false;
        }
    }
    /**
     * Ejecuta un bloque de instrucciones.
     */
    executeBlock(instructions, env) {
        if (!Array.isArray(instructions)) {
            console.error(`Error: Las instrucciones del cuerpo del ciclo no son válidas.`);
            out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `El cuerpo del ciclo 'para' debe ser una lista de instrucciones válida.`));
            return;
        }
        for (const inst of instructions) {
            if (inst instanceof inst_1.Instruccion) {
                inst.play(env);
                // Si alguna bandera fue activada, detener la ejecución del bloque inmediatamente
                if (ForLoop.Bandera_Detener || ForLoop.Bandera_Continuar || ForLoop.Bandera_Retornar) {
                    return;
                }
            }
            else {
                console.error(`Error: La instrucción '${inst}' no es válida.`);
                out_1.errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La instrucción dentro del ciclo 'para' no es válida.`));
            }
        }
    }
}
exports.ForLoop = ForLoop;
ForLoop.Bandera_Detener = false; // Bandera para detener el ciclo
ForLoop.Bandera_Continuar = false; // Bandera para continuar el ciclo
ForLoop.Bandera_Retornar = false; // Bandera para retornar del ciclo
ForLoop.Bandera_Esta_En_Uso_FOr = false; // Bandera para indicar que el ciclo está en uso
