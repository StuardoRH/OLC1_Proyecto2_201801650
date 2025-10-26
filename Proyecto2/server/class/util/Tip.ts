export enum Tip{
    ENTERO,
    DECIMAL,
    BOOLEANO,
    CARACTER,
    CADENA,
    OBJETO,
    NULO,
    INVALIDO,
    LISTA
}
export type ReturnTip = {
    value: any,
    tip: Tip
}