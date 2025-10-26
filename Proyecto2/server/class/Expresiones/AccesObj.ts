//Acceso objeto
import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Objeto } from "../env/Objeto";
import { Tip, ReturnTip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";

export class AccesoObjeto extends Exp {
    constructor (linea: number, columna: number, private id: string) {
        super(linea, columna, ExpresionsTypes.ACCESO_ID);
    }

    public play(entorno: enviroment): ReturnTip {
        const valor: Objeto | null = entorno.getObjeto(this.id);
        if (valor) {
            return {value: valor?.id, tip: Tip.OBJETO};
        }
        return {value: 'NULL', tip: Tip.NULO};
    }
}