import React from 'react';
import './PageLabel.css';

function PageLabel({ title, subtitle }) {
    return (
        <div className="page-label-container">
            <h1 className="page-label-text">{title}</h1>
            {subtitle && <p className="page-label-subtitle">{subtitle}</p>}
        </div>
    );
}
export default PageLabel;