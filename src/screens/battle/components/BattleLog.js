import React, { useEffect, useRef } from 'react';
import './BattleLog.css';

const BattleLog = ({ logs }) => {
    const logsEndRef = useRef(null);

    // Auto-scroll al fondo cada vez que llega un mensaje
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div className="log-container">
            <div className="log-list">
                {logs.map((log, index) => (
                    <div key={index} className="log-entry">
                        {log}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};

export default BattleLog;