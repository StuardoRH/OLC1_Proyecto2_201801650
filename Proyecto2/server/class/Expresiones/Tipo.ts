import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Error } from "../util/Error"; // Importa tu CustomError (ya está como 'Error')
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Tip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";

export class Tipo extends Exp {
    constructor(public line: number,public column: number,public expression: Exp ) {
        super(line, column, ExpresionsTypes.FUNCION_NATIVA);
    }

    public play(env: enviroment): { value: any; tip: Tip } {
        try {
            // Evaluar la expresión
            const result = this.expression.play(env);
            // --- LÓGICA  CON SWITCH Y TIPOS FALTANTES ---
            const typeName = result.tip;
            switch (typeName) {
                case Tip.ENTERO:
                    return { value: "Entero", tip: Tip.CADENA };
                case Tip.DECIMAL:
                    return { value: "Decimal", tip: Tip.CADENA };
                case Tip.CADENA:
                    return { value: "Cadena", tip: Tip.CADENA };
                case Tip.BOOLEANO:
                    return { value: "Booleano", tip: Tip.CADENA };
                case Tip.CARACTER:
                    return { value: "Caracter", tip: Tip.CADENA };
                case Tip.OBJETO:
                    return { value: "Objeto", tip: Tip.CADENA };
                case Tip.LISTA:
                    return { value: "Lista", tip: Tip.CADENA }; 
                case Tip.NULO:
                    return { value: "Null", tip: Tip.CADENA };
                default:
                    return { value: "Desconocido", tip: Tip.CADENA };
            }
        } catch (e: any) {
            errores.push(new Error(this.line,this.column,ErroresTypes.SEMANTICO,`Error al ejecutar la función 'tipo': ${e.message}`));
            return { value: null, tip: Tip.NULO };
        }
    }
}