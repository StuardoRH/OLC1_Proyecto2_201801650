"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlamadaProcedimiento = void 0;
const enviroment_1 = require("../env/enviroment");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
const Bloque_1 = require("../Instrucciones/Bloque");
const simb_1 = require("../env/simb");
const ErroresTypes_1 = require("../util/ErroresTypes");
const out_1 = require("../util/out");
const Error_1 = require("../util/Error");
const inst_1 = require("../abs/inst");
const instructionsTypes_1 = require("../util/instructionsTypes");
class LlamadaProcedimiento extends inst_1.Instruccion {
    constructor(linea, columna, id, argumentos) {
        super(linea, columna, instructionsTypes_1.intructionsTypes.LLAMADAS);
        this.id = id;
        this.argumentos = argumentos;
    }
    play(entorno) {
        //  console.log('Llamada al procedimiento: ' + this.id);
        const ProcedimentoEntrante = entorno.getProcedimiento(this.id);
        // console.log('Funcion: ', funcion);
        // console.log('Procedimiento: ', ProcedimentoEntrante);
        if (ProcedimentoEntrante) {
            const nuevoEntorno = new enviroment_1.enviroment(entorno, 'Procedimiento ' + this.id);
            // console.log("el tamano de los argumentos es: " + this.argumentos?.length);
            // console.log("el tamano de los parametros es: " + ProcedimentoEntrante.parametros.length);
            if (ProcedimentoEntrante.parametros.length == this.argumentos?.length) {
                // console.log('Entro a la condicion de la llamada al procedimiento: ' + this.id);
                // console.log('Argumentos: ', this.argumentos);
                // console.log('Parametros: ', ProcedimentoEntrante.parametros);
                var valor;
                var parametro;
                for (let i = 0; i < ProcedimentoEntrante.parametros.length; i++) {
                    valor = this.argumentos[i].play(entorno);
                    parametro = ProcedimentoEntrante.parametros[i];
                    // console.log('Parametro: ' + parametro.id + ' tipo: ' + parametro.tipo + ' valor: ' + valor.valor + ' tipo: ' + valor.tipo);
                    // Validar el tipo de dato del argumento
                    if (valor.tip == parametro.tipo) {
                        nuevoEntorno.SaveVar(parametro.id, valor.value, parametro.tipo, this.linea, this.columna);
                        continue;
                    }
                    // Error semántico - No coinciden los tipos de los argumentos
                    return null;
                }
                for (let i = 0; i < this.argumentos.length; i++) {
                    valor = this.argumentos[i].play(entorno);
                    parametro = ProcedimentoEntrante.parametros[i];
                    if (valor.tip === parametro.tipo || parametro.tipo === Tip_1.Tip.DECIMAL && valor.tip === Tip_1.Tip.ENTERO) {
                        if (!entorno.ids.has(parametro.id)) {
                            entorno.setVariable(parametro.id, new simb_1.Simbolo(valor.value, parametro.id, parametro.tipo));
                            continue;
                        }
                        // Error Semantico - No pueden haber parametros duplicados o distintos con el mismo tipo
                        return;
                    }
                    return;
                }
                let ejecucion = new Bloque_1.Bloque(this.linea, this.columna, ProcedimentoEntrante.instrucciones).play(nuevoEntorno);
                if (ejecucion) {
                    if (ejecucion.valor === expresionsTypes_1.ExpresionsTypes.RETURN) {
                        // console.log('Retorno de la funcion: ' + this.id + ' con valor: ' + ejecucion.valor);
                        return;
                    }
                    // console.log('Ejecucion del procedimiento: ' + this.id + ' con valor: ' + ejecucion.valor);
                    return ejecucion;
                }
            }
            else {
                // Error Semantico - No se han pasado todos los argumentos necesarios
                out_1.errores.push(new Error_1.Error(this.linea, this.columna, ErroresTypes_1.ErroresTypes.SEMANTICO, `Error en la llamada a la funcion '${this.id}': ` +
                    `Se esperaban ${ProcedimentoEntrante.parametros.length} argumentos, pero se recibieron ${this.argumentos?.length}`));
                return;
            }
            // ====================PARA HACER PRUEBAS====================
            // let ejecucion: any = new Bloque(this.linea, this.columna, funcion.instrucciones).play(entorno);
            // if (ejecucion) {
            //     if (ejecucion.valor === ExpresionType.RETURN) {
            //         // console.log('Retorno de la funcion: ' + this.id + ' con valor: ' + ejecucion.valor);
            //         return
            //     }
            //     console.log('Ejecucion de la funcion: ' + this.id + ' con valor: ' + ejecucion.valor);
            //     return ejecucion;
            // }
        }
        return;
    }
}
exports.LlamadaProcedimiento = LlamadaProcedimiento;
