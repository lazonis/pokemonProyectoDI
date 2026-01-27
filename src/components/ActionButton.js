// Importación de React: necesaria en todos los componentes de React
// En React 17+, esta importación es opcional pero se mantiene por compatibilidad
// React es la librería principal para crear interfaces de usuario
import React from 'react';

// Importación de CSS: en React se importa el CSS directamente en el componente
// Esto crea CSS modules: estilos scoped que no afectan otros componentes
// Buenas prácticas: mantener CSS junto al componente que lo usa
import './ActionButton.css';

// Componente funcional: función que retorna JSX (HTML-like syntax)
// En React moderno, se prefieren funciones sobre clases por simplicidad
// Props: parámetros inmutables que pasan datos del padre al hijo
// Destructuring: sintaxis ES6 para extraer propiedades de objetos
// En React, se usa para acceder a props de forma limpia
function ActionButton({ label, onClick, disabled, variant = 'primary' }) {
    // JSX Return: todo componente debe retornar JSX (o null)
    // JSX combina HTML con JavaScript - permite expresiones entre {}
    // Event handlers: funciones que responden a interacciones del usuario
    // En React, los eventos se nombran en camelCase (onClick vs onclick)
    // Template literals: interpolación de strings con variables
    // className: en JSX se usa className en lugar de class (palabra reservada en JS)
    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            // Template literals para combinar clases CSS dinámicamente
            // En React, se usa para aplicar estilos condicionales
            className={`btn-action ${variant}`}
        >
            {/* JSX Expression: renderiza el valor de la prop label */}
            {/* En React, todo contenido dinámico va entre {} */}
            {label}
        </button>
    );
}

// Export default: hace que el componente esté disponible para importar en otros archivos
// En React, cada componente se exporta para poder reutilizarlo
export default ActionButton;