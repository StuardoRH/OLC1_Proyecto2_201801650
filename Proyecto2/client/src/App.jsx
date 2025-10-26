import { useEffect, useRef, useState } from "react";
import { ping, runCode, getErrors, getAst, getSymbols } from "./lib/api";
import "./App.css";

// Usa TUS componentes reales
import Editor from "./components/Editor";                 // espera: initialCode, onChange
import ConsoleOutput from "./components/ConsoleOutput";   // espera: lines (string[])
import ErrorTable from "./components/ErrorTable";         // espera: errors (array)
import SymbolTable from "./components/SymbolTable";       // espera: symbols (array)
import AstVisualizer from "./components/AstVisualizer";   // espera: data (string DOT)

export default function App() {
  // ======= Estado =======
  const [entrada, setEntrada]   = useState("");
  const [consola, setConsola]   = useState("Listo.\n");
  const [fileName, setFileName] = useState("untitled.code");

  // Nuevos: para mostrar reportes
  const [errors, setErrors]   = useState([]);  // [{tipo, descripcion, linea, columna}]
  const [symbols, setSymbols] = useState([]);  // [{id, tipo, nombreEntorno, valor, linea, columna}]
  const [astDot, setAstDot]   = useState("");  // string DOT: "digraph G { ... }"

  const fileInputRef = useRef(null);

  // ======= Ping inicial =======
  useEffect(() => {
    ping()
      .then((info) => {
        logToConsole(`[Server] ONLINE – grammar: ${info.grammarFile ?? "?"}\n`);
      })
      .catch(() => {
        logToConsole("[Server] OFFLINE — verifica el puerto del backend\n");
      });
  }, []);

  // ======= Utilidades =======
  const logToConsole = (msg) => setConsola((prev) => (prev ?? "") + msg);

  // ======= Archivo =======
  const crearArchivo = () => {
    setEntrada("");
    setFileName("untitled.code");
    logToConsole("[Archivo] Nuevo archivo creado.\n");
  };

  const abrirArchivo = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".code")) {
      alert("Seleccione un archivo con extensión .code");
      return;
    }
    const text = await file.text();
    setEntrada(text);
    setFileName(file.name);
    logToConsole(`[Archivo] Se abrió: ${file.name}\n`);
  };

  const guardarArchivo = () => {
    try {
      let name = fileName || "archivo.code";
      const nuevo = prompt("Guardar como:", name);
      if (nuevo && nuevo.trim().length > 0) {
        name = nuevo.trim().toLowerCase().endsWith(".code")
          ? nuevo.trim()
          : `${nuevo.trim()}.code`;
        setFileName(name);
      }
      const blob = new Blob([entrada ?? ""], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      logToConsole(`[Archivo] Guardado: ${name}\n`);
    } catch (err) {
      console.error(err);
      logToConsole(`[Error] No se pudo guardar: ${err?.message ?? err}\n`);
    }
  };

  // ======= Backend / Correr =======
  const correrPrograma = async () => {
    logToConsole("[Correr] Enviando código al servidor...\n");
    try {
      // Server responde: { ok, result, errors, ast, symbols }
      const res = await runCode(entrada);

      // Consola
      if (res.ok) {
        logToConsole(`[Resultado]\n${JSON.stringify(res.result, null, 2)}\n`);
      } else {
        logToConsole(`[Errores]\n${JSON.stringify(res.errors ?? [], null, 2)}\n`);
      }

      // Reportes (refleja el estado en UI)
      setErrors(Array.isArray(res.errors) ? res.errors : []);
      setSymbols(Array.isArray(res.symbols) ? res.symbols : []);
      setAstDot(typeof res.ast === "string" ? res.ast : "");

      // Pequeños avisos
      if (Array.isArray(res.errors) && res.errors.length) {
        logToConsole(`[Avisos]\n${JSON.stringify(res.errors, null, 2)}\n`);
      }
      if (Array.isArray(res.symbols) && res.symbols.length) {
        logToConsole(`[Símbolos]\n${res.symbols.length} símbolos generados.\n`);
      }
      if (typeof res.ast === "string" && res.ast.trim()) {
        logToConsole(`[AST] DOT recibido (${res.ast.length} chars).\n`);
      }
    } catch (err) {
      logToConsole(`[Error] ${err?.message ?? err}\n`);
    }
  };

  // ======= Reportes (botones del menú) =======
  const reporteErrores = async () => {
    try {
      const r = await getErrors();
      setErrors(Array.isArray(r) ? r : []);
      logToConsole(`[Reporte Errores]\n${JSON.stringify(r, null, 2)}\n`);
    } catch {
      logToConsole("[Reporte] Errores: pendiente de implementación.\n");
    }
  };

  const generarAST = async () => {
    try {
      const r = await getAst();
      setAstDot(typeof r === "string" ? r : "");
      logToConsole(
        `[AST] DOT ${typeof r === "string" ? `(${r.length} chars)` : "no recibido"}\n`
      );
    } catch {
      logToConsole("[Reporte] AST: pendiente de implementación.\n");
    }
  };

  const reporteSimbolos = async () => {
    try {
      const r = await getSymbols();
      setSymbols(Array.isArray(r) ? r : []);
      logToConsole(`[Símbolos]\n${JSON.stringify(r, null, 2)}\n`);
    } catch {
      logToConsole("[Reporte] Tabla de Símbolos: pendiente de implementación.\n");
    }
  };

  // ======= Atajos (Ctrl/Cmd+S para guardar) =======
  useEffect(() => {
    const onKey = (ev) => {
      const s = ev.key.toLowerCase() === "s";
      if ((ev.ctrlKey || ev.metaKey) && s) {
        ev.preventDefault();
        guardarArchivo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entrada, fileName]);

  // ======= UI =======
  return (
    <div style={styles.app}>
      {/* Barra superior */}
      <div style={styles.topbar}>
        <span style={styles.brand}>SimpliCode – Editor</span>

        {/* Menú simple */}
        <div style={{ display: "flex", gap: 8 }}>
          <Dropdown label="Archivo">
            <button style={styles.item} onClick={crearArchivo}>Crear Archivo</button>
            <hr style={styles.hr} />
            <button style={styles.item} onClick={abrirArchivo}>Abrir Archivo (.code)</button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".code"
              onChange={onFileSelected}
              style={{ display: "none" }}
            />
            <hr style={styles.hr} />
            <button style={styles.item} onClick={guardarArchivo}>Guardar Archivo</button>
          </Dropdown>

          <Dropdown label="Reportes">
            <button style={styles.item} onClick={reporteErrores}>Reporte de Errores</button>
            <hr style={styles.hr} />
            <button style={styles.item} onClick={generarAST}>Generar Árbol AST</button>
            <hr style={styles.hr} />
            <button style={styles.item} onClick={reporteSimbolos}>Tabla de Símbolos</button>
          </Dropdown>

          <Dropdown label="Correr">
            <button style={{ ...styles.item, fontWeight: 700 }} onClick={correrPrograma}>
              Ejecutar Programa
            </button>
          </Dropdown>
        </div>
      </div>

      {/* Layout principal */}
      <div style={styles.main}>
        {/* Editor */}
        <section style={styles.pane}>
          <div style={styles.paneHeader}>
            Área de Entrada — <span style={{ opacity: 0.7 }}>{fileName}</span>
          </div>
          <div style={{ flex: 1, minHeight: 0, border: "1px solid #1f2937", borderRadius: 8, overflow: "hidden" }}>
            {/* Tu Editor.jsx acepta initialCode y onChange */}
            <Editor initialCode={entrada} onChange={setEntrada} />
          </div>
        </section>

        <div style={styles.divider} />

        {/* Consola (usa ConsoleOutput con lines[]) */}
        <section style={styles.pane}>
          <div style={styles.paneHeader}>Consola</div>
          <div style={{ flex: 1, minHeight: 0, border: "1px solid #1f2937", borderRadius: 8, overflow: "hidden" }}>
            <ConsoleOutput lines={(consola ?? "").split("\n")} />
          </div>
        </section>
      </div>

      {/* Reportes: Errores | Símbolos | AST */}
      <div style={styles.reportsRow}>
        <div style={styles.reportCard}>
          <div style={styles.cardHeader}>Errores</div>
          <ErrorTable errors={errors} />
        </div>

        <div style={styles.reportCard}>
          <div style={styles.cardHeader}>Tabla de Símbolos</div>
          <SymbolTable symbols={symbols} />
        </div>

        <div style={styles.reportCard}>
          <div style={styles.cardHeader}>Árbol AST</div>
          <div style={{ padding: 10 }}>
            <AstVisualizer data={astDot} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= UI helpers ========= */
function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={styles.dropdownBtn}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      >
        {label}
      </button>
      {open && (
        <div style={styles.dropdownContent}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ========= Estilos ========= */
const styles = {
  app: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "#e2e8f0",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    borderBottom: "1px solid #1f2937",
    gap: 12,
    background: "#0b1220",
  },
  brand: { fontWeight: 700 },
  dropdownBtn: {
    background: "transparent",
    color: "#f8fafc",
    border: "1px solid #334155",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  dropdownContent: {
    position: "absolute",
    top: "110%",
    left: 0,
    minWidth: 220,
    background: "#0f172a",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    borderRadius: 8,
    boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
    overflow: "hidden",
    zIndex: 20,
  },
  item: {
    width: "100%",
    background: "transparent",
    color: "#e5e7eb",
    textAlign: "left",
    padding: "8px 12px",
    border: "none",
    cursor: "pointer",
  },
  hr: { margin: 0, border: "none", borderTop: "1px solid #1f2937" },
  main: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1px 1fr",
    gap: 12,
    padding: 12,
    minHeight: 0,
  },
  pane: {
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  paneHeader: {
    padding: "6px 8px",
    borderBottom: "1px solid #1f2937",
    background: "#0f172a",
    color: "#cbd5e1",
    fontWeight: 600,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  divider: { width: 1, background: "#1f2937" },
  reportsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
    padding: 12,
    borderTop: "1px solid #1f2937",
  },
  reportCard: {
    minHeight: 0,
    border: "1px solid #1f2937",
    borderRadius: 10,
    background: "#0b1220",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "8px 12px",
    borderBottom: "1px solid #1f2937",
    fontWeight: 600,
    background: "#0f172a",
  },
};
