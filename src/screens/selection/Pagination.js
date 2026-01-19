import React from 'react';
// Carga estilos de la págin padre -> SelectionScreen.css
//Componente reutilizable de barra de paginación

function Pagination({ page, totalPages, setPage, getPaginationGroup }) {
    
    //Manejador personal
    //-> si item = "..." -> no hagas nada
    //Si no, actualiza la página (setPage(item))
    const handlePageChange = (item) => {
        if (item === '...') return;
        setPage(item);
    };

    return (
        <div className="pc-pagination-header">
            {/**Implementamos etiqueta botón para la primera flecha izq
            disabled -> si estaamos en la página 1, desactiva el botón
            si clickamos -> setea la página y le resta 1**/}
            <button 
                className="nav-arrow"
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
            >◀</button>
            {/**El item es cada página e índice es su posición dentro del Array**/}
            <div className="box-selector">
                {getPaginationGroup().map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(item)}
                        className={`box-tab ${page === item ? 'active' : ''} ${item === '...' ? 'dots' : ''}`}
                    >
                        {item === '...' ? '...' : `CAJA ${item}`}
                    </button>
                ))}
            </div>

            <button 
                className="nav-arrow"
                disabled={page === totalPages} 
                onClick={() => setPage(page + 1)}
            >▶</button>
        </div>
    );
}

export default Pagination;