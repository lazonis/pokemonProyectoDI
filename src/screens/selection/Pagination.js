import React from 'react';

function Pagination({ page, totalPages, setPage, getPaginationGroup }) {
    
    const handlePageChange = (item) => {
        if (item === '...') return;
        setPage(item);
    };

    return (
        <div className="pc-pagination-header">
            <button 
                className="nav-arrow"
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
            >◀</button>
            
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