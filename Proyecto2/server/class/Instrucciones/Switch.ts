//switch statement
import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { intructionsTypes } from "../util/instructionsTypes";
import { Bloque } from "./Bloque"; // <--- 1. IMPORTAR BLOQUE
import { ExpresionsTypes } from "../util/expresionsTypes"; // Para la señal de return

export class Switch extends Instruccion {
    constructor(
        linea: number,
        columna: number,
        private expression: any, // Debería ser Exp
        private cases: { condition: any; body: Instruccion[] }[], // Debería ser Exp
        private defaultCase?: Instruccion[]
    ) {
        super(linea, columna, intructionsTypes.SWITH);
    }

    public play(entorno: enviroment): void {
        const value = this.expression.play(entorno); // Evaluar la expresión principal

        let matched = false;

        // Iterar sobre los casos
        for (const caseItem of this.cases) {
            const conditionValue = caseItem.condition.play(entorno);

            // --- 2. LÓGICA DE COMPARACIÓN CORREGIDA ---
            // Compara el tipo Y el valor
            if (value.tip === conditionValue.tip && value.value === conditionValue.value) {
                matched = true;
                
                // --- 3. MEJORA DE ROBUSTEZ ---
                // Ejecutar el cuerpo del caso usando un Bloque
                // Esto maneja el scope y las señales de 'retornar'
                const bloque = new Bloque(this.linea, this.columna, caseItem.body);
                const resultado = bloque.play(entorno);

                // Si el bloque devuelve una señal (return), propagarla
                if (resultado && resultado.tipo === ExpresionsTypes.RETURN) {
                    return resultado; // Propagar la señal de return
                }
                
                // Tu gramática Jison REQUIERE 'detener' al final de cada caso,
                // lo que significa que no hay "fall-through".
                // Por lo tanto, un 'return' aquí es correcto.
                return; 
            }
        }

        // Si no hay coincidencia, ejecutar el caso por defecto
        if (!matched && this.defaultCase) {
            // Usar un Bloque aquí también
            const bloque = new Bloque(this.linea, this.columna, this.defaultCase);
            const resultado = bloque.play(entorno);
            
            if (resultado && resultado.tipo === ExpresionsTypes.RETURN) {
                return resultado; // Propagar la señal de return
            }
        }
    }
}