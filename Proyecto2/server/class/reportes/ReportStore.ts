import { ErrorRow, SymbolRow } from "./types";

class _ReportStore {
  private _errors: ErrorRow[] = [];
  private _symbols: SymbolRow[] = [];

  clear() {
    this._errors = [];
    this._symbols = [];
  }

  setErrors(rows: Omit<ErrorRow, "id">[]) {
    this._errors = rows.map((r, i) => ({ id: i + 1, ...r }));
  }
  getErrors(): ErrorRow[] {
    return this._errors;
  }

  setSymbols(rows: Omit<SymbolRow, "id">[]) {
    this._symbols = rows.map((r, i) => ({ id: i + 1, ...r }));
  }
  getSymbols(): SymbolRow[] {
    return this._symbols;
  }
}

export const ReportStore = new _ReportStore();

