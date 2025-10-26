// analizador lexico 
%{
// jaavascript
    const { errores, tokens } = require('../class/util/out');
    const { Tokens } = require('../class/util/Tokens');
    const { Error } = require('../class/util/Error');
    const { ErroresTypes } = require ('../class/util/ErroresTypes')
    const { Ternario } = require ('../class/Expresiones/Ternario');
    /* ==== Manejo de errores global para NO detener el parseo ==== */

    if (typeof parser !== 'undefined') {
        const originalParseError = parser.parseError;
        parser.parseError = function (str, hash) {
            try {
                const loc = (hash && (hash.loc || (hash.lexer && hash.lexer.yylloc))) || { first_line: 0, first_column: 0 };
                const tok = (hash && hash.token) || '?';
                if (hash && hash.recoverable) {
                    errores.push(new Error(loc.first_line, loc.first_column + 1, ErroresTypes.SINTACTICO, `Error sintáctico, se recuperó en: «${tok}»`));
                    return; // permitir recuperación via reglas con 'error'
                }
                errores.push(new Error(loc.first_line, loc.first_column + 1, ErroresTypes.SINTACTICO, str));
            } catch (e) {
            // fallback: no lanzar
            }
        };
    }
%}
%lex
//Expresiones regulares para los tokens
UNUSED      [\s\r\t]+
CONTENT     ([^\n\"\\]|\\.)
ID          [a-zA-Z_][a-zA-Z0-9_]*
STRING      \"({CONTENT}*)\"
CHAR        \'({CONTENT})\'
INTEGER     [0-9]+\b
DOUBLE      [0-9]+\.[0-9]+\b
COMMENTS    \/\/.*
COMMENTM    [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]
DIMENSION   [1-3]
%%
//reglas semanticas
\n                      {}
{COMMENTS}              {}
{COMMENTM}              {}
{UNUSED}                {}
// === TOKENS ===
// === RESERVADAS ===

'imprimirLn' { 
    tokens.push(new Tokens('resw_imprimirLn', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_imprimirLn'; 
}
"imprimir"[ \t\r\n]+"nl" { 
    tokens.push(new Tokens('resw_imprimirLn', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_imprimirLn'; 
}
"de"[ \t\r\n]+"lo"[ \t\r\n]+"contrario" {
    tokens.push(new Tokens('resw_si_no', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_si_no';
}
"o"[ \t\r\n]+"si" {
    tokens.push(new Tokens('resw_si_no_si', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_si_no_si';
}
"fin"[ \t\r\n]+"si" {
    tokens.push(new Tokens('resw_fin_si', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_fin_si';
}
"fin"[ \t\r\n]+"para" {
    tokens.push(new Tokens('resw_fin_para', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_fin_para';
}
"fin"[ \t\r\n]+"mientras" {
    tokens.push(new Tokens('resw_fin_mientras', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_fin_mientras';
}
"fin"[ \t\r\n]+"funcion" {
    tokens.push(new Tokens('resw_fin_funcion', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_fin_funcion';
}
"fin"[ \t\r\n]+"procedimiento" {
    tokens.push(new Tokens('resw_fin_procedimiento', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_fin_procedimiento';
}
"fin"[ \t\r\n]+"segun" {
    tokens.push(new Tokens('resw_fin_segun', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_fin_segun';
}
"hasta"[ \t\r\n]+"que" {
    tokens.push(new Tokens('resw_hasta_que', 'reservada', yytext, yylloc.first_line, yylloc.first_column));
    return 'resw_hasta_que';
}

'imprimir' { 
    tokens.push(new Tokens('resw_imprimir', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_imprimir'; 
}
'con' { 
    tokens.push(new Tokens('resw_con', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_con'; 
}
'valor' { 
    tokens.push(new Tokens('resw_valor', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_valor'; 
}
'verdadero' { 
    tokens.push(new Tokens('resw_verdadero', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_verdadero';
}
'falso' { 
    tokens.push(new Tokens('resw_falso', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_falso'; 
}
'inc' { 
    tokens.push(new Tokens('resw_incremento', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_incremento';
}
'dec' { 
    tokens.push(new Tokens('resw_decremento', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_decremento';
}
'Lista' { 
    tokens.push(new Tokens('resw_lista', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_lista'; 
}
'si no si' {
    tokens.push(new Tokens('resw_si_no_si', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_si_no_si';
}
'si no' {
    tokens.push(new Tokens('resw_si_no', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_si_no';
}
'si' { 
    tokens.push(new Tokens('resw_si', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_si'; 
}
'entonces' { 
    tokens.push(new Tokens('resw_entonces', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_entonces'; 
}
'fin si' {
    tokens.push(new Tokens('resw_fin_si', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_fin_si';
}
'fin para' {
    tokens.push(new Tokens('resw_fin_para', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_fin_para';
}
'fin mientras' {
    tokens.push(new Tokens('resw_fin_mientras', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_fin_mientras';
}
'fin funcion' {
    tokens.push(new Tokens('resw_fin_funcion', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_fin_funcion';
}
'fin procedimiento' {
    tokens.push(new Tokens('resw_fin_procedimiento', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_fin_procedimiento';
}
'fin segun' {
    tokens.push(new Tokens('resw_fin_segun', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_fin_segun';
}
'de' { 
    tokens.push(new Tokens('resw_de', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_de'; 
}
'de lo contrario' { 
    tokens.push(new Tokens('resw_de_lo_contrario', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_de_lo_contrario'; 
}

// === TIPOS DE DATOS ===
'entero' { 
    tokens.push(new Tokens('resw_entero', 'tipo_dato', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_entero'; 
}
'decimal' { 
    tokens.push(new Tokens('resw_decimal', 'tipo_dato', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_decimal'; 
}
'booleano' { 
    tokens.push(new Tokens('resw_booleano', 'tipo_dato', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_booleano'; 
}
'caracter' { 
    tokens.push(new Tokens('resw_caracter', 'tipo_dato', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_caracter'; 
}
'cadena' { 
    tokens.push(new Tokens('resw_cadena', 'tipo_dato', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_cadena'; 
}
'para' { 
    tokens.push(new Tokens('resw_para', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_para'; 
}
'hasta que' {
    tokens.push(new Tokens('resw_hasta_que', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_hasta_que'; 
}
'hasta' { 
    tokens.push(new Tokens('resw_hasta', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_hasta'; 
}
'incremento'  { 
    tokens.push(new Tokens('resw_incremento_val', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_incremento_val'; 
}
'decremento'  { 
    tokens.push(new Tokens('resw_decremento_val', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_decremento_val'; 
}
'++' {
    tokens.push(new Tokens('resw_incremento_mas', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_incremento_mas'; 
}
'--' {
    tokens.push(new Tokens('resw_decremento_menos', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_decremento_menos'; 
}
'hacer' { 
    tokens.push(new Tokens('resw_hacer', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_hacer'; 
}
'mientras' { 
    tokens.push(new Tokens('resw_mientras', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_mientras'; 
}
'repetir' { 
    tokens.push(new Tokens('resw_repetir', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_repetir'; 
}
'detener' { 
    tokens.push(new Tokens('resw_detener', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_detener'; 
}
'continuar' { 
    tokens.push(new Tokens('resw_continuar', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_continuar'; 
}
'retornar' { 
    tokens.push(new Tokens('resw_retornar', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_retornar'; 
}
'regresar' { 
    tokens.push(new Tokens('resw_regresar', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_regresar'; 
}
'minuscula' { 
    tokens.push(new Tokens('resw_minuscula', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_minuscula'; 
}
'mayuscula' { 
    tokens.push(new Tokens('resw_mayuscula', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_mayuscula'; 
}
'longitud' { 
    tokens.push(new Tokens('resw_longitud', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_longitud'; 
}
'truncar' { 
    tokens.push(new Tokens('resw_truncar', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_truncar'; 
}
'redondear' { 
    tokens.push(new Tokens('resw_redondear', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_redondear'; 
}
'Tipo' { 
    tokens.push(new Tokens('resw_tipo', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_tipo'; 
}
'funcion' { 
    tokens.push(new Tokens('resw_funcion', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_funcion'; 
}
'procedimiento' { 
    tokens.push(new Tokens('resw_procedimiento', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_procedimiento'; 
}
'ejecutar' { 
    tokens.push(new Tokens('resw_ejecutar', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_ejecutar';
}
'segun' { 
    tokens.push(new Tokens('resw_segun', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_segun'; 
}
'caso' { 
    tokens.push(new Tokens('resw_caso', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_caso'; 
}
'en' { 
    tokens.push(new Tokens('resw_en', 'reservada', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'resw_en'; 
}

// === EXPRESIONES ===
{ID} { 
    tokens.push(new Tokens('tok_id', 'identificador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_id'; 
}
{STRING} { 
    yytext = yytext.substr(1,yyleng - 2); 
    tokens.push(new Tokens('tok_string', 'cadena', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_string'; 
}
{CHAR} { 
    yytext = yytext.substr(1,yyleng - 2); 
    tokens.push(new Tokens('tok_char', 'caracter', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_char'; 
}
{DOUBLE} { 
    tokens.push(new Tokens('tok_double', 'decimal', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_double'; 
}
{INTEGER} { 
    tokens.push(new Tokens('tok_int', 'entero', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_int'; 
}

// === ASIGNACION ===
'==' { 
    tokens.push(new Tokens('tok_igual', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_igual'; 
}
'=' { 
    tokens.push(new Tokens('tok_asign_igual', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_asign_igual'; 
}
// === RELACIONALES ===
'!=' { 
    tokens.push(new Tokens('tok_dif', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_dif'; 
}
'>=' { 
    tokens.push(new Tokens('tok_mayorIgual', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_mayorIgual'; 
}
'<=' { 
    tokens.push(new Tokens('tok_menorIgual', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_menorIgual'; 
}
'>' { 
    tokens.push(new Tokens('tok_mayor', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_mayor'; 
}
'<' { 
    tokens.push(new Tokens('tok_menor', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_menor'; 
}
// === LOGICOS ===
'&&' { 
    tokens.push(new Tokens('tok_and', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_and'; 
}
'||' { 
    tokens.push(new Tokens('tok_or', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_or'; 
}
'!' { 
    tokens.push(new Tokens('tok_not', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_not'; 
}
// === ARITMETICOS ====
'+' { 
    tokens.push(new Tokens('tok_sum', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_sum'; 
}
'-' { 
    tokens.push(new Tokens('tok_sub', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_sub'; 
}
'*' { 
    tokens.push(new Tokens('tok_mul', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_mul'; 
}
'/' { 
    tokens.push(new Tokens('tok_div', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_div'; 
}
'%' { 
    tokens.push(new Tokens('tok_mod', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_mod'; 
}
'^' { 
    tokens.push(new Tokens('tok_expo', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_expo'; 
}
// === SIGNOS DE AGRUPACION Y FINALIZACION ===
'(' { 
    tokens.push(new Tokens('tok_par_Abierto', 'agrupacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_par_Abierto'; 
}
')' { 
    tokens.push(new Tokens('tok_par_Cerrado', 'agrupacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_par_Cerrado'; 
}
',' { 
    tokens.push(new Tokens('tok_coma', 'separador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_coma'; 
}
'[' { 
    tokens.push(new Tokens('tok_cor_Abierto', 'agrupacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_cor_Abierto'; 
}
']' { 
    tokens.push(new Tokens('tok_cor_Cerrado', 'agrupacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_cor_Cerrado'; 
}
'{' { 
    tokens.push(new Tokens('tok_lla_Abierto', 'agrupacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_lla_Abierto'; 
}
'}' { 
    tokens.push(new Tokens('tok_lla_Cerrado', 'agrupacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_lla_Cerrado'; 
}
';' { 
    tokens.push(new Tokens('tok_pyc', 'puntuacion', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_pyc'; 
}
'?' { 
    tokens.push(new Tokens('tok_interrogacion', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_interrogacion'; 
}
':' { 
    tokens.push(new Tokens('tok_dosPuntos', 'operador', yytext, yylloc.first_line, yylloc.first_column)); 
    return 'tok_dosPuntos'; 
}

.                       { errores.push(new Error(yylloc.first_line, yylloc.first_column + 1, ErroresTypes.LEXICAL, `Caracter no reconocido «${yytext}»`)); }
<<EOF>>                 { return 'EOF'          }
/lex

// analizador sintactico
%{
    // Tipos
        const { Tip } = require ('../class/util/Tip')
        // Instrucciones
        const {Asignaciones} = require ('../class/Instrucciones/Asignaciones')
        const { DeclVar } = require ('../class/Instrucciones/DeclVar')
        const { Print } = require ('../class/Instrucciones/Print')
        const { Unario } = require ('../class/Instrucciones/Unario')
        const { If } = require ('../class/Instrucciones/If')
        const { ListaDecla } = require ('../class/Instrucciones/ListaDecla')
        const { ListasModificadas } = require ('../class/Instrucciones/ListasModificadas')
        const { For } = require ('../class/Instrucciones/For')
        const { While } = require ('../class/Instrucciones/While')
        const { DoWhile } = require ('../class/Instrucciones/DoWhile')
        const { Detener } = require ('../class/Instrucciones/Detener')
        const { Continuar } = require ('../class/Instrucciones/Continuar')
        const { Retornar } = require ('../class/Instrucciones/Retornar')
        const { Funcion } = require ('../class/Instrucciones/Funcion')
        const { Switch } = require ('../class/Instrucciones/Switch')
        const { Procedimiento } = require ('../class/Instrucciones/Procedimiento')
        const { Llamadas } = require ('../class/Instrucciones/Llamadas')
        // Expresiones
        const { Casteo } = require ('../class/Expresiones/Casteo')
        const { Primit } = require ('../class/Expresiones/Primit')
        const { Acces } = require ('../class/Expresiones/Acces')
        const { arits } = require ('../class/Expresiones/arits')
        const { Rel } = require ('../class/Expresiones/Rel')
        const { logic } = require ('../class/Expresiones/logic')
        const { AccessList } = require ('../class/Expresiones/AccesList')
        const { Minuscula } = require ('../class/Expresiones/Minuscula')
        const { Mayuscula } = require ('../class/Expresiones/Mayuscula')
        const { longitud } = require ('../class/Expresiones/longitud')
        const { Truncar } = require ('../class/Expresiones/Truncar')
        const { Tipo } = require ('../class/Expresiones/Tipo')
        const { Redo } = require ('../class/Expresiones/Redo')
        const { Parametro } = require ('../class/Expresiones/Parametro')
        const { LlamadaFuncion } = require ('../class/Expresiones/LlamadaFuncion')
        const { Return } = require ('../class/Expresiones/Return')

%}
//procedencia de operadores
%right tok_ternario
%left tok_or                // Operador OR (||) - menor precedencia
%left tok_and               // Operador AND (&&)
%right tok_not              // Operador NOT (!) - asociatividad por derecha
%left tok_igual tok_dif     // Operadores relacionales: ==, !=
%left tok_menor tok_menorIgual tok_mayor tok_mayorIgual // <, <=, >, >=
%left tok_sum tok_sub       // Operadores aritméticos: +, -
%left tok_mul tok_div tok_mod // Operadores aritméticos: *, /, %
%right tok_expo             // Operador exponente (^) - asociatividad por derecha
%right tok_negUna            // Operador unario negativo (-) - mayor precedencia
%nonassoc resw_retornar
%right tok_asign_igual
//Gramatica 
%start INICIO
%%
INICIO :
        INSTRUCCIONES EOF   {return $1} |
        EOF                 {return []} ;
INSTRUCCIONES :
        INSTRUCCIONES INSTRUCCION { if ($2 !== null && $2 !== undefined) { $1.push($2); } $$ = $1; } |
        INSTRUCCION         { $$ = []; if ($1 !== null && $1 !== undefined) { $$.push($1); } } ;
INSTRUCCION :
        DECLARACION tok_pyc             {$$ = $1} |
        ASIGNACION tok_pyc              {$$ = $1} |
        MODIFICACION_LISTA tok_pyc      {$$ = $1} |
        UNARIOS tok_pyc                 {$$ = $1} |
        IMPRIMIR tok_pyc                {$$ = $1} |
        CONDICION tok_pyc               {$$ = $1} |
        CICLO_PARA tok_pyc              {$$ = $1} |
        CICLO_MIENTRAS tok_pyc          {$$ = $1} |
        CICLO_REPETIR_HASTA tok_pyc     {$$ = $1} |
        SELECCION_MULTIPLE tok_pyc      {$$ = $1} |
        DETENER tok_pyc                 {$$ = $1} |
        CONTINUAR tok_pyc               {$$ = $1} |
        RETORNAR_SIN_VALOR tok_pyc      {$$ = $1} |
        RETORNAR_CON_VALOR tok_pyc      {$$ = $1} |
        FUNCION tok_pyc                 {$$ = $1} |
        PROCEDIMIENTO tok_pyc           {$$ = $1} |
        LLAMADA_PROCEDIMIENTO tok_pyc   {$$ = $1} |
        error tok_pyc                   {errores.push(new Error(this._$.first_line, this._$.first_column + 1, ErroresTypes.SYNTAX, `Error sintáctico, se recuperó en: «${yytext}»`))} 
        | error tok_pyc { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, se recuperó en: «;»')); $$ = null; }
        | error resw_fin_si { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, recuperación en «fin si»')); $$ = null; }
        | error resw_fin_para { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, recuperación en «fin para»')); $$ = null; }
        | error resw_fin_mientras { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, recuperación en «fin mientras»')); $$ = null; }
        | error resw_fin_funcion { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, recuperación en «fin funcion»')); $$ = null; }
        | error resw_fin_procedimiento { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, recuperación en «fin procedimiento»')); $$ = null; }
        | error resw_fin_segun { errores.push(new Error(@2.first_line, @2.first_column + 1, ErroresTypes.SINTACTICO, 'Error sintáctico, recuperación en «fin segun»')); $$ = null; }
 ;PROCEDIMIENTO :
        resw_procedimiento tok_id tok_par_Abierto PARAMETROS tok_par_Cerrado INSTRUCCIONES resw_fin_procedimiento 
            {$$ = new Procedimiento(@1.first_line, @1.first_column, $2, "Procedimiento", $4, $6)} |
        resw_procedimiento tok_id tok_par_Abierto tok_par_Cerrado INSTRUCCIONES resw_fin_procedimiento 
            {$$ = new Procedimiento(@1.first_line, @1.first_column, $2, "Procedimiento", [], $5)} ; 

LLAMADA_PROCEDIMIENTO :
        resw_ejecutar tok_id tok_par_Abierto tok_par_Cerrado 
            {$$ = new Llamadas(@1.first_line, @1.first_column, $2, [])} |
        resw_ejecutar tok_id tok_par_Abierto LISTA_EXPRESIONES tok_par_Cerrado 
            {$$ = new Llamadas(@1.first_line, @1.first_column, $2, $4)} ;

SELECCION_MULTIPLE :
    resw_segun tok_par_Abierto EXPR tok_par_Cerrado resw_hacer LISTA_CASOS OPCIONAL_DEFAULT resw_fin_segun {
        $$ = new Switch(@1.first_line, @1.first_column, $3, $6, $7);
    };

LISTA_CASOS :
    LISTA_CASOS CASO { $1.push($2); $$ = $1; } |
    CASO { $$ = [$1]; };

CASO :
    resw_en resw_caso EXPR resw_entonces tok_dosPuntos INSTRUCCIONES resw_detener {
        $$ = { condition: $3, body: $6 };
    };

OPCIONAL_DEFAULT :
    resw_de_lo_contrario resw_entonces tok_dosPuntos INSTRUCCIONES resw_detener {
        $$ = $4; // Guardar las instrucciones del caso por defecto
    } |
    /* Vacío */ {
        $$ = null; // No hay caso por defecto
    };

FUNCION :
        resw_funcion tok_id tok_par_Abierto PARAMETROS tok_par_Cerrado TIPO INSTRUCCIONES resw_fin_funcion 
            {$$ = new Funcion(@1.first_line, @1.first_column, $2, $6, $4, $7)} |
        resw_funcion tok_id tok_par_Abierto tok_par_Cerrado TIPO INSTRUCCIONES resw_fin_funcion 
            {$$ = new Funcion(@1.first_line, @1.first_column, $2, $5, [], $6)} ;
 
PARAMETROS :
        PARAMETROS tok_coma PARAMETRO {$$.push($3)} |
        PARAMETRO {$$ = [$1]} ;

PARAMETRO :
        tok_id TIPO {$$ = new Parametro(@1.first_line, @1.first_column, $1, $2)} ;

LLAMAR_FUNCIONE :
        tok_id tok_par_Abierto tok_par_Cerrado {$$ = new LlamadaFuncion(@1.first_line, @1.first_column, $1, [])} |
        tok_id tok_par_Abierto LISTA_EXPRESIONES tok_par_Cerrado {$$ = new LlamadaFuncion(@1.first_line, @1.first_column, $1, $3)} ;

DETENER :
    resw_detener {  $$ = new Detener(@1.first_line, @1.first_column); } ;

CONTINUAR :
    resw_continuar {$$ = new Continuar(@1.first_line, @1.first_column);};

RETORNAR_CON_VALOR :
    resw_retornar EXPR {  $$ = new Return(@1.first_line, @1.first_column, $2);};

RETORNAR_SIN_VALOR :
    resw_regresar {  $$ = new Retornar(@1.first_line, @1.first_column);};

CICLO_PARA :
    resw_para tok_id tok_asign_igual EXPR resw_hasta EXPR resw_con VALOR_INC_DEC EXPR resw_hacer INSTRUCCIONES resw_fin_para
    {
        $$ = new For(@1.first_line, @1.first_column, $2, $4, $6, $8, $9, $11);
    };
VALOR_INC_DEC :
    resw_incremento_val { $$ = $1 } |
    resw_decremento_val { $$ = $1 } ;

CICLO_MIENTRAS :
    resw_mientras tok_par_Abierto EXPR tok_par_Cerrado resw_hacer INSTRUCCIONES resw_fin_mientras
    { $$ = new While(@1.first_line, @1.first_column, $3, $6); }; // Se usa 'While' en lugar de 'While'

CICLO_REPETIR_HASTA :
    resw_repetir INSTRUCCIONES resw_hasta_que tok_par_Abierto EXPR tok_par_Cerrado
    {
        $$ = new DoWhile(@1.first_line, @1.first_column, $2, $5);
    };

CONDICION:
        SI_SIMPLE { $$ = $1 } |
        SI_COMPLETO { $$ = $1 } |
        SI_MULTIPLE { $$ = $1 } |
        SI_MULTIPLE_SINO { $$ = $1 };
SI_SIMPLE:
        resw_si tok_par_Abierto EXPR tok_par_Cerrado resw_entonces INSTRUCCIONES resw_fin_si
        { $$ = new If(@1.first_line, @1.first_column, $3, $6, null) };
SI_COMPLETO:
        resw_si tok_par_Abierto EXPR tok_par_Cerrado resw_entonces INSTRUCCIONES resw_si_no INSTRUCCIONES resw_fin_si
        { $$ = new If(@1.first_line, @1.first_column, $3, $6, $8) };
SI_MULTIPLE:
        resw_si tok_par_Abierto EXPR tok_par_Cerrado resw_entonces INSTRUCCIONES LISTA_ELSEIF resw_fin_si
        { $$ = new If(@1.first_line, @1.first_column, $3, $6, null, $7) };
SI_MULTIPLE_SINO:
        resw_si tok_par_Abierto EXPR tok_par_Cerrado resw_entonces INSTRUCCIONES LISTA_ELSEIF resw_si_no INSTRUCCIONES resw_fin_si
        { $$ = new If(@1.first_line, @1.first_column, $3, $6, $9, $7) };
LISTA_ELSEIF:
        LISTA_ELSEIF ELSEIF { $1.push($2); $$ = $1 } |
        ELSEIF { $$ = [$1] };
ELSEIF:
        resw_si_no_si tok_par_Abierto EXPR tok_par_Cerrado resw_entonces INSTRUCCIONES
        { $$ = { condition: $3, body: $6 } };

UNARIOS :
        resw_incremento tok_par_Abierto tok_id tok_par_Cerrado {$$ = new Unario(@1.first_line, @1.first_column, $1,$3)} |
        resw_decremento tok_par_Abierto tok_id tok_par_Cerrado {$$ = new Unario(@1.first_line, @1.first_column, $1,$3)} |
        tok_id resw_incremento_mas {$$ = new Unario(@1.first_line, @1.first_column, $2,$1)} |
        tok_id resw_decremento_menos {$$ = new Unario(@1.first_line, @1.first_column, $2,$1)} ;
        
ASIGNACION :
    tok_id tok_asign_igual EXPR { $$ = new Asignaciones(@1.first_line, @1.first_column, [$1], [$3]) };

DECLARACION :
    TIPO LISTA_DECLARACIONES { $$ = new DeclVar(@1.first_line, @1.first_column, $2, $1, undefined)} |
    TIPO LISTA_DECLARACIONES tok_asign_igual LISTA_EXPRESIONES { $$ = new DeclVar(@1.first_line, @1.first_column, $2, $1, $4) } |
    TIPO LISTA_DECLARACIONES resw_con resw_valor LISTA_EXPRESIONES { $$ = new DeclVar(@1.first_line, @1.first_column, $2, $1, $5) } |
    // Declaracion Vector Tipo 1: Lista v[10] de entero;
    resw_lista tok_id tok_cor_Abierto EXPR tok_cor_Cerrado resw_de TIPO {
        $$ = new ListaDecla(@1.first_line, @1.first_column, $2, $4, $7, null);
    } |
    // Declaracion Vector Tipo 2: Lista v = {1,2,3};
    resw_lista tok_id tok_asign_igual tok_lla_Abierto LISTA_CONTENIDO tok_lla_Cerrado {
        $$ = new ListaDecla(@1.first_line, @1.first_column, $2, null, null, $5);
    } |
    // Declaracion Vector Tipo 2 (vacio): Lista v = {};
    resw_lista tok_id tok_asign_igual tok_lla_Abierto tok_lla_Cerrado {
        $$ = new ListaDecla(@1.first_line, @1.first_column, $2, null, null, []);
    } ;


LISTA_DECLARACIONES :
    tok_id { $$ = [$1] } |
    LISTA_DECLARACIONES tok_coma tok_id { $1.push($3); $$ = $1 };

LISTA_EXPRESIONES :
    EXPR { $$ = [$1] } | 
    LISTA_EXPRESIONES tok_coma EXPR { $1.push($3); $$ = $1 } ;

LISTA_CONTENIDO :
    ELEMENTO { $$ = [$1]; } |
    LISTA_CONTENIDO tok_coma ELEMENTO { $1.push($3); $$ = $1; };

ELEMENTO :
    EXPR { $$ = $1; } |
    tok_lla_Abierto LISTA_CONTENIDO tok_lla_Cerrado { $$ = $2; }; // Para listas anidadas

MODIFICACION_LISTA :
    ACCESO_LISTA tok_asign_igual EXPR { $$ = new ListasModificadas(@1.first_line, @1.first_column, $1, $3); };

IMPRIMIR :
        resw_imprimir tok_par_Abierto EXPR tok_par_Cerrado {$$ = new Print(@1.first_line, @1.first_column, $3, false)} |
        resw_imprimirLn tok_par_Abierto EXPR tok_par_Cerrado {$$ = new Print(@1.first_line, @1.first_column, $3, true)} ;

CASTEO :
        tok_par_Abierto TIPO tok_par_Cerrado EXPR_CASTEO {$$ = new Casteo(@1.first_line, @1.first_column, $2, $4)} ;
EXPR_CASTEO :
        tok_id         { $$ = new Acces(@1.first_line, @1.first_column, $1); } |
        tok_string     { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.CADENA); } |
        tok_char       { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.CARACTER); } |
        tok_double     { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.DECIMAL); } |
        tok_int        { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.ENTERO); } ;    
EXPR :
    TERNARIO     { $$ = $1; } |
    ARITMETICOS  { $$ = $1; } |
    ACCESO_LISTA   { $$ = $1; } |
    RELACIONALES   { $$ = $1; } |
    LOGICOS      { $$ = $1; } |
    FUNCIONES_NAT { $$ = $1; } |
    CASTEO       { $$ = $1; } |  
    LLAMAR_FUNCIONE { $$ = $1; } |
    tok_id         { $$ = new Acces(@1.first_line, @1.first_column, $1); } |
    resw_verdadero { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.BOOLEANO); } |
    resw_falso     { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.BOOLEANO); } |
    tok_string     { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.CADENA); } |
    tok_char       { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.CARACTER); } |
    tok_double     { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.DECIMAL); } |
    tok_int        { $$ = new Primit(@1.first_line, @1.first_column, $1, Tip.ENTERO); } |
    tok_par_Abierto EXPR tok_par_Cerrado { $$ = $2; }  // Paréntesis agrupados
    ;

TERNARIO :
    EXPR tok_interrogacion EXPR tok_dosPuntos EXPR %prec tok_ternario
      { $$ = new Ternario(@1.first_line, @1.first_column, $1, $3, $5); } 
    ;

FUNCIONES_NAT :
    resw_minuscula tok_par_Abierto EXPR tok_par_Cerrado     { $$ = new Minuscula(@1.first_line, @1.first_column, $3); } |
    resw_mayuscula tok_par_Abierto EXPR tok_par_Cerrado     { $$ = new Mayuscula(@1.first_line, @1.first_column, $3); } |
    resw_longitud tok_par_Abierto EXPR tok_par_Cerrado      { $$ = new longitud(@1.first_line, @1.first_column, $3); } |
    resw_truncar tok_par_Abierto EXPR tok_par_Cerrado       { $$ = new Truncar(@1.first_line, @1.first_column, $3); } |
    resw_redondear tok_par_Abierto EXPR tok_par_Cerrado     { $$ = new Redo(@1.first_line, @1.first_column, $3); } |
    resw_tipo tok_par_Abierto EXPR tok_par_Cerrado          { $$ = new Tipo(@1.first_line, @1.first_column, $3); }
    ;

ACCESO_LISTA :
    tok_id tok_cor_Abierto EXPR tok_cor_Cerrado { $$ = new AccessList(@1.first_line, @1.first_column, $1, [$3]); } |
    ACCESO_LISTA tok_cor_Abierto EXPR tok_cor_Cerrado {$1.indices.push($3);$$ = $1;};

RELACIONALES :
        EXPR tok_igual EXPR {$$ = new Rel(@1.first_line, @1.first_column, $1, $2, $3)} |
        EXPR tok_dif   EXPR {$$ = new Rel(@1.first_line, @1.first_column, $1, $2, $3)} |
        EXPR tok_mayor EXPR {$$ = new Rel(@1.first_line, @1.first_column, $1, $2, $3)} |
        EXPR tok_menor  EXPR {$$ = new Rel(@1.first_line, @1.first_column, $1, $2, $3)} |
        EXPR tok_mayorIgual EXPR {$$ = new Rel(@1.first_line, @1.first_column, $1, $2, $3)} |
        EXPR tok_menorIgual EXPR {$$ = new Rel(@1.first_line, @1.first_column, $1, $2, $3)} ;
LOGICOS : 
        EXPR tok_and EXPR {$$ = new logic(@1.first_line, @1.first_column, $1, $2, $3)} |
        EXPR tok_or  EXPR {$$ = new logic(@1.first_line, @1.first_column, $1, $2, $3)} |
        tok_not EXPR     {$$ = new logic(@1.first_line, @1.first_column, $1, $1, $2)} ;
ARITMETICOS :
        EXPR tok_sum EXPR {$$ = new arits(@1.first_line, @1.first_column, $1, '+', $3)} | 
        EXPR tok_sub EXPR {$$ = new arits(@1.first_line, @1.first_column, $1, '-', $3)} | 
        EXPR tok_mul EXPR {$$ = new arits(@1.first_line, @1.first_column, $1, '*', $3)} | 
        EXPR tok_div EXPR {$$ = new arits(@1.first_line, @1.first_column, $1, '/', $3)} | 
        EXPR tok_mod EXPR {$$ = new arits(@1.first_line, @1.first_column, $1, '%', $3)} | 
        EXPR tok_expo EXPR {$$ = new arits(@1.first_line, @1.first_column, $1, '^', $3)} | 
        tok_sub EXPR %prec tok_negUna {$$ = new arits(@1.first_line, @1.first_column, null, '-', $2)} ;

TIPO :
        resw_entero     { $$ = Tip.ENTERO } |
        resw_decimal    { $$ = Tip.DECIMAL } |
        resw_booleano   { $$ = Tip.BOOLEANO } |
        resw_caracter   { $$ = Tip.CARACTER } |
        resw_cadena     { $$ = Tip.CADENA } ;


