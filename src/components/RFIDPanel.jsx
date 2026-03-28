import { useState, useEffect } from 'react';
import { equipmentData, trackedEntities } from '../data/hospitalData';

export default function RFIDPanel() {
  const [entities, setEntities] = useState(trackedEntities);
  const [hoveredEntity, setHoveredEntity] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntities(prev => prev.map(e => ({
        ...e,
        x: Math.max(5, Math.min(95, e.x + (Math.random() - 0.5) * 4)),
        y: Math.max(10, Math.min(90, e.y + (Math.random() - 0.5) * 4)),
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const entityColors = {
    patient: '#3b82f6',
    ventilator: '#10b981',
    nakes: '#f59e0b',
  };

  const entityIcons = {
    patient: '🏥',
    ventilator: '💨',
    nakes: '👨‍⚕️',
  };

  return (
    <div className="panel rfid-panel">
      <div className="panel-header">
        <h2 className="panel-title">RFID Asset & Patient Tracking</h2>
        <div className="panel-actions">
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
        </div>
      </div>
      <div className="rfid-content">
        <div className="floor-plan-container">
          <div className="floor-plan-header">
            <span className="floor-zoom">+</span>
            <span className="floor-label">Live Status chatus ▼</span>
          </div>
          <div className="floor-plan">
            {/* Room labels */}
            <div className="room-label" style={{ left: '10%', top: '10%' }}>IGD</div>
            <div className="room-label" style={{ left: '35%', top: '8%' }}>VIP</div>
            <div className="room-label" style={{ left: '62%', top: '8%' }}>ICU</div>
            <div className="room-label" style={{ left: '87%', top: '10%' }}>OK</div>
            <div className="room-label" style={{ left: '10%', top: '52%' }}>Radiologi</div>
            <div className="room-label" style={{ left: '48%', top: '52%' }}>Lab</div>
            <div className="room-label" style={{ left: '82%', top: '52%' }}>Farmasi</div>

            {/* Room boundaries */}
            <div className="room-border" style={{ left: '3%', top: '5%', width: '22%', height: '42%' }}></div>
            <div className="room-border" style={{ left: '28%', top: '5%', width: '22%', height: '42%' }}></div>
            <div className="room-border" style={{ left: '53%', top: '5%', width: '22%', height: '42%' }}></div>
            <div className="room-border" style={{ left: '78%', top: '5%', width: '19%', height: '42%' }}></div>
            <div className="room-border" style={{ left: '3%', top: '50%', width: '30%', height: '45%' }}></div>
            <div className="room-border" style={{ left: '36%', top: '50%', width: '30%', height: '45%' }}></div>
            <div className="room-border" style={{ left: '69%', top: '50%', width: '28%', height: '45%' }}></div>

            {/* Tracked entities */}
            {entities.map(entity => (
              <div
                key={entity.id}
                className={`tracked-entity ${entity.type}`}
                style={{
                  left: `${entity.x}%`,
                  top: `${entity.y}%`,
                  backgroundColor: entityColors[entity.type],
                  color: entityColors[entity.type],
                  boxShadow: `0 0 15px ${entityColors[entity.type]}50, 0 0 30px ${entityColors[entity.type]}20`,
                }}
                onMouseEnter={() => setHoveredEntity(entity)}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                <span className="entity-icon">{entityIcons[entity.type]}</span>
                {hoveredEntity?.id === entity.id && (
                  <div className="entity-tooltip">
                    <div className="tooltip-title">
                      {entity.type === 'patient' ? 'Pasien' : entity.type === 'ventilator' ? 'Ventilator' : 'Nakes'} {entity.name}
                    </div>
                    <div>ID: {entity.id} → <span className="tooltip-status">{entity.status}</span></div>
                    <div>Location: {entity.location}</div>
                  </div>
                )}
              </div>
            ))}

            <div className="floor-legend">
              <span><span className="legend-entity-dot" style={{background:'#3b82f6', boxShadow:'0 0 4px #3b82f680'}}></span> Pasien</span>
              <span><span className="legend-entity-dot" style={{background:'#10b981', boxShadow:'0 0 4px #10b98180'}}></span> Ventilator</span>
              <span><span className="legend-entity-dot" style={{background:'#f59e0b', boxShadow:'0 0 4px #f59e0b80'}}></span> Nakes</span>
            </div>
          </div>
        </div>

        <div className="equipment-status">
          <h3 className="equipment-title">Critical Equipment Status (Sudirman)</h3>
          {Object.entries(equipmentData).map(([key, data]) => {
            const pct = (data.available / data.total) * 100;
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            return (
              <div key={key} className="equipment-bar-row">
                <span className="equip-label">{label}</span>
                <div className="equip-bar-track">
                  <div
                    className={`equip-bar-fill ${pct < 70 ? 'warning' : pct < 90 ? 'caution' : 'good'}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="equip-count">{data.available}/{data.total}</span>
              </div>
            );
          })}

          <div className="patient-flow">
            <h4 className="flow-title">Patient Flow</h4>
            <div className="flow-bar">
              <div className="flow-gradient"></div>
              <div className="flow-labels">
                <span>Low</span>
                <span>High Flow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
