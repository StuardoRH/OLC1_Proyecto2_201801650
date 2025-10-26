import React from 'react';
    import { Graphviz } from 'graphviz-react'; // Importar el componente

    function AstVisualizer({ data }) {
    // 'data' debe ser el string en formato DOT que envía el backend

    // Si no hay datos o no es un string válido, muestra un mensaje
    if (!data || typeof data !== 'string' || data.trim() === '' || !data.trim().startsWith('digraph')) {
        return (
        <div className="ast-visualizer-container empty">
            <p>No hay datos del Árbol AST para mostrar.</p>
            <p>(Asegúrate de que el análisis sintáctico fue exitoso y el backend envía el string DOT).</p>
        </div>
        );
    }

    // Opciones de configuración para Graphviz (opcional)
    const graphvizOptions = {
        height: 600, // Altura del contenedor
        width: '100%', // Ancho del contenedor
        zoom: true, // Permitir zoom
        fit: true, // Ajustar el grafo al contenedor
        engine: 'dot', // Motor de layout (dot es bueno para árboles)
    };

    return (
        <div className="ast-visualizer-container">
        <Graphviz
            dot={data}
            options={graphvizOptions}
            // Manejo de errores de renderizado de Graphviz (opcional pero recomendado)
            renderError={({ error }) => (
            <div style={{ color: 'red', border: '1px solid red', padding: '10px' }}>
                <strong>Error al renderizar el grafo:</strong>
                <pre>{error?.message || 'Error desconocido'}</pre>
                <p>Verifica la sintaxis del string DOT generado por el backend.</p>
            </div>
            )}
        />
        </div>
    );
    }

    export default AstVisualizer;