import { enviroment } from "../env/enviroment";
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Exp } from "../abs/exp"; // Importar Exp
import { ExpresionsTypes } from "../util/expresionsTypes";
import { Tip } from "../util/Tip";

export class AccessList extends Exp {

    public indices: Exp[] = [];
        constructor(
            public line: number,
            public column: number,
            public id: string,
            indices: Exp[] 
        ) 
        {
        super(line, column, ExpresionsTypes.ACCESS_LIST);
        this.indices = indices; // Asignar el array de Expresiones
        }

    /**
        * Ejecuta el acceso a la lista.
   */
    public play(env: enviroment): { value: any; tip: Tip } {
        try {
             // Obtener la lista del entorno
            const listaSimbolo = env.getList(this.id);
            if (!listaSimbolo) {
                errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,`La lista '${this.id}' no existe.`));
                return { value: null, tip: Tip.NULO };
            }

            // --- ¡BLOQUE DE EVALUACIÓN DE ÍNDICES! ---
            const evaluatedIndices: number[] = [];
            for (const indexExp of this.indices) {
                if (!indexExp) { // Capturar el 'undefined' que causó el crash
                    errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,`Expresión de índice inválida (undefined) para '${this.id}'.`));
                    return { value: null, tip: Tip.NULO };
                }
                const indexResult = indexExp.play(env);
                if (indexResult.tip !== Tip.ENTERO) {
                    errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,`Los índices de la lista deben ser de tipo ENTERO.`));
                    return { value: null, tip: Tip.NULO };
                }
                evaluatedIndices.push(indexResult.value);
            }

            // Validar que los índices coincidan con la dimensionalidad
            if (evaluatedIndices.length !== listaSimbolo.dimension) {
                errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,`La dimensionalidad del acceso (${evaluatedIndices.length}) no coincide con la declarada (${listaSimbolo.dimension}).`));
                return { value: null, tip: Tip.NULO };
            }

            // Recorrer recursivamente los índices para obtener el valor
            let value: any;
            try {
                //Usar los índices evaluados
                value = this.getValueFromIndices(listaSimbolo.value, evaluatedIndices);
            } catch (e: any) {
                if (e instanceof CustomError) {
                    errores.push(e);
                } else {
                    errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO, e.message));
                }
                return { value: null, tip: Tip.NULO };
            }
            const tip = this.mapToTip(typeof value, value);
            return { value, tip };

        } catch (e: any) {
            if (e instanceof CustomError) {
                errores.push(e);
            } else {
                errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO,`Error inesperado al acceder a la lista '${this.id}'.`));
            }
            return { value: null, tip: Tip.NULO };
        }
    }

/**
     
    Obtiene el valor de la lista dada una lista de índices.    
*/
    private getValueFromIndices(value: any, indices: number[]): any {
        if (indices.length === 0) {
            return value; // Caso base
        }

        const [currentIndex, ...restIndices] = indices;

        if (!Array.isArray(value)) {
            const errorMsg = `Intento de acceder a un índice en un valor no iterable.`;
            errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO, errorMsg));
            throw new Error(errorMsg); // Lanzar para detener la ejecución
        }

        if (currentIndex < 0 || currentIndex >= value.length) {
            const errorMsg = `Índice fuera de rango: ${currentIndex}. Tamaño de la lista: ${value.length}.`;
            errores.push(new CustomError(this.line, this.column, ErroresTypes.SEMANTICO, errorMsg));
            throw new Error(errorMsg); // Lanzar para detener la ejecución
        }

        return this.getValueFromIndices(value[currentIndex], restIndices);
    }

//    Mapea un tipo Tip.
    private mapToTip(evaluated: string, value: any): Tip {
        switch (evaluated) {
            case "number":
                return Number.isInteger(value) ? Tip.ENTERO : Tip.DECIMAL;
            case "string":
                return Tip.CADENA; // Asumir Cadena, Caracter debe ser un tipo explícito
            case "boolean":
                return Tip.BOOLEANO;
                default:
                    return Tip.NULO;
        }
    }  
}