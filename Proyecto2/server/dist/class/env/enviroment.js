"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviroment = void 0;
const out_1 = require("../util/out");
const Tip_1 = require("../util/Tip");
const simb_1 = require("./simb");
const Error_1 = require("../util/Error");
const out_2 = require("../util/out");
const exp_1 = require("../abs/exp");
const Tabla_1 = require("./Tabla");
const simboloTabla_1 = require("./simboloTabla");
const Objeto_1 = require("./Objeto");
class enviroment {
    constructor(anterior, nombre) {
        this.anterior = anterior;
        this.nombre = nombre;
        this.ids = new Map();
        this.lists = new Map();
        this.funciones = new Map();
        this.procedimientos = new Map();
        this.objetos = new Map();
    }
    // === Crear Nuevo Entorno ===
    CrearNuevoEntorno(nombre) {
        const nuevoEntorno = new enviroment(this, nombre);
        console.log(`Creado nuevo entorno: ${nombre}`);
        return nuevoEntorno;
    }
    // === Obtener Variable ===
    getVar(id, linea, columna) {
        let enviroment = this;
        while (enviroment != null) {
            if (enviroment.ids.has(id)) {
                return enviroment.ids.get(id);
            }
            enviroment = enviroment.anterior;
        }
        // Error semántico - Variable no existe
        //errores.push(new Error(linea, columna, ErrType.SEMANTIC, `La variable '${id}' No existe en este entorno ${this.nombre}.`));
        return null;
    }
    // === Guardar Variable ===
    SaveVar(id, valor, tipo, linea, columna) {
        let enviroment = this;
        if (!enviroment.ids.has(id)) {
            // Guardar variable en el entorno actual
            enviroment.ids.set(id, new simb_1.Simbolo(valor, id, tipo));
            //console.log(`Variable '${id}' guardada con valor '${valor}' en el entorno ${this.nombre}.`);
            Tabla_1.tablaSimbolos.push(new simboloTabla_1.simboloTabla(linea, columna, true, true, valor, tipo, id, enviroment.nombre));
        }
        else {
            // Error semántico - Variable ya existe en este entorno
            out_2.errores.push(new Error_1.Error(linea, columna, ErrType.SEMANTIC, `La variable '${id}' ya existe en este entorno ${this.nombre}.`));
        }
    }
    setPrint(print) {
        out_1.salidasConsola.push(print);
    }
    setVar(id, valor, tipo, linea, columna) {
        let envActual = this;
        while (envActual !== null) {
            if (envActual.ids.has(id)) {
                envActual.ids.set(id, new simb_1.Simbolo(valor, id, tipo));
                return;
            }
            envActual = envActual.anterior;
        }
        out_2.errores.push(new Error_1.Error(linea, columna, ErrType.SEMANTIC, `Error en línea ${linea}: Variable '${id}' no declarada`));
        // throw new Error(`Error en línea ${linea}: Variable '${id}' no declarada`);
    }
    // === Actualizar Variable ===
    setVariable(id, valor) {
        let entorno = this;
        while (entorno != null) {
            if (entorno.ids.has(id)) {
                let simbolo = entorno.ids.get(id);
                simbolo.value = valor;
                return;
            }
            entorno = entorno.anterior;
        }
    }
    /**
     * Obtiene una lista del entorno.
     */
    getList(id) {
        let enviroment = this;
        while (enviroment != null) {
            if (enviroment.lists.has(id)) {
                return enviroment.lists.get(id);
            }
            enviroment = enviroment.anterior;
        }
        return null;
    }
    SaveList(id, valor, tipo, dimension, linea, columna) {
        let enviroment = this;
        // Validar que la lista no exista previamente
        if (enviroment.lists.has(id)) {
            out_2.errores.push(new Error_1.Error(linea, columna, ErrType.SEMANTIC, `La lista '${id}' ya existe.`));
            return;
        }
        try {
            // Evaluar los valores antes de validar
            const evaluatedValues = this.evaluateListValues(valor, enviroment);
            // Crear la instancia de ListaSimbolo
            const lista = new simb_1.ListaSimbolo(evaluatedValues, id, tipo, dimension);
            // Validar que todos los elementos sean del tipo correcto
            this.validateListValues(lista.value, tipo, linea, columna);
            // Guardar la lista en el entorno
            enviroment.lists.set(id, lista);
            Tabla_1.tablaSimbolos.push(new simboloTabla_1.simboloTabla(linea, columna, true, true, valor, tipo, id, enviroment.nombre));
            // console.log(`Lista '${id}' creada con éxito.`);
        }
        catch (e) {
            console.error(`Error al crear la lista '${id}': ${e}`);
            out_2.errores.push(new Error_1.Error(linea, columna, ErrType.SEMANTIC, `Error al crear la lista '${id}' `));
        }
    }
    /**
     * Valida que todos los valores de la lista coincidan con el tipo declarado.
     */
    validateListValues(valores, tipo, linea, columna) {
        if (Array.isArray(valores)) {
            for (const element of valores) {
                if (Array.isArray(element)) {
                    this.validateListValues(element, tipo, linea, columna);
                }
                else {
                    const evaluatedType = this.mapToTip(typeof element, element);
                    if (evaluatedType !== tipo) {
                        out_2.errores.push(new Error_1.Error(linea, columna, ErrType.SEMANTIC, `Tipo incorrecto. Esperado: ${tipo}, obtenido: ${evaluatedType}`));
                        //throw new Error(`Tipo incorrecto. Esperado: ${tipo}, obtenido: ${evaluatedType}`);
                    }
                }
            }
        }
        else {
            const evaluatedType = this.mapToTip(typeof valores, valores);
            if (evaluatedType !== tipo) {
                out_2.errores.push(new Error_1.Error(linea, columna, ErrType.SEMANTIC, `Tipo incorrecto. Esperado: ${tipo}, obtenido: ${evaluatedType}`));
                //throw new Error(`Tipo incorrecto. Esperado: ${tipo}, obtenido: ${evaluatedType}`);
            }
        }
    }
    /**
     * Evalúa los valores de la lista para obtener sus representaciones reales.
     */
    evaluateListValues(valores, env) {
        if (Array.isArray(valores)) {
            return valores.map((element) => {
                if (Array.isArray(element)) {
                    return this.evaluateListValues(element, env);
                }
                else if (element instanceof exp_1.Exp) {
                    const evaluated = element.play(env); // Evalúa la expresión
                    return evaluated.value; // Retornar el valor real
                }
                else {
                    return element; // Valor primitivo directo
                }
            });
        }
        else if (valores instanceof exp_1.Exp) {
            const evaluated = valores.play(env); // Evalúa la expresión
            return evaluated.value; // Retornar el valor real
        }
        return valores; // Valor primitivo directo
    }
    /**
     * Mapea un tipo JavaScript a un tipo Tip.
     */
    mapToTip(evaluated, value) {
        switch (evaluated) {
            case "number":
                // Distinguir entre Entero y Decimal
                return Number.isInteger(value) ? Tip_1.Tip.ENTERO : Tip_1.Tip.DECIMAL;
            case "string":
                // Distinguir entre Caracter y Cadena
                return value.length === 1 ? Tip_1.Tip.CARACTER : Tip_1.Tip.CADENA;
            case "boolean":
                return Tip_1.Tip.BOOLEAN;
            default:
                return null; // Tipo desconocido
        }
    }
    //===================Funciones===================
    // === GUARDAR FUNCION ===
    guardarFuncion(id, funcion, linea, columna) {
        let entorno = this;
        if (!entorno.funciones.has(id)) {
            // Guardar Funcion
            // console.log('Guardando funcion: ' + id + ' en el entorno: ' + entorno.nombre)
            // console.log(funcion)
            entorno.funciones.set(id, funcion);
            Tabla_1.tablaSimbolos.push(new simboloTabla_1.simboloTabla(funcion.linea, funcion.columna, false, false, null, funcion.tipo, id, entorno.nombre));
        }
        // Error semántico - Funcion ya existe
    }
    // === OBTENER FUNCION ===
    getFuncion(id) {
        let entorno = this;
        while (entorno != null) {
            if (entorno.funciones.has(id)) {
                return entorno.funciones.get(id);
            }
            entorno = entorno.anterior;
        }
        // Error semántico - Funcion no existe
        return null;
    }
    // === GUARDAR PROCEDIMIENTO ===
    // Método para guardar un procedimiento
    guardarProcedimiento(id, procedimiento, linea, columna) {
        if (this.procedimientos.has(id)) {
            console.error(`Error semántico: El procedimiento '${id}' ya existe. Línea: ${linea}, Columna: ${columna}`);
            return;
        }
        this.procedimientos.set(id, procedimiento);
        // console.log(`Procedimiento '${id}' guardado con éxito.`);
    }
    // Método para obtener un procedimiento
    getProcedimiento(id) {
        let entorno = this;
        while (entorno != null) {
            if (entorno.procedimientos.has(id)) {
                return entorno.procedimientos.get(id);
            }
            entorno = entorno.anterior;
        }
        // Error semántico - Funcion no existe
        return null;
    }
    // === GUARDAR OBJETO ===
    guardarObjeto(id, atributos) {
        let entorno = this;
        if (!entorno.objetos.has(id)) {
            // console.log(atributos)
            this.objetos.set(id, new Objeto_1.Objeto(id));
            this.guardarAtributo(id, atributos);
        }
        // Error semántico - Objeto ya existe
    }
    guardarAtributo(id, atributo) {
        let entorno = this;
        if (entorno.objetos.has(id)) {
            let objeto = entorno.objetos.get(id);
            for (let i = 0; i < atributo.length; i++) {
                // console.log(atributo[i])
                objeto.atributos.set(atributo[i].id, atributo[i]);
            }
        }
        // Error semántico - Objeto no existe
    }
    // === OBTENER OBJETO ===
    getObjeto(id) {
        let entorno = this;
        while (entorno != null) {
            if (entorno.objetos.has(id)) {
                console.log('Objeto encontrado: ' + id);
                console.log(entorno.objetos.get(id));
                return entorno.objetos.get(id);
            }
            entorno = entorno.anterior;
        }
        // Error semántico - Objeto no existe
        return null;
    }
}
exports.enviroment = enviroment;
enviroment.Bandera_Esta_En_Funcion = false;
