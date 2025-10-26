import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const ping = () => api.get("/api/health").then(r => r.data);

// cache en memoria del último run
let _last = { console: [], errors: [], symbols: [], ast: "" };

export const runCode = async (code) => {
  const data = await api.post("/api/run", { code }).then(r => r.data);
  // guarda todo para “selectores” locales
  _last = {
    console: Array.isArray(data.console) ? data.console : [],
    errors: Array.isArray(data.errors) ? data.errors : [],
    symbols: Array.isArray(data.symbols) ? data.symbols : [],
    ast: typeof data.ast === "string" ? data.ast : "",
  };
  return data;
};

// “método” igual que tenías, pero sin red:
export const getErrors = async () => _last.errors;
export const getAst = async () => _last.ast;
export const getSymbols = async () => _last.symbols;

export default api;



