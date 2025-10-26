import { enviroment } from "../env/enviroment";
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Exp } from "../abs/exp";
import { Tip, ReturnTip } from "../util/Tip"; // Importar ReturnTip
import { AccessList } from "../Expresiones/AccesList";

export class ListasModificadas {
    constructor(
        public line: number,
        public column: number,
        public accessList: AccessList,
        public newValue: Exp
    ) {}

    /**
     * Ejecuta la modificación de la lista.
     */
    public play(env: enviroment): void {
        try {
            // Obtener la lista del entorno
            const listaSimbolo = env.getList(this.accessList.id);
            if (!listaSimbolo) {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `La lista '${this.accessList.id}' no existe.`
                ));
                return;
            }

            // Evaluar el nuevo valor
            const evaluatedNewValue = this.newValue.play(env);
            const newValueType = evaluatedNewValue.tip;

            // Validar que el tipo del nuevo valor coincida con el tipo declarado
            if (newValueType !== listaSimbolo.tipo) {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `El tipo del nuevo valor (${Tip[newValueType]}) no coincide con el tipo declarado (${Tip[listaSimbolo.tipo]}).`
                ));
                return;
            }

            // Evaluar todos los índices ANTES de usarlos
            const evaluatedIndices: number[] = [];
            for (const indexExp of this.accessList.indices) {
                const indexResult = indexExp.play(env);
                if (indexResult.tip !== Tip.ENTERO) {
                    errores.push(new CustomError(
                        this.line, this.column, ErroresTypes.SEMANTICO,
                        `Los índices de la lista deben ser de tipo ENTERO.`
                    ));
                    return;
                }
                evaluatedIndices.push(indexResult.value);
            }

            // Obtener el valor actual de la lista
            let currentValue = listaSimbolo.value;

            // Recorrer recursivamente los índices para llegar al array deseado
            let currentDimension = 1;
            for (let i = 0; i < evaluatedIndices.length - 1; i++) {
                const index = evaluatedIndices[i];
                
                if (!Array.isArray(currentValue)) {
                    errores.push(new CustomError(
                        this.line, this.column, ErroresTypes.SEMANTICO,
                        `Intento de acceder a un índice en un valor no iterable (dimensión ${currentDimension}).`
                    ));
                    return;
                }
                if (index < 0 || index >= currentValue.length) {
                    errores.push(new CustomError(
                        this.line, this.column, ErroresTypes.SEMANTICO,
                        `Índice [${index}] fuera de rango. Tamaño de la dimensión ${currentDimension}: ${currentValue.length}.`
                    ));
                    return;
                }
                currentValue = currentValue[index];
                currentDimension++;
            }

            // Último índice para la modificación
            const lastIndex = evaluatedIndices[evaluatedIndices.length - 1];
            if (!Array.isArray(currentValue)) {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `Intento de acceder a un índice en un valor no iterable (dimensión ${currentDimension}).`
                ));
                return;
            }
            if (lastIndex < 0 || lastIndex >= currentValue.length) {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `Índice [${lastIndex}] fuera de rango. Tamaño de la dimensión ${currentDimension}: ${currentValue.length}.`
                ));
                return;
            }

            // Actualizar el valor
            currentValue[lastIndex] = evaluatedNewValue.value;

        } catch (e: any) {
            if (e instanceof CustomError) {
                errores.push(e);
            } else {
                errores.push(new CustomError(
                    this.line, this.column, ErroresTypes.SEMANTICO,
                    `Error inesperado al modificar la lista '${this.accessList.id}': ${e.message}`
                ));
            }
        }
    }
}