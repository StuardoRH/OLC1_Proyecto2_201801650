//print
import { Exp } from "../abs/exp";
import { Instruccion } from "../abs/inst";
import { enviroment } from "../env/enviroment";
import { intructionsTypes } from "../util/instructionsTypes";
import { salidasConsola } from "../util/out"; // <--- 1. IMPORTAR LA SALIDA CORRECTA

export class Print extends Instruccion {
    
    // --- 2. AÑADIR ESTA PROPIEDAD ---
    private esSaltoDeLinea: boolean;

    constructor(
        linea: number,
        columna: number,
        private expresion: Exp,
        esSaltoDeLinea: boolean // <--- 3. ACEPTAR EL 4TO PARÁMETRO
    ) {
        super(linea, columna, intructionsTypes.IMPRIMIR);
        this.esSaltoDeLinea = esSaltoDeLinea; // <--- 4. ASIGNAR EL PARÁMETRO
    }

    public play(enviroment: enviroment) {
        const valor = this.expresion ? this.expresion.play(enviroment) : null;
        
        let salida = "";
        
        // Manejar valores nulos o indefinidos al imprimir
        if (valor === null || valor === undefined) {
            salida = "null"; // O "undefined", según prefieras
        } else {
            salida = String(valor.value); // Convertir siempre a string
        }

        // --- 5. LÓGICA CORREGIDA ---
        if (this.esSaltoDeLinea) {
            salida += "\n";
        }

        // --- 6. USAR LA SALIDA CORRECTA ---
        // enviroment.setPrint(valor ? valor.value : ''); // <-- INCORRECTO
        salidasConsola.push(salida); // <-- CORRECTO
    }
}