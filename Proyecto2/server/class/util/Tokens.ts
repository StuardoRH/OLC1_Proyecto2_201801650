export class Tokens {
    constructor(
        public id : string,
        public tipo1: string,
        public tipo2: string,
        public valor: string,
        public entorno: string,
        public linea: number,
        public columna: number
    ){}

    public toString(): string {
        return `id: ${this.id}, tipo1: ${this.tipo1}, tipo2: ${this.tipo2}, valor: ${this.valor}, entorno: ${this.entorno}, linea: ${this.linea}, columna: ${this.columna}`;
    }
  }