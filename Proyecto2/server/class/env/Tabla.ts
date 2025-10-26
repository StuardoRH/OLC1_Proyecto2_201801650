import { simboloTabla } from "./simboloTabla";

// 1. Exportamos la clase Tabla para buenas prácticas
export class Tabla { 
        public simbolos: simboloTabla[];
        constructor() {
                this.simbolos = [];
        }

    // Validación simplificada: solo ID, TIPO y ENTORNO
        public validarSimbolo(simbolo: simboloTabla): boolean {
        // Utilizamos un hash más simple para la unicidad
                const simpleHash = `${simbolo.id}_${simbolo.nombreEntorno}`;

                for (const i of this.simbolos) {
                        // El nuevo hash solo debe incluir ID y Entorno
                        const existingSimpleHash = `${i.id}_${i.nombreEntorno}`;
                        if(existingSimpleHash === simpleHash) {
                                return false; // El símbolo ya existe en este entorno
                        }
                }
                return true;
        }
        public push(simbolo: simboloTabla): void {
        // Solo guardamos variables, listas, funciones, etc.
        // Las asignaciones (a = 10;) no deben ir a la tabla.
        // Asumo que solo se llama 'push' en las Declaraciones/Funciones.
                if (this.validarSimbolo(simbolo)) {
                        this.simbolos.push(simbolo);
                }
        }

        public splice() {
                this.simbolos.splice(0);
        }

        public imprimirTabla() {
                console.log("Tabla de simbolos:");
                for (const simbolo of this.simbolos) { 
                        console.log(simbolo.toString());
                }
        }

        public toString(): string {
                var table = '╔═' + '═'.repeat(69) + '═╗'
                table += '\n║ ' + ' '.repeat(26) + 'TABLA DE SÍMBOLOS' + ' '.repeat(26) + ' ║' 
                table += '\n╠═' + '═'.repeat(20) + '═╦═' + '═'.repeat(10) + '═╦═' +  '═'.repeat(15) + '═╦═' +  '═'.repeat(5) + '═╦═' +  '═'.repeat(7) + '═╣'
                table += '\n║ ' + 'ID'.padEnd(20) + ' ║ ' + 'TIPO'.padEnd(10) + ' ║ ' + 'ENTORNO'.padEnd(15) + ' ║ ' + 'LINEA'.padEnd(5) + ' ║ ' + 'COLUMNA'.padEnd(7) + ' ║' 
                table += '\n╠═' + '═'.repeat(20) + '═╬═' + '═'.repeat(10) + '═╬═' +  '═'.repeat(15) + '═╬═' +  '═'.repeat(5) + '═╬═' +  '═'.repeat(7) + '═╣'
                for(const sym of this.simbolos) {
                        table += '\n' + sym.toString()
                }
                table += '\n╚═' + '═'.repeat(20) + '═╩═' + '═'.repeat(10) + '═╩═' +  '═'.repeat(15) + '═╩═' +  '═'.repeat(5) + '═╩═' +  '═'.repeat(7) + '═╝'
                return table
        }
}

export var tablaSimbolos: Tabla = new Tabla();

// NOTA: Es importante que ahora tu 'simboloTabla.ts' no incluya línea/columna en el hash si quieres usar la lógica simplificada de 'validarSimbolo'.
// Ya que la clase 'simboloTabla' no tiene un 'id', debes asegurarte de que la propiedad 'id' en el constructor sea pública o de solo lectura