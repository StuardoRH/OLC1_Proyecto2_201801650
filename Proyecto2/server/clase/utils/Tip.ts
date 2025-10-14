export enum Tip{
    ENTERO,
    DECIMAL,
    BOOLEANO,
    CARACTER,
    CADENA,
    OBJETO,
    NULO,
    INVALIDO,
}
export type ReturnTip = {
    value: any,
    type: Tip
}