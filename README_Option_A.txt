Opción A — Servidor solo con TypeScript (app.ts)
================================================

Archivos incluidos:
- server/app.ts
- server/tsconfig.json
- server/package.json

Pasos:
1) Copia la carpeta 'server' de este zip sobre tu proyecto (o mueve los archivos dentro de tu server).
2) Instala dependencias:
     cd server
     npm i
3) Desarrollo en caliente:
     npm run dev
   Compilar y ejecutar:
     npm run build && npm start

Notas:
- app.ts compila y recarga la gramática Jison en caliente desde:
    server/gramatica/Parser.jison  (o gramatica.jison si existe)
- Si ya tienes 'server/gramatica/Parser.jison', no necesitas cambiar rutas.
- Si tienes un antiguo index.js, puedes eliminarlo.
