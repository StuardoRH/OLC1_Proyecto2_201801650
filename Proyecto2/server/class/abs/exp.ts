import {ExpresionsTypes} from "../util/expresionsTypes";
import { enviroment } from "../env/enviroment";
import { Tip } from "../util/Tip"; 


export type Retorno = {
    value: any;
    tip: Tip;
};

export abstract class Exp{
    constructor(public linea: number, public columna: number, public ExpresionType: ExpresionsTypes) {}
    // Utilizamos el tipo definido 'Retorno'
    public abstract play(enviroment: enviroment): Retorno;

}