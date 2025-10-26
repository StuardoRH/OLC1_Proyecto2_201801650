import { enviroment } from "../env/enviroment";
import { Tip, ReturnTip } from "../util/Tip";
import { Instruccion } from "../abs/inst";
import { intructionsTypes } from "../util/instructionsTypes";
import { Exp } from "../abs/exp";
import { Error as CustomError } from "../util/Error"; // Renombrado
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class ListaDecla extends Instruccion {
    public id: string;
    public dimension: number | Exp; // Puede ser un Exp (Tipo 1) o un número (inferido en Tipo 2)
    public tipo: Tip;
    public valores: Exp | Exp[] | null;

    constructor(
        public line: number,
        public column: number,
        id: string,
        dimension: Exp | null,     // $4 de Jison (EXPR o null)
        tipo: Tip | null,          // $5 de Jison (TIPO o null)
        valores: Exp | Exp[] | null // $6 de Jison (null o LISTA_CONTENIDO)
    ) {
        super(line, column, intructionsTypes.LISTAS);
        this.id = id;
        this.valores = valores;

        if (dimension) {
            // --- TIPO 1 ---
            // Se recibió una EXPR de tamaño y un TIPO
            this.dimension = dimension; // Guardamos la EXPR para evaluarla en play()
            this.tipo = tipo!;
        } else {
            // --- TIPO 2 ---
            // Se recibieron valores. La dimensión y el tipo deben inferirse
            this.dimension = 0; // Se calculará en play()
            this.tipo = Tip.INVALIDO; // Se inferirá en play()
        }
    }

    public play(env: enviroment): void {
        try {
            let evaluatedValues: any;
            let declaredDimension: number;

            if (this.dimension instanceof Exp) {
                // --- ES TIPO 1: Lista v[10] de entero; ---
                const dimResult = this.dimension.play(env);
                if (dimResult.tip !== Tip.ENTERO) {
                    errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,
                        `El tamaño de la lista '${this.id}' debe ser un entero.`));
                    return;
                }
                
                declaredDimension = dimResult.value;
                if (declaredDimension <= 0) {
                     errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,
                        `El tamaño de la lista '${this.id}' debe ser mayor a 0.`));
                     return;
                }
                
                this.dimension = declaredDimension; // Guardar dimensión evaluada
                
                // Crear array con valores por defecto
                evaluatedValues = this.createDefaultArray(declaredDimension, this.tipo);
                if (evaluatedValues === null) {
                     // Error ya reportado por createDefaultArray
                     return;
                }

            } else {
                // --- ES TIPO 2: Lista v = {1, 2, 3}; ---
                if (!this.valores || (Array.isArray(this.valores) && this.valores.length === 0)) {
                    // Lista v = {};
                    errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,
                        `No se puede declarar una lista vacía sin tipo explícito (Tipo 2).`));
                    return;
                }

                evaluatedValues = this.evaluateValues(this.valores, env);

                // Inferir dimensión
                declaredDimension = this.calculateDimension(evaluatedValues);
                this.dimension = declaredDimension; // Guardar dimensión calculada

                // Inferir tipo
                const inferredType = this.inferType(evaluatedValues);
                if (inferredType === Tip.INVALIDO) {
                    errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,
                        `No se pudo inferir el tipo de la lista '${this.id}'. ¿Tipos mixtos?`));
                    return;
                }
                this.tipo = inferredType; // Guardar tipo inferido
            }

            // --- VALIDACIONES COMUNES ---

            // Validar dimensionalidad (1-3)
            if (declaredDimension < 1 || declaredDimension > 3) {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `La dimensionalidad de la lista '${this.id}' debe estar entre 1 y 3 (calculada: ${declaredDimension}).`
                ));
                return;
            }

            // Validar tipos
            if (!this.validateTypes(evaluatedValues, this.tipo)) {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `Los valores de la lista '${this.id}' no coinciden. Tipo esperado: ${Tip[this.tipo]}.`
                ));
                return;
            }

            // Guardar la lista en el entorno
            env.SaveList(this.id, evaluatedValues, this.tipo, this.dimension, this.line, this.column);

        } catch (e: any) {
            if (e instanceof CustomError) {
                errores.push(e);
            } else {
                errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO, `Error al declarar lista '${this.id}'.`));
            }
        }
    }

    /**
     * Evalúa recursivamente las expresiones (Exp) a valores primitivos
     */
    private evaluateValues(valores: Exp | Exp[] | any, env: enviroment): any {
        if (Array.isArray(valores)) {
            return valores.map((element) => this.evaluateValues(element, env));
        } else if (valores instanceof Exp) {
            const evaluated = valores.play(env);
            return evaluated.value; // Retornar el valor primitivo
        }
        return valores; // Ya está evaluado (caso recursivo)
    }

    /**
     * Valida recursivamente que todos los valores coincidan con el tipo base
     */
    private validateTypes(valores: any, tipo: Tip): boolean {
        if (Array.isArray(valores)) {
            for (const element of valores) {
                if (!this.validateTypes(element, tipo)) {
                    return false; // Si un sub-elemento falla, todo falla
                }
            }
            return true; // Todos los sub-elementos pasaron
        } else {
            // Caso base: es un valor primitivo
            const evaluatedTip = this.mapToTip(typeof valores, valores);
            return evaluatedTip === tipo;
        }
    }

    /**
     * Calcula la dimensión de un array ya evaluado
     */
    private calculateDimension(valores: any): number {
        if (!Array.isArray(valores)) {
            return 0; // No es un array
        }
        if (valores.length === 0) {
            return 1; // Array vacío es 1D
        }
        
        let currentDimension = 1;
        let ref: any = valores[0];
        while (Array.isArray(ref)) {
            currentDimension++;
            ref = (ref.length > 0) ? ref[0] : null; // Avanza al siguiente nivel
            if (ref === null) break; // Array interno vacío
        }
        return currentDimension;
    }

    /**
     * Infiere el tipo base de un array ya evaluado
     */
    private inferType(valores: any): Tip {
         let ref = valores;
         while (Array.isArray(ref)) {
             if(ref.length === 0) return Tip.INVALIDO; // No se puede inferir de array vacío
             ref = ref[0];
         }
         // ref es ahora el primer valor primitivo
         const tip = this.mapToTip(typeof ref, ref);
         return tip || Tip.INVALIDO;
    }

    /**
     * Crea un array de 1D con valores por defecto (para Tipo 1)
     */
    private createDefaultArray(size: number, tipo: Tip): any {
        // Tu spec solo soporta 1D para este tipo de declaración
        const defaultValue = this.getValorPorDefecto(tipo);
        return new Array(size).fill(defaultValue);
    }

    /**
     * Mapea un tipo de JS a un tipo de tu lenguaje
     */
    private mapToTip(jsType: string, value: any): Tip | null {
        switch (jsType) {
            case "number":
                return Number.isInteger(value) ? Tip.ENTERO : Tip.DECIMAL;
            case "string":
                return value.length === 1 ? Tip.CARACTER : Tip.CADENA;
            case "boolean":
                return Tip.BOOLEANO;
            default:
                return null;
        }
    }
    
    /**
     * Obtiene el valor por defecto para un tipo
     */
    private getValorPorDefecto(tipo: Tip): any {
        switch (tipo) {
            case Tip.ENTERO: return 0;
            case Tip.DECIMAL: return 0.0;
            case Tip.BOOLEANO: return true;
            case Tip.CARACTER: return '\0';
            case Tip.CADENA: return "";
            default: return null;
        }
    }
}