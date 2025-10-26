// src/components/ErrorTable.jsx
import React from 'react';

// Mapeo auxiliar para convertir el tipo de error (enum/string) a texto legible
const mapErrorTipoToString = (tipoBackend) => {
  // Ajusta estos casos según los valores EXACTOS que envía tu backend (enum ErroresTypes)
  switch (String(tipoBackend).toUpperCase()) { // Convertimos a string y mayúsculas
    case 'LEXICAL': case '0': return 'Léxico';
    case 'SYNTAX': case '1': return 'Sintáctico';
    case 'SEMANTIC': case '2': return 'Semántico';
    // Añade más tipos si los tienes
    default: return String(tipoBackend); // Muestra el valor crudo
  }
};

function ErrorTable({ errors }) {
  // Si no hay errores o el array está vacío, muestra un mensaje
  if (!errors || errors.length === 0) {
    return <p>No se encontraron errores.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Tipo</th>
          <th>Descripcion</th>
          <th>Linea</th>
          <th>Columna</th>
        </tr>
      </thead>
      <tbody>
        {errors.map((error, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{mapErrorTipoToString(error.tipo)}</td> {/* Tipo de error */}
            <td>{error.descripcion || 'Sin descripción'}</td> {/* Descripción */}
            <td>{error.linea ?? 'N/A'}</td> {/* Línea */}
            <td>{error.columna ?? 'N/A'}</td> {/* Columna */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ErrorTable;