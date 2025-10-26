"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectAcces = void 0;
const exp_1 = require("../abs/exp");
const Tip_1 = require("../util/Tip");
const expresionsTypes_1 = require("../util/expresionsTypes");
class ObjectAcces extends exp_1.Exp {
    constructor(linea, columna, id) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.ACCESO_ID);
        this.id = id;
    }
    play(entorno) {
        const valor = entorno.getObjeto(this.id);
        if (valor) {
            return { value: valor?.id, tip: Tip_1.Tip.OBJETO };
        }
        return { value: 'NULL', tip: Tip_1.Tip.NULO };
    }
}
exports.ObjectAcces = ObjectAcces;
