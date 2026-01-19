import React from 'react';
import './PageLabel.css';

function PageLabel({ title, subtitle }) {
    return (
        <div className='retro-image-label' style={{ borderImageSource: "url('label.png')" }}>
            <div className="page-label-container" >
                <h1 className="page-label-text">{title}</h1>
                {subtitle && <p className="page-label-subtitle">{subtitle}</p>}
            </div>
        </div>
    );
}
export default PageLabel;