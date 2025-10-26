//errtype
export enum ErroresTypes{
    LEXICO = 0,
    SINTACTICO = 1,
    SEMANTICO = 2,
    LEXICAL = LEXICO,
    SYNTACTIC = SINTACTICO,
    SEMANTIC = SEMANTICO,
    RUNTIME = "ERROR DE EJECUCION"

}

export const ErroresType = ErroresTypes;