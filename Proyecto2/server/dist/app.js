"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// jison no trae tipos oficiales; usar require evita fricción con TS
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jison = require('jison');
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3001;
/* ================== CORS (cliente en 5173) ================== */
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
/* ================== Body JSON ================== */
app.use(express_1.default.json({ limit: '5mb' }));
/* ================== Paths de gramática ================== */
const GRAMMAR_DIR = path_1.default.resolve(__dirname, 'gramatica');
const CANDIDATES = ['Parser.jison', 'gramatica.jison'];
const GRAMMAR_PATH = CANDIDATES
    .map(n => path_1.default.join(GRAMMAR_DIR, n))
    .find(p => fs_1.default.existsSync(p));
if (!GRAMMAR_PATH) {
    console.error('[Jison] No se encontró Parser.jison ni gramatica.jison en', GRAMMAR_DIR);
    process.exit(1);
}
let parser = null;
/* ================== Construcción y recarga ================== */
function buildParserFromJison(filePath) {
    const grammar = fs_1.default.readFileSync(filePath, 'utf8');
    const p = new jison.Parser(grammar);
    return p;
}
function loadParser() {
    try {
        parser = buildParserFromJison(GRAMMAR_PATH);
        console.log('[Jison] Gramática compilada OK:', path_1.default.basename(GRAMMAR_PATH));
    }
    catch (err) {
        console.error('[Jison] Error al compilar la gramática:', err?.message ?? err);
        parser = null;
    }
}
loadParser();
fs_1.default.watchFile(GRAMMAR_PATH, { interval: 1000 }, () => {
    console.log('[Jison] Cambio detectado en la gramática. Recompilando…');
    try {
        loadParser();
        console.log('[Jison] Recompilación OK.');
    }
    catch (err) {
        console.error('[Jison] Falló la recompilación:', err?.message ?? err);
    }
});
/* ================== Rutas ================== */
app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        parserLoaded: Boolean(parser),
        grammarFile: path_1.default.basename(GRAMMAR_PATH),
    });
});
app.post('/api/run', (req, res) => {
    if (!parser) {
        return res.status(500).json({ ok: false, error: 'Parser no disponible.' });
    }
    const code = (req.body?.code ?? '');
    if (typeof code !== 'string') {
        return res.status(400).json({ ok: false, error: 'Debe enviar { code: string }.' });
    }
    parser.yy = {
        errors: [],
        ast: null,
        symbols: [],
    };
    try {
        const result = parser.parse(code);
        return res.json({
            ok: true,
            result,
            errors: parser.yy.errors || [],
            ast: parser.yy.ast || null,
            symbols: parser.yy.symbols || [],
        });
    }
    catch (err) {
        const msg = (err && err.message) ? err.message : String(err);
        const errors = Array.isArray(parser.yy?.errors) ? [...parser.yy.errors] : [];
        errors.push({ message: msg });
        return res.status(200).json({
            ok: false,
            result: null,
            errors,
            ast: parser.yy?.ast ?? null,
            symbols: parser.yy?.symbols ?? [],
        });
    }
});
/* ================== Inicio del servidor ================== */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
