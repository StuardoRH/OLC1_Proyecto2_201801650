//Lllamada Procedimiento
import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Tip, ReturnTip } from "../util/Tip";
import { Parametro } from "../Expresiones/Parametro";
import { Bloque } from "../Instrucciones/Bloque";
import { Simbolo } from "../env/simb";

import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Error as CustomError } from "../util/Error"; // Renombrado
import { Instruccion } from "../abs/inst";
import { intructionsTypes } from "../util/instructionsTypes";
// Importar Procedimiento para acceder a su definición
import { Procedimiento } from "./Procedimiento";

export class LlamadaProcedimiento extends Instruccion {
    constructor(linea: number, columna: number, public id: string, public argumentos: Exp[]) { // Argumentos ya no es opcional si Jison siempre lo manda como array (vacío si no hay)
        super(linea, columna, intructionsTypes.LLAMADAS);
    }

    public play(entorno: enviroment) {
        try {
            // 1. Buscar el procedimiento en el entorno actual o superiores
            const procedimientoDef: Procedimiento | null = entorno.getProcedimiento(this.id);

            if (!procedimientoDef) {
                errores.push(new CustomError(
                    this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `El procedimiento '${this.id}' no ha sido definido.`
                ));
                return; // Detener ejecución si no se encuentra
            }

            // 2. Validar el número de argumentos
            const numArgumentos = this.argumentos.length;
            const numParametros = procedimientoDef.parametros.length;

            if (numArgumentos !== numParametros) {
                errores.push(new CustomError(
                    this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `Error en la llamada al procedimiento '${this.id}': Se esperaban ${numParametros} argumentos, pero se recibieron ${numArgumentos}.`
                ));
                return; // Detener ejecución
            }

            // 3. Crear un nuevo entorno para la ejecución del procedimiento
            const nuevoEntorno = new enviroment(entorno, `Procedimiento ${this.id}`);

            // 4. Evaluar argumentos, validar tipos y guardar parámetros en el nuevo entorno (UN SOLO BUCLE)
            for (let i = 0; i < numParametros; i++) {
                const argumentoExp = this.argumentos[i];
                const parametroDef = procedimientoDef.parametros[i];

                // Evaluar el argumento en el entorno *actual* (donde se llama)
                const valorArgumento: ReturnTip = argumentoExp.play(entorno);

                // Validar tipo (permitiendo Entero -> Decimal)
                let tipoValido = false;
                if (valorArgumento.tip === parametroDef.tipo) {
                    tipoValido = true;
                } else if (parametroDef.tipo === Tip.DECIMAL && valorArgumento.tip === Tip.ENTERO) {
                    // Permitir casteo implícito Entero a Decimal
                    valorArgumento.value = parseFloat(valorArgumento.value); // Convertir valor
                    valorArgumento.tip = Tip.DECIMAL; // Actualizar tipo
                    tipoValido = true;
                }

                if (!tipoValido) {
                    errores.push(new CustomError(
                        this.linea, this.columna, ErroresTypes.SEMANTICO,
                        `Error en la llamada al procedimiento '${this.id}': El tipo del argumento ${i + 1} (${Tip[valorArgumento.tip]}) no coincide con el tipo del parámetro '${parametroDef.id}' (${Tip[parametroDef.tipo]}).`
                    ));
                    return; // Detener ejecución si hay error de tipo
                }

                // Guardar el parámetro como variable en el *nuevo entorno*
                nuevoEntorno.SaveVar(parametroDef.id, valorArgumento.value, parametroDef.tipo, this.linea, this.columna);
            }

            // 5. Ejecutar las instrucciones del procedimiento en el nuevo entorno
            // Usar un bloque para manejar el entorno correctamente
            const bloqueInstrucciones = new Bloque(this.linea, this.columna, procedimientoDef.instrucciones);
            const resultadoEjecucion = bloqueInstrucciones.play(nuevoEntorno);

            // Los procedimientos no devuelven valor, pero podrían tener 'return;' (Retornar)
            // Si el bloque devuelve algo (por un return, break, continue), lo ignoramos aquí.
            // El manejo de break/continue/return debe hacerse dentro del Bloque o las clases específicas.

        } catch (e: any) {
            if (e instanceof CustomError) {
                errores.push(e);
            } else {
                errores.push(new CustomError(
                    this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `Error inesperado al ejecutar el procedimiento '${this.id}': ${e.message}`
                ));
            }
        }
    }
}