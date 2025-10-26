export type ErrorKind = "Léxico" | "Sintáctico" | "Semántico";

export interface ErrorRow {
  id: number;
  tipo: ErrorKind;
  descripcion: string;
  linea: number;
  columna: number;
  lexema?: string;
  esperado?: string[];
  entorno?: string;
}

export interface SymbolRow {
  id: number;
  nombre: string;
  clase: string;     // Variable | Lista | Función | Procedimiento | ...
  tipoDato: string;  // Entero, Cadena, Lista<Entero>, ...
  entorno: string;   // Global, Funcion1, ...
  valor: any;
  linea?: number;
  columna?: number;
}

