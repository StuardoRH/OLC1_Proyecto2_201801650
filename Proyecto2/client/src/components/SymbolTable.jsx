import React from 'react';

// Mapeo auxiliar para convertir el tipo de dato (enum/string) a texto legible
const mapTipoToString = (tipoBackend) => {
  // Ajusta estos casos según los valores EXACTOS que envía tu backend (enum Tip)
  switch (String(tipoBackend).toUpperCase()) { // Convertimos a string y mayúsculas por seguridad
    case 'ENTERO': case '0': return 'Entero';
    case 'DECIMAL': case '1': return 'Decimal';
    case 'BOOLEANO': case '2': return 'Booleano';
    case 'CARACTER': case '3': return 'Caracter';
    case 'CADENA': case '4': return 'Cadena';
    // Añade más casos si tienes Tip.OBJETO, Tip.LISTA, etc.
    default: return String(tipoBackend); // Muestra el valor crudo si no coincide
  }
};

function SymbolTable({ symbols }) {
  // Si no hay símbolos o el array está vacío, muestra un mensaje
  if (!symbols || symbols.length === 0) {
    return <p>No hay símbolos para mostrar.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Id</th>
          <th>Tipo</th>
          <th>Entorno</th> {/* Columna añadida según tu imagen de ejemplo */}
          <th>Valor</th>
          <th>Linea</th>
          <th>Columna</th>
        </tr>
      </thead>
      <tbody>
        {symbols.map((symbol, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{symbol.id || 'N/A'}</td> {/* ID del símbolo */}
            <td>{mapTipoToString(symbol.tipo)}</td> {/* Tipo de dato */}
            <td>{symbol.nombreEntorno || 'N/A'}</td> {/* Entorno (ámbito) */}
            <td>{String(symbol.valor)}</td> {/* Valor (convertido a string) */}
            <td>{symbol.linea ?? 'N/A'}</td> {/* Línea, usa ?? para mostrar N/A si es null/undefined */}
            <td>{symbol.columna ?? 'N/A'}</td> {/* Columna */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SymbolTable;