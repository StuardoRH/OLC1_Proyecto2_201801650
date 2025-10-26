"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ternario = void 0;
const exp_1 = require("../abs/exp");
const expresionsTypes_1 = require("../util/expresionsTypes");
const Tip_1 = require("../util/Tip");
class Ternario extends exp_1.Exp {
    constructor(linea, columna, condicion, expVerdadera, expFalsa) {
        super(linea, columna, expresionsTypes_1.ExpresionsTypes.TERNARIO);
        this.condicion = condicion;
        this.expVerdadera = expVerdadera;
        this.expFalsa = expFalsa;
    }
    play(env) {
        const c = this.condicion.play(env);
        // La condición debe ser booleana
        if (c.tip !== Tip_1.Tip.BOOLEANO) {
            // Puedes optar por reportar error semántico si ya usas el recolector de errores aquí.
            // Por simplicidad devolvemos NULL.
            return { value: null, tip: Tip_1.Tip.NULO };
        }
        // Evalúa SOLO la rama necesaria (evaluación perezosa)
        if (Boolean(c.value)) {
            const r = this.expVerdadera.play(env);
            return { value: r.value, tip: r.tip };
        }
        else {
            const r = this.expFalsa.play(env);
            return { value: r.value, tip: r.tip };
        }
    }
}
exports.Ternario = Ternario;
