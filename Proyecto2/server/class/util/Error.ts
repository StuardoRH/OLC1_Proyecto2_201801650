import { ErroresTypes } from './ErroresTypes';

export class Error {
  public linea: number;
  public columna: number;
  public tipo: ErroresTypes;
  public mensaje: string;

  // Sobrecargas (para el checker)
  constructor(tipo: ErroresTypes, linea: number, columna: number, mensaje: string);
  constructor(linea: number, columna: number, tipo: ErroresTypes, mensaje: string);

  // Implementación compatible
  constructor(a: number | ErroresTypes, b: number, c: number | ErroresTypes, d: string) {
    if (typeof a === 'number' && typeof c !== 'number') {
      // new Error(linea, columna, tipo, mensaje)
      this.linea = a;
      this.columna = b;
      this.tipo = c as ErroresTypes;
      this.mensaje = d;
    } else {
      // new Error(tipo, linea, columna, mensaje)
      this.tipo = a as ErroresTypes;
      this.linea = b;
      this.columna = c as number;
      this.mensaje = d;
    }
  }
}
