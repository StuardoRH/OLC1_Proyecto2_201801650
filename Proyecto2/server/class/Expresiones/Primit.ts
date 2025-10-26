import {Exp} from "../abs/exp";
import {Tip, ReturnTip} from "../util/Tip";
import {enviroment} from "../env/enviroment";
import {ExpresionsTypes} from "../util/expresionsTypes";


export class Primit extends Exp{
    constructor(linea: number, columna: number, public value: any, public tipo: Tip){
        super(linea, columna, ExpresionsTypes.PRIMITIVO);
    }

    public play(_: enviroment): ReturnTip {
        switch(this.tipo) {
            case Tip.ENTERO:
                return {value: parseInt(this.value), tip: this.tipo};
            case Tip.DECIMAL:
                return {value: parseFloat(this.value), tip: this.tipo};
            case Tip.BOOLEANO:
                return {value: this.value.toString() === 'verdadero', tip: this.tipo};
            case Tip.CARACTER:
                return {value: this.value.toString(), tip: this.tipo};
            case Tip.CADENA:
                return {value: this.value.toString(), tip: this.tipo};
            default:
                return {value: this.value, tip: this.tipo};
        }
    }
}