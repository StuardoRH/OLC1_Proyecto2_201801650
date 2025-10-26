"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
class Node {
    constructor(name) {
        this.id = `node_${Math.random().toString(36).substr(2, 9)}`; // Generar ID único
        this.name = name;
        this.children = [];
    }
    addChild(child) {
        this.children.push(child);
    }
    toGraphviz() {
        let graph = `digraph AST {\n`;
        graph += this.generateGraphvizNodes();
        graph += this.generateGraphvizEdges();
        graph += `}`;
        return graph;
    }
    generateGraphvizNodes() {
        let nodes = `    ${this.id} [label="${this.name}"];\n`;
        for (const child of this.children) {
            nodes += child.generateGraphvizNodes();
        }
        return nodes;
    }
    generateGraphvizEdges() {
        let edges = '';
        for (const child of this.children) {
            edges += `    ${this.id} -> ${child.id};\n`;
            edges += child.generateGraphvizEdges();
        }
        return edges;
    }
}
exports.Node = Node;
