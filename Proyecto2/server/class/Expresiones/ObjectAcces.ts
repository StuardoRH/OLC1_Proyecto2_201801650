import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Objeto } from "../env/Objeto";
import { Tip, ReturnTip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Atributo } from "./Atributo";

export class ObjectAcces extends Exp { 
    constructor (
        linea: number, 
        columna: number, 
        private objId: string,  // $1 de Jison
        private propId: string // $3 de Jison
    ) {
        super(linea, columna, ExpresionsTypes.ACCESO_OBJETO);
    }

    public play(entorno: enviroment): ReturnTip {
        try {
            // 1. Buscar la instancia del objeto
            const objInstance: Objeto | null = entorno.getObjeto(this.objId);
            
            if (!objInstance) {
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `La instancia del objeto '${this.objId}' no existe.`));
                return { value: null, tip: Tip.NULO };
            }
            const atributo: Atributo | undefined = objInstance.atributos.get(this.propId);

            if (!atributo) {
                errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO,
                    `La propiedad '${this.propId}' no existe en el objeto '${this.objId}'.`));
                return { value: null, tip: Tip.NULO };
            }

            // 3. Mapear el tipo string de 'Atributo.ts' al enum 'Tip'
            const returnType: Tip = this.mapStringToTip(atributo.tipo);
            if (returnType === Tip.NULO) {
                    errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO,`Tipo de dato desconocido '${atributo.tipo}' en la propiedad '${this.propId}'.`));
                return { value: null, tip: Tip.NULO };
            }
            
            // 4. Devolver el valor y tipo de la PROPIEDAD
            return { value: atributo.valor, tip: returnType };

        } catch (e: any) {
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO,
                `Error al acceder a la propiedad '${this.propId}' del objeto '${this.objId}'.`));
            return { value: null, tip: Tip.NULO };
        }
    }

    private mapStringToTip(tipo: string): Tip {
        switch(tipo.toLowerCase()) {
            case "entero": return Tip.ENTERO;
            case "decimal": return Tip.DECIMAL;
            case "cadena": return Tip.CADENA;
            case "caracter": return Tip.CARACTER;
            case "booleano": return Tip.BOOLEANO;
            default: return Tip.NULO;
        }
    }
}