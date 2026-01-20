import React, { useEffect, useRef } from 'react';
import './BattleLog.css';

const BattleLog = ({ logs }) => {
    const logContainerRef = useRef(null);

    // Auto-scroll al div log cada vez que llega un mensaje
    useEffect(() => {
        if (logContainerRef.current) {
            const { scrollHeight, clientHeight } = logContainerRef.current;
            
            // Hacemos que la posición del scroll sea igual a la altura total del contenido
            // Esto lo fuerza siempre al final
            logContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: 'smooth' 
            });
        }
    }, [logs]);

    return (
        <div className="log-container" ref={logContainerRef}>
            <div className="log-list">
                {logs.map((log, index) => (
                    <div key={index} className="log-entry">
                        {log}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default BattleLog;