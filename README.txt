Parser actualizado (con operador ternario ?:) y rutas ../class
----------------------------------------------------------------
Contenido:
- server/gramatica/Parser.jison

Uso:
1) Reemplaza tu archivo en <tu-proyecto>/server/gramatica/Parser.jison
   por el incluido en este ZIP.
2) Genera el parser:
     cd server/gramatica
     jison Parser.jison -o Parser.js
3) (Opcional TS) agrega // @ts-nocheck al inicio de Parser.js o exclúyelo del tsconfig.

Notas:
- Se agregaron tokens 'tok_interrogacion' y 'tok_dosPuntos'
  en el léxico, precedencia %right tok_ternario y la producción:
    TERNARIO : EXPR ? EXPR : EXPR %prec tok_ternario
- Se corrigieron imports a ../class/...
