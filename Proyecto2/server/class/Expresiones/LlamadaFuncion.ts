import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Tip, ReturnTip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";
import { Parametro } from "./Parametro";
import { Bloque } from "../Instrucciones/Bloque";
// import { Simbolo } from "../env/simb"; // No se usa directamente aquí
import { Funcion } from "../Instrucciones/Funcion"; // Importar la definición de Funcion

import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Error as CustomError } from "../util/Error"; // Importar como CustomError


export class LlamadaFuncion extends Exp {
    // Jison siempre envía un array (vacío o lleno), por lo que | undefined no es necesario
    constructor(linea: number, columna: number, public id: string, public argumentos: Exp[]) {
        super(linea, columna, ExpresionsTypes.LLAMADA_FUNCION);
    }

    public play(entorno: enviroment): ReturnTip { // Siempre debe devolver ReturnTip
        
        // 1. Buscar la definición de la función
        const funcion: Funcion | null = entorno.getFuncion(this.id);
        
        if (!funcion) {
            errores.push(new CustomError(
                this.linea, this.columna, ErroresTypes.SEMANTICO,
                `La función '${this.id}' no ha sido definida.`
            ));
            return { value: null, tip: Tip.NULO };
        }

        // 2. Validar número de argumentos
        const numArgumentos = this.argumentos.length;
        const numParametros = funcion.parametros.length;

        if (numArgumentos !== numParametros) {
            errores.push(new CustomError(
                this.linea, this.columna, ErroresTypes.SEMANTICO,
                `Error en la llamada a la funcion '${this.id}': Se esperaban ${numParametros} argumentos, pero se recibieron ${numArgumentos}.`
            ));
            return { value: null, tip: Tip.NULO };
        }

        // 3. Crear nuevo entorno
        const nuevoEntorno = new enviroment(entorno, `Funcion ${this.id}`);

        // 4. Bucle ÚNICO para validar y guardar parámetros
        for (let i = 0; i < numParametros; i++) {
            const argumentoExp = this.argumentos[i];
            const parametroDef = funcion.parametros[i];

            // Evaluar argumento en el entorno PADRE
            const valorArgumento: ReturnTip = argumentoExp.play(entorno);

            // Validar tipo (permitiendo Entero -> Decimal)
            let tipoValido = false;
            if (valorArgumento.tip === parametroDef.tipo) {
                tipoValido = true;
            } else if (parametroDef.tipo === Tip.DECIMAL && valorArgumento.tip === Tip.ENTERO) {
                // Permitir casteo implícito Entero a Decimal
                valorArgumento.value = parseFloat(valorArgumento.value);
                valorArgumento.tip = Tip.DECIMAL;
                tipoValido = true;
            }

            if (!tipoValido) {
                errores.push(new CustomError(
                    this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `Error en la llamada a la funcion '${this.id}': El tipo del argumento ${i + 1} (${Tip[valorArgumento.tip]}) no coincide con el tipo del parámetro '${parametroDef.id}' (${Tip[parametroDef.tipo]}).`
                ));
                return { value: null, tip: Tip.NULO };
            }

            // Guardar el parámetro como variable en el *nuevo entorno*
            nuevoEntorno.SaveVar(parametroDef.id, valorArgumento.value, parametroDef.tipo, this.linea, this.columna);
        }

        // 5. Ejecutar las instrucciones de la función
        const bloqueInstrucciones = new Bloque(this.linea, this.columna, funcion.instrucciones);
        const resultadoSignal: any = bloqueInstrucciones.play(nuevoEntorno);

        // 6. Procesar la señal de retorno
        let valorDeRetorno: ReturnTip | null = null;

        if (resultadoSignal) {
            // Caso 1: 'retornar <expresion>;' (Señal de Return.ts)
            if (resultadoSignal.value?.tipo === ExpresionsTypes.RETURN) {
                valorDeRetorno = resultadoSignal.value.valor; // Extraer el ReturnTip
            }
            // Caso 2: 'regresar;' (Señal de Retornar.ts)
            else if (resultadoSignal.tipo === ExpresionsTypes.RETURN) {
                valorDeRetorno = { value: null, tip: Tip.NULO }; // Es un retorno void
            }
        }

        // 7. Validar si hubo un retorno
        if (valorDeRetorno === null) {
            // La función terminó sin 'retornar' o 'regresar'
            errores.push(new CustomError(
                this.linea, this.columna, ErroresTypes.SEMANTICO,
                `La función '${this.id}' no devolvió ningún valor. Se esperaba un valor de tipo '${Tip[funcion.tipo]}'.`
            ));
            return { value: null, tip: Tip.NULO };
        }

        // 8. Validar el tipo de retorno contra la firma de la función
        if (valorDeRetorno.tip !== funcion.tipo) {
            // Permitir casteo implícito de Entero a Decimal en el retorno
            if (funcion.tipo === Tip.DECIMAL && valorDeRetorno.tip === Tip.ENTERO) {
                valorDeRetorno.value = parseFloat(valorDeRetorno.value);
                valorDeRetorno.tip = Tip.DECIMAL;
                // Tipo válido
            } else {
                // Error de tipo de retorno
                errores.push(new CustomError(
                    this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `Error en la funcion '${this.id}': El tipo de retorno (${Tip[valorDeRetorno.tip]}) no coincide con el tipo declarado de la función (${Tip[funcion.tipo]}).`
                ));
                return { value: null, tip: Tip.NULO };
            }
        }

        // 9. Retorno exitoso
        return valorDeRetorno;
    }
}