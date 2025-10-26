export class Node {
    id: string; // Identificador único del nodo
    name: string; // Nombre del nodo (tipo de instrucción/expresión)
    children: Node[]; // Hijos del nodo

    constructor(name: string) {
        this.id = `node_${Math.random().toString(36).substr(2, 9)}`; // Generar ID único
        this.name = name;
        this.children = [];
    }

    addChild(child: Node): void {
        this.children.push(child);
    }

    toGraphviz(): string {
        let graph = `digraph AST {\n`;
        graph += this.generateGraphvizNodes();
        graph += this.generateGraphvizEdges();
        graph += `}`;
        return graph;
    }

    private generateGraphvizNodes(): string {
        let nodes = `    ${this.id} [label="${this.name}"];\n`;
        for (const child of this.children) {
            nodes += child.generateGraphvizNodes();
        }
        return nodes;
    }

    private generateGraphvizEdges(): string {
        let edges = '';
        for (const child of this.children) {
            edges += `    ${this.id} -> ${child.id};\n`;
            edges += child.generateGraphvizEdges();
        }
        return edges;
    }
}