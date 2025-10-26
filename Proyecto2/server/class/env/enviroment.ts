import { Console } from "console";
import { salidasConsola } from "../util/out";
import { Tip } from "../util/Tip";
import { Simbolo, ListaSimbolo } from "./simb";
import { Error } from "../util/Error";
import { ErroresTypes } from "../util/ErroresTypes";
import { errores } from "../util/out";
import { Exp } from "../abs/exp";
import { Funcion } from "../Instrucciones/Funcion";
import { Procedimiento } from "../Instrucciones/Procedimiento";
import { tablaSimbolos } from "./Tabla";
import { simboloTabla } from "./simboloTabla";
import { Objeto } from "./Objeto";
import { Atributo } from "../Expresiones/Atributo";

export class enviroment {
        public ids: Map<string, Simbolo> = new Map<string, Simbolo>();
        public lists: Map<string, ListaSimbolo> = new Map<string, ListaSimbolo>();
        public funciones: Map<string, Funcion> = new Map<string, Funcion>()
        private procedimientos: Map<string, Procedimiento> = new Map<string, Procedimiento>();
        public objetos: Map<string, Objeto> = new Map<string, Objeto>()

        private static Bandera_Esta_En_Funcion: boolean = false;
        constructor(private anterior: enviroment | null, public nombre: string) {}
        // === Crear Nuevo Entorno ===
        public CrearNuevoEntorno(nombre: string): enviroment {
                const nuevoEntorno = new enviroment(this, nombre);
                console.log(`Creado nuevo entorno: ${nombre}`);
                return nuevoEntorno;
        }

        // === Obtener Variable ===
        public getVar(id: string, linea: number, columna: number): Simbolo | null {
                let enviroment: enviroment | null = this;
                while (enviroment != null) {
                        if (enviroment.ids.has(id)) {
                                return enviroment.ids.get(id)!;
                        }
                        enviroment = enviroment.anterior;
                }
                // --- 1. ERROR DESCOMENTADO  ---
                errores.push(new Error(linea, columna, ErroresTypes.SEMANTICO, `La variable '${id}' No existe en este entorno ${this.nombre}.`));
                return null;
        }

        // === Guardar Variable ===
        public SaveVar(id: string, valor: any, tipo: Tip, linea: number, columna: number): void {
                let enviroment: enviroment = this; // Guardar siempre en el entorno actual
                if (!enviroment.ids.has(id)) {
                        enviroment.ids.set(id, new Simbolo(valor, id, tipo));
                        tablaSimbolos.push(new simboloTabla(linea, columna, true, true, valor, tipo, id, enviroment.nombre))
                } else {
                        errores.push(new Error(linea, columna, ErroresTypes.SEMANTICO, `La variable '${id}' ya existe en este entorno ${this.nombre}.`));
                }
        }


        public setPrint(print: string) {
                salidasConsola.push(print)
        }

        public setVar(id: string, valor: any, tipo: Tip, linea: number, columna: number): void {
                let envActual: enviroment | null = this;
                while (envActual !== null) {
                        if (envActual.ids.has(id)) {
                                // TODO: Aquí deberías validar que 'tipo' coincida con el tipo guardado
                                envActual.ids.set(id, new Simbolo(valor, id, tipo));
                                return;
                        }
                        envActual = envActual.anterior;
                }
                // Si sale del bucle, no la encontró en ningún ámbito
                errores.push(new Error(linea, columna,ErroresTypes.SEMANTICO, `Error en línea ${linea}: Variable '${id}' no declarada`));
        }
/**
 * Obtiene una lista del entorno.
 */
        public getList(id: string): ListaSimbolo | null {
                let enviroment: enviroment | null = this;
                while (enviroment != null) {
                        if (enviroment.lists.has(id)) {
                                return enviroment.lists.get(id)!;
                        }
                        enviroment = enviroment.anterior;
                }
                return null;
        }

        public SaveList(id: string, valor: Exp | Exp[], tipo: Tip, dimension: number, linea: number, columna: number) {
                let enviroment: enviroment = this;
                if (enviroment.lists.has(id)) {
                        errores.push(new Error(linea, columna, ErroresTypes.SEMANTICO, `La lista '${id}' ya existe.`));
                        return;
                }
                try {
                        const evaluatedValues = this.evaluateListValues(valor, enviroment);
                        const lista = new ListaSimbolo(evaluatedValues, id, tipo, dimension);
                        // --- LOGICA DE VALIDACIÓN ---
                        this.validateListValues(lista.value, tipo, linea, columna, tipo); // Pasamos el 'tipo' declarado
                        enviroment.lists.set(id, lista);
                        tablaSimbolos.push(new simboloTabla(linea, columna, true, true, valor, tipo, id, enviroment.nombre))
                } catch (e: any) {errores.push(new Error(linea, columna, ErroresTypes.SEMANTICO, `Error al crear la lista '${id}': ${e.message}` ));
                }
        }


        private validateListValues(valores: any, tipo: Tip, linea: number, columna: number, declaredType: Tip): void {
                if (Array.isArray(valores)) {
                        for (const element of valores) {
                                if (Array.isArray(element)) {
                                        this.validateListValues(element, tipo, linea, columna, declaredType);
                                } else {
                                        // Pasamos 'declaredType' para resolver ambigüedad
                                        const evaluatedType = this.mapToTip(typeof element, element, declaredType); 
                                        if (evaluatedType !== tipo) {
                                                errores.push(new Error(linea, columna, ErroresTypes.SEMANTICO,`Tipo incorrecto en lista. Se esperaba '${Tip[tipo]}', pero se recibió '${Tip[evaluatedType!]}'`));
                                        }
                                }
                        }
                } else {
                        const evaluatedType = this.mapToTip(typeof valores, valores, declaredType);
                        if (evaluatedType !== tipo) {
                                errores.push(new Error(
                                        linea, columna, ErroresTypes.SEMANTICO,`Tipo incorrecto en lista. Se esperaba '${Tip[tipo]}', pero se recibió '${Tip[evaluatedType!]}'`));
                                }
                        }
        }

/**
 * Evalúa los valores de la lista para obtener sus representaciones reales.
 */
        private evaluateListValues(valores: any, env: enviroment): any {
                if (Array.isArray(valores)) {
                        return valores.map((element) => {
                                if (Array.isArray(element)) {
                                        return this.evaluateListValues(element, env);
                                } else if (element instanceof Exp) {
                                        const evaluated = element.play(env);
                                        return evaluated.value; // Retornar el valor real
                                } else {
                                        return element; 
                                }
                        });
                } else if (valores instanceof Exp) {
                        const evaluated = valores.play(env);
                        return evaluated.value;
                }
                return valores;
        }

/**
 * Mapea un tipo JavaScript a un tipo Tip, usando el 'declaredType'
 * para resolver la ambigüedad entre CADENA y CARACTER.
 */
        private mapToTip(evaluated: string, value: any, declaredType: Tip): Tip | null {
                switch (evaluated) {
                        case "number":
                                return Number.isInteger(value) ? Tip.ENTERO : Tip.DECIMAL;
                        case "string":
                                // Si se declaró como CARACTER y el string es de largo 1, es CARACTER
                                if (declaredType === Tip.CARACTER && String(value).length === 1) {
                                        return Tip.CARACTER;
                                }
                                // En cualquier otro caso (declarado CADENA o largo != 1), es CADENA.
                                return Tip.CADENA;
                        case "boolean":
                                return Tip.BOOLEANO;
                        default:
                                return null; // Tipo desconocido
                }
        }
//===================Funciones===================
        public guardarFuncion(id: string, funcion: Funcion , linea: number, columna: number) {
                let entorno: enviroment = this
                if (!entorno.funciones.has(id)) {
                        entorno.funciones.set(id, funcion)
                        tablaSimbolos.push(new simboloTabla(funcion.linea, funcion.columna, false, false, null, funcion.tipo, id, entorno.nombre))
                }
        }

        public getFuncion(id: string): Funcion | null {
                let entorno: enviroment | null = this
                while (entorno != null) {
                        if (entorno.funciones.has(id)) {
                                return entorno.funciones.get(id)!
                        }
                        entorno = entorno.anterior
                }
                return null // 'LlamadaFuncion.ts' reportará el error
        }

        public guardarProcedimiento(id: string, procedimiento: Procedimiento, linea: number, columna: number): void {
                if (this.procedimientos.has(id)) {
                        // TODO: Usar el sistema 'errores.push'
                        console.error(`Error semántico: El procedimiento '${id}' ya existe. Línea: ${linea}, Columna: ${columna}`);
                        return;
                }
                this.procedimientos.set(id, procedimiento);
        }

        public getProcedimiento(id: string): Procedimiento | null {
                let entorno: enviroment | null = this
                while (entorno != null) {
                        if (entorno.procedimientos.has(id)) {
                                return entorno.procedimientos.get(id)!
                        }
                        entorno = entorno.anterior
                }
                return null // 'LlamadaProcedimiento.ts' reportará el error
        }

        // === GUARDAR OBJETO ===
        public guardarObjeto(id: string, atributos: Atributo[]) {
                let entorno: enviroment = this
                if (!entorno.objetos.has(id)) {
                        this.objetos.set(id, new Objeto(id))
                        this.guardarAtributo(id, atributos)
                }
        // TODO: Reportar error si el objeto ya existe
        }

        public guardarAtributo(id: string, atributo: Atributo[]) {
                let entorno: enviroment = this
                if (entorno.objetos.has(id)) {
                        let objeto: Objeto = entorno.objetos.get(id)!
                        for (let i = 0; i < atributo.length; i++) {
                                objeto.atributos.set(atributo[i].id, atributo[i])
                        }
                }
        // TODO: Reportar error si el objeto no existe
        }

        // === OBTENER OBJETO ===
        public getObjeto(id: string): Objeto | null {
                let entorno: enviroment | null = this
                while (entorno != null) {
                        if (entorno.objetos.has(id)) {
                                return entorno.objetos.get(id)!
                        }
                        entorno = entorno.anterior
                }
                return null // 'ObjectAcces.ts' y 'Acces.ts' reportarán el error
        }
}