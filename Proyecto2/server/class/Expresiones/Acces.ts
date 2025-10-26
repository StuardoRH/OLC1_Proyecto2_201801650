// en server/class/Expresiones/Acces.ts
import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Simbolo } from "../env/simb";
import { Objeto } from "../env/Objeto"; // <-- Importar Objeto
import { Tip, ReturnTip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";

export class Acces extends Exp {
    constructor (linea: number, columna: number, private id: string) {
        super(linea, columna, ExpresionsTypes.ACCESO_ID);
    }

    public play(entorno: enviroment): ReturnTip {
        // 1. Intentar buscar como VARIABLE
        const valorVar: Simbolo | null = entorno.getVar(this.id, this.linea, this.columna);
        if (valorVar) {
            // Sí se encontró como variable
            return {value: valorVar.value, tip: valorVar.tipo};
        }

        // 2. Si no es variable, intentar buscar como OBJETO
        const valorObj: Objeto | null = entorno.getObjeto(this.id);
        if (valorObj) {
            // Sí se encontró como objeto
            // Devolvemos el ID del objeto (o el objeto entero si lo necesitas)
            return {value: valorObj.id, tip: Tip.OBJETO};
        }
        
        // 3. Si no se encontró en ninguna tabla, ahora sí es un error
        // (Asumimos que getVar ya reportó el error si no lo encontró)
        return {value: 'NULL', tip: Tip.NULO};
    }
}