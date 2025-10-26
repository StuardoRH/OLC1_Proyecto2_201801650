import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// ==== Reportes ====
import { ReportStore } from './class/reportes/ReportStore';
import { normalizeErrors, collectSymbols } from './class/reportes/collect';
// ==== Utilidades ====
import { salidasConsola, limpiarSalidas, errores as globalErrors } from './class/util/out'; // Importar salidasConsola, limpiarSalidas y errores globales
import { Node } from './class/util/nodo'; // Importar Node para AST
import { enviroment } from './class/env/enviroment'; // Importar Enviroment
import { Instruccion } from './class/abs/inst';     // Importar Instruccion (clase abstracta)
import { Error as CustomError } from './class/util/Error'; // Importar tu clase Error
import { ErroresTypes } from './class/util/ErroresTypes'; // Importar Enum de Errores
import { Tip } from './class/util/Tip'; // Importar Tip (enum de tipos)
import { Exp } from './class/abs/exp'; // Importar Exp (clase abstracta)

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001; // Puerto 3001 por defecto

app.use(cors({
  // Asegúrate que esta URL coincida con la de tu frontend Vite
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// ====== Parser: usar Parser.js ya compilado ======
type JisonParser = { parse: (code: string) => any; yy: Record<string, any>; };
// Ajusta la ruta si tu archivo está en server/gramatica/
const GRAMMAR_DIR = path.resolve(__dirname, 'gramatica');
const PARSER_JS = path.join(GRAMMAR_DIR, 'Parser.js');

let parser: JisonParser | null = null;

function loadParserFromJS() {
  try {
    // Limpiar caché para recarga en caliente
    delete require.cache[require.resolve(PARSER_JS)];
    // Asume que Parser.js exporta directamente el parser
    parser = require(PARSER_JS) as JisonParser;
    console.log('[Parser] Cargado Parser.js OK');
  } catch (e: any) {
    console.error('[Parser] No pude cargar Parser.js:', e?.message ?? e);
    parser = null;
  }
}

// Carga inicial
if (fs.existsSync(PARSER_JS)) {
  loadParserFromJS();
} else {
  // Construye rutas relativas para el mensaje de error
  const jisonSourcePath = path.relative(process.cwd(), path.join(GRAMMAR_DIR, 'Parser.jison'));
  const parserJsPath = path.relative(process.cwd(), PARSER_JS);
  console.error(`[Parser] No existe ${parserJsPath}. Genera con: jison ${jisonSourcePath} -o ${parserJsPath}`);
}

// Opcional: Recarga automática si Parser.js cambia (útil en desarrollo)
fs.watchFile(PARSER_JS, { interval: 1000 }, (curr, prev) => {
  // Comprueba si el archivo todavía existe y si el tiempo de modificación cambió
  if (fs.existsSync(PARSER_JS) && curr.mtime !== prev.mtime) {
    console.log('[Parser] Cambio detectado en Parser.js: recargando...');
    loadParserFromJS();
  } else if (!fs.existsSync(PARSER_JS)) {
    console.error('[Parser] Parser.js fue eliminado. No se puede recargar.');
    parser = null; // Marcar parser como no disponible
  }
});


// ====== Endpoint de Salud (Verifica si el parser está cargado) ======
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    ok: !!parser, // true si el parser está cargado, false si no
    grammarFile: fs.existsSync(PARSER_JS) ? path.basename(PARSER_JS) : 'No encontrado',
  });
});

// ====== Endpoint Principal para Ejecutar Código ======
app.post('/api/run', (req: Request, res: Response) => {
  if (!parser) {
    return res.status(500).json({ ok: false, error: 'Parser no disponible. Revisa la consola del servidor.' });
  }

  const code = (req.body?.code ?? '') as string;
  if (typeof code !== 'string') {
    return res.status(400).json({ ok: false, error: 'Petición inválida. Debe enviar { "code": "..." }.' });
  }

  // Limpia reportes y salidas previas
  ReportStore.clear();
  limpiarSalidas(); // Limpia consola, errores globales, tokens de out.ts

  // Objeto 'yy' compartido con Jison
  const yyData = {
    // Pasar las utilidades directamente a yy para que las acciones semánticas las usen
    errors: globalErrors, // Usar el array global de errores directamente
    Node: Node,
    Tip: Tip, // Pasar el enum Tip si es necesario
    Instruccion: Instruccion, // Pasar clases base si las usas en acciones
    Exp: Exp,               // Pasar clases base si las usas en acciones
    // Pasar TODAS las clases de Instrucciones y Expresiones que Jison necesita
    Asignacion: require('./class/Instrucciones/Asignaciones').Asignacion,
    DeclVar: require('./class/Instrucciones/DeclVar').DeclaracionV, // Asegúrate que el nombre coincida con export
    Print: require('./class/Instrucciones/Print').print,
    Unario: require('./class/Instrucciones/Unario').Unarios,
    If: require('./class/Instrucciones/If').IfStatement,
    ListaDecla: require('./class/Instrucciones/ListaDecla').ListDeclaration,
    ListasModificadas: require('./class/Instrucciones/ListasModificadas').ModifyList,
    For: require('./class/Instrucciones/For').ForLoop,
    While: require('./class/Instrucciones/While').While,
    DoWhile: require('./class/Instrucciones/DoWhile').DoWhileLoop,
    Detener: require('./class/Instrucciones/Detener').Detener,
    Continuar: require('./class/Instrucciones/Continuar').Continuar,
    Retornar: require('./class/Instrucciones/Retornar').Retornar,
    Funcion: require('./class/Instrucciones/Funcion').Funcion,
    Switch: require('./class/Instrucciones/Switch').SwitchStatement,
    Procedimiento: require('./class/Instrucciones/Procedimiento').Procedimiento,
    Llamadas: require('./class/Instrucciones/Llamadas').LlamadaProcedimiento,
    Casteo: require('./class/Expresiones/Casteo').Casteo,
    Primit: require('./class/Expresiones/Primit').Primit,
    Acces: require('./class/Expresiones/Acces').Acces,
    arits: require('./class/Expresiones/arits').Arit,
    Rel: require('./class/Expresiones/Rel').Rel,
    logic: require('./class/Expresiones/logic').logic,
    AccessList: require('./class/Expresiones/AccesList').AccessList,
    Minuscula: require('./class/Expresiones/Minuscula').Minuscula,
    Mayuscula: require('./class/Expresiones/Mayuscula').Mayuscula,
    longitud: require('./class/Expresiones/longitud').Longitud,
    Truncar: require('./class/Expresiones/Truncar').Truncar,
    Tipo: require('./class/Expresiones/Tipo').Tipo,
    Redo: require('./class/Expresiones/Redo').Redo,
    Parametro: require('./class/Expresiones/Parametro').Parametro,
    LlamadaFuncion: require('./class/Expresiones/LlamadaFuncion').LlamadaFUncion,
    Return: require('./class/Expresiones/Return').Return,
    Ternario: require('./class/Expresiones/Ternario').Ternario,
    // --- Necesitarás también las clases de 'env' si las usas en Jison ---
    Simbolo: require('./class/env/simb').Simbolo,
    ListaSimbolo: require('./class/env/simb').ListaSimbolo,
    // ... y cualquier otra clase o función que usen tus acciones semánticas ...

    // Propiedades para almacenar resultados
    ast: null,    // Aquí se guardará el AST si Jison lo retorna/asigna
    env: null,    // Entorno global (se asignará después de la creación)
  };
  parser.yy = yyData; // Inyectar 'yy' en el parser

  let parseResult: any = null;
  let astDotString: string | null = null;
  let globalEnv: enviroment | null = null;

  try {
    // --- 1. Ejecutar Análisis ---
    parseResult = parser.parse(code); // Devuelve el AST (probablemente Instruccion[])

    // --- 2. Crear Entorno Global ---
    globalEnv = new enviroment(null, 'Global');
    yyData.env = globalEnv; // Exponerlo para recolección de símbolos y posible uso en Jison

    // --- 3. Ejecutar Interpretación ---
    let astInstructions: Instruccion[] = [];
    // Determinar dónde está el AST (lo que retorna parse o yy.ast)
    if (Array.isArray(parseResult) && parseResult.every(item => item instanceof Instruccion)) {
        astInstructions = parseResult;
        // Opcional: Si quieres que el AST para Graphviz venga de aquí
        // yyData.ast = parseResult; // Podrías asignar el array aquí
    } else if (yyData.ast && Array.isArray(yyData.ast)) {
         astInstructions = yyData.ast;
    } else {
         // Si no hay instrucciones, puede ser un archivo vacío o solo comentarios
         console.log("[Interpreter] No se encontraron instrucciones ejecutables en el AST.");
    }

    if (astInstructions.length > 0) {
        console.log(`[Interpreter] Ejecutando ${astInstructions.length} instrucciones globales...`);
        for (const instruction of astInstructions) {
            if (instruction && typeof instruction.play === 'function') {
                try {
                    // Ejecutar cada instrucción global en el entorno global
                    const result = instruction.play(globalEnv);
                    // Manejar señales globales como 'detener' o 'retornar' si aplican aquí
                    // (Normalmente solo aplican dentro de ciclos/funciones)
                } catch (runtimeError: any) {
                    console.error("[Interpreter Error] Error durante la ejecución:", runtimeError);
                    // Asegurarse de que el error se añade al array global
                    if (runtimeError instanceof CustomError) {
                       globalErrors.push(runtimeError);
                    } else {
                       globalErrors.push(new CustomError(
                           instruction.linea || 0, instruction.columna || 0,
                           ErroresTypes.RUNTIME, // Usar un tipo RUNTIME si lo tienes
                           runtimeError.message || 'Error desconocido en ejecución'
                       ));
                    }
                    // Decidir si continuar o detener la ejecución ante un error
                    // break; // Descomentar para detener en el primer error de ejecución
                }
            } else {
                 console.warn("[Interpreter] Se encontró un elemento no ejecutable en el AST:", instruction);
            }
        }
        console.log("[Interpreter] Ejecución global completada.");
    } else if (!yyData.ast && globalErrors.length === 0) {
        // Si no hubo instrucciones Y no hubo errores de parseo, es un archivo válido pero vacío
        console.log("[Interpreter] El archivo de entrada está vacío o solo contiene comentarios.");
    }


    // --- 4. Generación de DOT ---
    // Intentar obtener el AST de yyData.ast (si Jison lo asigna) o construir uno básico
    let astRootForDot: Node | Instruccion[] | null = yyData.ast || astInstructions;

    if (astRootForDot && astRootForDot instanceof Node && typeof astRootForDot.toGraphviz === 'function') {
        try {
            astDotString = astRootForDot.toGraphviz();
        } catch (graphvizError: any) {
            console.error("[AST] Error al generar Graphviz DOT desde Node:", graphvizError.message);
            globalErrors.push(new CustomError(0, 0, ErroresTypes.SEMANTICO, 'Error interno al generar grafo AST'));
        }
    } else if (Array.isArray(astRootForDot) && astRootForDot.length > 0) {
        // Si tenemos un array de instrucciones, crear un nodo raíz simple
        try {
            const rootWrapper = new Node('Programa');
            astRootForDot.forEach((inst, index) => {
                if (inst && inst.constructor) {
                    // Usar el nombre de la clase como etiqueta del nodo
                    let nodeName = inst.constructor.name || `Inst_${index}`;
                    // Simplificar nombres largos
                    nodeName = nodeName.replace('Statement', '').replace('Loop', '').replace('Declaration', '');
                    const childNode = new Node(nodeName);
                    // Podrías añadir más hijos si tus instrucciones tienen sub-expresiones/bloques
                    rootWrapper.addChild(childNode);
                }
            });
            astDotString = rootWrapper.toGraphviz();
        } catch (wrapError: any) {
            console.error("[AST] Error al generar Graphviz DOT wrapper:", wrapError.message);
            globalErrors.push(new CustomError(0, 0, ErroresTypes.SEMANTICO, 'Error interno al generar grafo AST wrapper'));
        }
    } else {
        console.log("[AST] No se generó AST o está vacío.");
        // Opcional: Generar un grafo vacío para indicar que no hay AST
        // astDotString = 'digraph AST {}';
    }

    // --- Recolectar Errores y Símbolos ---
    // Los errores ya se están pusheando a 'globalErrors' (yyData.errors)
    ReportStore.setErrors(normalizeErrors(globalErrors));
    ReportStore.setSymbols(collectSymbols(globalEnv)); // Usar el globalEnv creado

    // --- Respuesta JSON ---
    return res.json({
      ok: globalErrors.length === 0, // 'ok' es false si hubo errores
      result: {
          salidasConsola: salidasConsola // Enviar la salida de consola recolectada
      },
      errors: ReportStore.getErrors(),
      symbols: ReportStore.getSymbols(),
      ast: astDotString, // Enviar el string DOT (o null)
    });

  } catch (err: any) { // Capturar errores del PARSER (Jison)
    const msg = (err && err.message) ? err.message : String(err);
    console.error("[Parser Error]", msg);

    // Crear un objeto de error normalizado
    const thrownError = {
      tipo: 'Sintáctico',
      descripcion: msg.split('\n')[0],
      linea: err?.hash?.loc?.first_line ?? 0,
      columna: err?.hash?.loc?.first_column ?? 0,
      lexema: err?.hash?.text,
    };

    // Combinar errores recolectados por 'yy' con el error lanzado
    ReportStore.setErrors([
      ...normalizeErrors(globalErrors), // Usar globalErrors
      ...normalizeErrors([thrownError]),
    ]);

    // Intentar recolectar símbolos (puede haber algunos si el error fue tardío)
    ReportStore.setSymbols(collectSymbols(globalEnv)); // Usa globalEnv si se llegó a crear

    // Intentar generar AST DOT si se pudo parsear algo antes del error
    let astRootNodeOnError: Node | Instruccion[] | null = yyData.ast;
     if (astRootNodeOnError && astRootNodeOnError instanceof Node /*...*/) {
         try { astDotString = astRootNodeOnError.toGraphviz(); } catch {}
     } else if (Array.isArray(astRootNodeOnError) && astRootNodeOnError.length > 0) {
         try {
             const rootWrapper = new Node('Programa (parcial)');
             // ... (lógica similar a la del try para generar wrapper) ...
              astRootNodeOnError.forEach((inst, index) => { /* ... */ });
             astDotString = rootWrapper.toGraphviz();
         } catch {}
     }


    // Devolver respuesta OK=false pero con status 200
    return res.status(200).json({
      ok: false,
      result: { salidasConsola: salidasConsola },
      errors: ReportStore.getErrors(),
      symbols: ReportStore.getSymbols(),
      ast: astDotString, // Enviar AST parcial si se pudo generar
    });
  }
});

// ====== Endpoints para Reportes Individuales (Opcional) ======
app.get('/api/report/errors', (_req: Request, res: Response) => {
  res.json(ReportStore.getErrors());
});

app.get('/api/report/symbols', (_req: Request, res: Response) => {
  res.json(ReportStore.getSymbols());
});

// ====== Arranque del Servidor ======
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔌 Endpoint principal: POST /api/run`);
  console.log(`🩺 Endpoint de salud: GET /api/health`);
});