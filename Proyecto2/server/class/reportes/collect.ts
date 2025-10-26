import { ErrorRow, ErrorKind, SymbolRow } from "./types";

/* ====== ERRORES ====== */
function inferKind(e: any): ErrorKind {
  const raw = e?.tipo ?? e?.type ?? e?.category ?? e?.kind ?? e?.Tipo ?? e?.Type ?? e?.Category;
  const s = String(raw ?? "").toLowerCase();
  if (s.includes("lex")) return "Léxico";
  if (s.includes("sint")) return "Sintáctico";
  if (s.includes("sem")) return "Semántico";
  if ((e?.name ?? "").toLowerCase().includes("syntax")) return "Sintáctico";
  return "Semántico";
}

export function normalizeErrors(input: any[]): Omit<ErrorRow, "id">[] {
  if (!Array.isArray(input)) return [];
  return input.map((e: any) => {
    const tipo = inferKind(e);
    const linea = Number(e?.linea ?? e?.line ?? e?.fila ?? e?.row ?? e?.yylineno ?? 0) || 0;
    const columna = Number(e?.columna ?? e?.column ?? e?.col ?? e?.yycolno ?? 0) || 0;
    const descripcion = e?.descripcion ?? e?.mensaje ?? e?.message ?? "Error";
    const lexema = e?.lexema ?? e?.yytext ?? undefined;
    const esperado = Array.isArray(e?.esperado) ? e.esperado : undefined;
    const entorno = e?.entorno ?? undefined;
    return { tipo, descripcion, linea, columna, lexema, esperado, entorno };
  });
}

/* ====== SÍMBOLOS ====== */
function tipToString(tip: any): string {
  try {
    if (tip != null && typeof tip === "number" && (global as any).Tip) {
      const name = (global as any).Tip[tip];
      if (name) return String(name);
    }
  } catch {}
  return typeof tip === "string" ? tip : String(tip ?? "");
}

function guessClase(sym: any): string {
  return sym?.clase ?? sym?.rol ?? sym?.role ?? (sym?.isFunction ? "Función" : sym?.isProcedure ? "Procedimiento" : "Variable");
}

function guessTipo(sym: any): string {
  if (sym?.tipo != null) return tipToString(sym.tipo);
  if (typeof sym?.type === "string") return sym.type;
  return "—";
}

function guessValor(sym: any): any {
  if ("valor" in (sym ?? {})) return sym.valor;
  if ("value" in (sym ?? {})) return sym.value;
  if ("contenido" in (sym ?? {})) return sym.contenido;
  return undefined;
}

function guessPos(sym: any): { linea?: number; columna?: number } {
  const linea = Number(sym?.linea ?? sym?.line ?? sym?.fila) || undefined;
  const columna = Number(sym?.columna ?? sym?.column ?? sym?.col) || undefined;
  return { linea, columna };
}

export function collectSymbols(envRoot: any): Omit<SymbolRow, "id">[] {
  if (!envRoot) return [];
  const rows: Omit<SymbolRow, "id">[] = [];

  const visitEnv = (env: any) => {
    const entornoNombre = env?.nombre ?? env?.name ?? env?.scopeName ?? "Global";

    const candidateTables = [
      env?.tabla, env?.tablaVariables, env?.variables, env?.simbolos,
      env?.symbols, env?.table
    ].filter(Boolean);

    for (const table of candidateTables) {
      if (table instanceof Map) {
        for (const [k, sym] of table.entries()) {
          const nombre = sym?.id ?? sym?.nombre ?? sym?.name ?? k;
          const clase = guessClase(sym);
          const tipoDato = guessTipo(sym);
          const valor = guessValor(sym);
          const { linea, columna } = guessPos(sym);
          rows.push({ nombre, clase, tipoDato, entorno: entornoNombre, valor, linea, columna });
        }
      } else if (typeof table === "object" && table) {
        for (const k of Object.keys(table)) {
          const sym: any = (table as any)[k];
          const nombre = sym?.id ?? sym?.nombre ?? sym?.name ?? k;
          const clase = guessClase(sym);
          const tipoDato = guessTipo(sym);
          const valor = guessValor(sym);
          const { linea, columna } = guessPos(sym);
          rows.push({ nombre, clase, tipoDato, entorno: entornoNombre, valor, linea, columna });
        }
      }
    }

    const childs = ([] as any[]).concat(env?.hijos ?? env?.childs ?? env?.children ?? []);
    childs.forEach(visitEnv);
  };

  visitEnv(envRoot);
  return rows;
}
