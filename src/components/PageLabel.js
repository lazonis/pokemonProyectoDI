// Importación de React: necesaria para usar JSX
// JSX es la sintaxis que permite escribir HTML dentro de JavaScript
import React from 'react';

// Importación de estilos CSS específicos del componente
// En React, cada componente puede tener su propio archivo CSS
// Esto mantiene los estilos organizados y evita conflictos
import './PageLabel.css';

// Componente funcional simple: recibe props y retorna JSX
// Props son datos inmutables que pasan de padre a hijo
// Destructuring en parámetros: extrae title y subtitle directamente
function PageLabel({ title, subtitle }) {
    // JSX Return: la estructura visual del componente
    // style prop: estilos inline en React usan objetos JavaScript
    // borderImageSource: propiedad CSS avanzada para bordes con imágenes
    // En React, las URLs en estilos inline van entre comillas
    return (
        <div className='retro-image-label' style={{ borderImageSource: "url('label.png')" }}>
            <div className="page-label-container" >
                {/* JSX Expression: renderiza el título dinámicamente */}
                {/* En React, el contenido dinámico va entre llaves {} */}
                <h1 className="page-label-text">{title}</h1>
                
                {/* Conditional Rendering: renderiza el subtítulo solo si existe */}
                {/* Operador &&: shortcut para if - si subtitle es truthy, renderiza el <p> */}
                {/* En React, esto es común para mostrar/ocultar elementos condicionalmente */}
                {subtitle && <p className="page-label-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
}

// Export default: permite que otros archivos importen este componente
// En React, los componentes se exportan para reutilizarlos en diferentes pantallas
export default PageLabel;