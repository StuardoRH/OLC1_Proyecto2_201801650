"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfStatement = void 0;
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
const ErroresTypes_1 = require("../util/ErroresTypes");
const Tip_1 = require("../util/Tip");
const Error_1 = require("../util/Error");
let { errores } = require('../util/out');
class IfStatement extends inst_1.Instruccion {
    constructor(line, column, condition, ifBody, elseBody = null, elseIfs = []) {
        super(line, column, instructionsTypes_1.intructionsTypes.SI);
        this.line = line;
        this.column = column;
        this.condition = condition;
        this.ifBody = ifBody;
        this.elseBody = elseBody;
        this.elseIfs = elseIfs;
    }
    play(env) {
        try {
            // Validación de condición principal
            if (!this.condition) {
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, "La condición del 'si' no puede estar vacía");
            }
            // Evaluar condición principal
            const mainConditionResult = this.condition.play(env);
            // Validar que la condición devolvió un valor
            if (mainConditionResult === null || mainConditionResult === undefined) {
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, "La condición del 'si' no devolvió un valor válido. ¿La variable está declarada?");
            }
            // Validar tipo booleano
            if (mainConditionResult.tip !== Tip_1.Tip.BOOLEANO) {
                throw new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Se esperaba condición booleana pero se obtuvo ${Tip_1.Tip[mainConditionResult.tip]}`);
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
                    errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, "La condición del 'o si' no devolvió un valor válido"));
                    continue;
                }
                if (elseIfResult.tip !== Tip_1.Tip.BOOLEANO) {
                    errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `La condición del 'o si' debe ser booleana (se obtuvo ${Tip_1.Tip[elseIfResult.tip]})`));
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
        }
        catch (error) {
            if (error instanceof Error_1.Error) {
                errores.push(error);
            }
            else {
                errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error inesperado en la estructura condicional: ${error}`));
            }
        }
    }
    executeBlock(instructions, env) {
        for (const inst of instructions) {
            try {
                inst.play(env);
            }
            catch (error) {
                if (error instanceof Error_1.Error) {
                    errores.push(error);
                }
                else {
                    errores.push(new Error_1.Error(this.line, this.column, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error al ejecutar instrucción: ${error}`));
                }
            }
        }
    }
}
exports.IfStatement = IfStatement;
