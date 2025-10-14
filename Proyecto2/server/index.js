const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jison = require('jison');

const app = express();
const PORT = process.env.PORT || 3001;

// === CORS: permite al cliente en 5173 ===
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Ruta absoluta al archivo gramatica.jison
// (equivalente a tu ruta de Windows, pero de forma portable)
const GRAMMAR_PATH = path.resolve(__dirname, 'gramatica', 'gramatica.jison');

let parser = null;

// Compila la gramática y retorna un parser Jison
function buildParser() {
  const grammar = fs.readFileSync(GRAMMAR_PATH, 'utf8');
  const p = new jison.Parser(grammar);
  return p;
}

// Carga inicial del parser
function loadParser() {
  try {
    parser = buildParser();
    console.log('[Jison] Gramática compilada OK:', GRAMMAR_PATH);
  } catch (err) {
    console.error('[Jison] Error al compilar la gramática:', err.message);
  }
}
loadParser();

// Recarga automática cuando el archivo .jison cambie
fs.watchFile(GRAMMAR_PATH, { interval: 1000 }, () => {
  console.log('[Jison] Detectado cambio en la gramática. Recompilando...');
  try {
    parser = buildParser();
    console.log('[Jison] Gramática recompilada OK.');
  } catch (err) {
    console.error('[Jison] Falló la recompilación:', err.message);
  }
});

// Salud
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, parserLoaded: !!parser });
});

// Ejecutar (parsear) el código que envía el cliente
app.post('/api/run', (req, res) => {
  if (!parser) {
    return res.status(500).json({ ok: false, error: 'Parser no disponible.' });
  }

  const code = req.body?.code ?? '';
  if (typeof code !== 'string') {
    return res.status(400).json({ ok: false, error: 'Debe enviar { code: string }.' });
  }

  // Espacio compartido para que tu gramática deposite datos (opcional)
  parser.yy = {
    errors: [],   // Llena esto desde tus reglas de error
    ast: null,    // Puedes construir el AST aquí
    symbols: [],  // Tabla de símbolos si la generas
    // ...cualquier otro contenedor que necesites
  };

  try {
    const result = parser.parse(code);

    // Respuesta estándar
    return res.json({
      ok: true,
      result,              // depende de lo que retorne tu gramática
      errors: parser.yy.errors || [],
      ast: parser.yy.ast || null,
      symbols: parser.yy.symbols || [],
    });
  } catch (err) {
    // Captura errores de Jison (sintaxis, etc.)
    const msg = (err && err.message) ? err.message : String(err);
    const errors = Array.isArray(parser.yy?.errors) ? parser.yy.errors.slice() : [];
    errors.push({ message: msg });

    return res.status(200).json({
      ok: false,
      result: null,
      errors,
      ast: parser.yy?.ast || null,
      symbols: parser.yy?.symbols || [],
    });
  }
});

// Stubs para reportes (cuando implementes analizadores/AST/TS)
app.get('/api/report/errors', (_req, res) => {
  res.status(501).json({ ok: false, message: 'Pendiente de implementación.' });
});
app.get('/api/report/ast', (_req, res) => {
  res.status(501).json({ ok: false, message: 'Pendiente de implementación.' });
});
app.get('/api/report/symbols', (_req, res) => {
  res.status(501).json({ ok: false, message: 'Pendiente de implementación.' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
