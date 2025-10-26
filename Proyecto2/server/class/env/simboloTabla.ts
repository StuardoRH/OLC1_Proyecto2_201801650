import { Tip } from "../util/Tip";

export class simboloTabla {
        public indice: number;
        constructor(
                private linea: number, 
                private columna: number, 
                private isVariable: boolean, 
                private isPrimitive: boolean, 
                private valor: any, 
                private tipo: Tip, 
                public id: string, 
                public nombreEntorno: string
        ) {
                this.indice = 0;
        }

        public toString(): string {
                // Uso de getTipo() sin argumento
                return '║ ' + `${this.id}`.padEnd(20) + ' ║ ' + `${this.getTipo()}`.padEnd(10) + ' ║ ' + `${this.nombreEntorno}`.padEnd(15) + ' ║ ' + `${this.linea}`.padEnd(5) + ' ║ ' + `${this.columna}`.padEnd(7) + ' ║ ' 
        }
        
        public hash(): string {
                return `${this.id}_${this.tipo}_${this.nombreEntorno}_${this.linea}_${this.columna}_${this.isVariable}_${this.isPrimitive}`
        }

        // Eliminar el argumento 'tipo: Tip' y usar solo 'this.tipo'
        public getTipo(): string {
                switch (this.tipo) {
                        case Tip.ENTERO:     
                                return "entero";
                        case Tip.DECIMAL:
                                return "decimal";
                        case Tip.BOOLEANO:
                                return "booleano";
                        case Tip.CARACTER:
                                return "caracter";
                        case Tip.CADENA:
                                return "cadena";
                        case Tip.OBJETO: 
                                return "objeto";
                        case Tip.LISTA:
                                return "lista";
                        case Tip.NULO:
                                return "null";
                        case Tip.INVALIDO:
                                return "invalido";
                        default:
                                return "desconocido";
                }
        }
}