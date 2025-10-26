import { Exp } from "../abs/exp";
import { enviroment } from "../env/enviroment";
import { Tip, ReturnTip } from "../util/Tip";
import { ExpresionsTypes } from "../util/expresionsTypes";

// --- 1. IMPORTAR EL SISTEMA DE ERRORES ---
import { Error as CustomError } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";

export class Casteo extends Exp {
    constructor(linea: number, columna: number, private tipo: Tip, private exp: Exp) {
        super(linea, columna, ExpresionsTypes.CASTEO);
    }

    public play(entorno: enviroment): ReturnTip {
        const valor = this.exp.play(entorno);

        // Validar que el tipo origen sea compatible con el tipo destino
        if (!this.esConversionValida(valor.tip, this.tipo)) {
            // --- 2. MANEJO DE ERROR CORREGIDO ---
            errores.push(new CustomError(
                this.linea, this.columna, ErroresTypes.SEMANTICO, // Usar el enum numérico
                `No se puede convertir '${Tip[valor.tip]}' a '${Tip[this.tipo]}'`
            ));
            return { value: null, tip: Tip.NULO }; // No lanzar error
        }

        // Realizar la conversión según el tipo destino
        try {
            switch (this.tipo) {
                case Tip.ENTERO:
                    return this.convertirAEntero(valor);
                case Tip.DECIMAL:
                    return this.convertirADecimal(valor);
                case Tip.CADENA:
                    return this.convertirACadena(valor);
                case Tip.CARACTER:
                    return this.convertirACaracter(valor);
                default:
                    errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, `Tipo de casteo no soportado: ${Tip[this.tipo]}`));
                    return { value: null, tip: Tip.NULO };
            }
        } catch (e: any) { // Capturar errores internos (ej. charCodeAt de null)
            errores.push(new CustomError(this.linea, this.columna, ErroresTypes.SEMANTICO, e.message));
            return { value: null, tip: Tip.NULO };
        }
    }

    private esConversionValida(tipoOrigen: Tip, tipoDestino: Tip): boolean {
        // Reglas permitidas basadas en los métodos helper que existen
        const reglasPermitidas: { [key in Tip]?: Tip[] } = {
            [Tip.ENTERO]: [Tip.DECIMAL, Tip.CADENA, Tip.CARACTER], // (decimal)int, (cadena)int, (caracter)int
            [Tip.DECIMAL]: [Tip.ENTERO, Tip.CADENA, Tip.CARACTER], // (entero)dec, (cadena)dec, (caracter)dec
            [Tip.CARACTER]: [Tip.ENTERO, Tip.DECIMAL, Tip.CADENA], // (entero)char, (decimal)char, (cadena)char
        };

        const reglas = reglasPermitidas[tipoOrigen];
        return reglas ? reglas.includes(tipoDestino) : false;
    }

    private convertirAEntero(valor: ReturnTip): ReturnTip {
        switch (valor.tip) {
            case Tip.CARACTER:
                const charValue = String(valor.value);
                return { value: charValue.charCodeAt(0), tip: Tip.ENTERO };
            case Tip.DECIMAL:
                return { value: Math.trunc(valor.value), tip: Tip.ENTERO };
            default:
                throw new Error(`Conversión interna no válida de '${Tip[valor.tip]}' a ENTERO`);
        }
    }

    private convertirADecimal(valor: ReturnTip): ReturnTip {
        switch (valor.tip) {
            case Tip.ENTERO:
                return { value: parseFloat(valor.value), tip: Tip.DECIMAL };
            case Tip.CARACTER:
                const charValue = String(valor.value);
                // Convertir 'A' -> 65 -> 65.0
                return { value: parseFloat(String(charValue.charCodeAt(0))), tip: Tip.DECIMAL };
            default:
                throw new Error(`Conversión interna no válida de '${Tip[valor.tip]}' a DECIMAL`);
        }
    }

    private convertirACadena(valor: ReturnTip): ReturnTip {
        return { value: String(valor.value), tip: Tip.CADENA };
}

    private convertirACaracter(valor: ReturnTip): ReturnTip {
        switch (valor.tip) {
            case Tip.ENTERO:
                return { value: String.fromCharCode(valor.value), tip: Tip.CARACTER };
            case Tip.DECIMAL:
                    return { value: String.fromCharCode(Math.trunc(valor.value)), tip: Tip.CARACTER };
            default:
                        throw new Error(`Conversión interna no válida de '${Tip[valor.tip]}' a CARACTER`);
                    }
                }
}