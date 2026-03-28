import { useState, useEffect } from 'react';
import { equipmentData, trackedEntities, buildingFloors } from '../data/hospitalData';

const roomColors = { emergency:'#ef4444', icu:'#f59e0b', ward:'#3b82f6', vip:'#8b5cf6', operating:'#ec4899', recovery:'#06b6d4', outpatient:'#10b981', diagnostic:'#6366f1', pharmacy:'#14b8a6', lab:'#a855f7', admin:'#64748b', specialist:'#e879f9', consultation:'#0ea5e9', meeting:'#78716c' };
const entityColors = { patient:'#3b82f6', ventilator:'#10b981', nakes:'#f59e0b' };
const entityIcons = { patient:'🏥', ventilator:'💨', nakes:'👨‍⚕️' };

export default function RFIDAsset() {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [entities, setEntities] = useState(trackedEntities);
  const [hoveredEntity, setHoveredEntity] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntities(prev => prev.map(e => ({
        ...e,
        x: Math.max(5, Math.min(93, e.x + (Math.random()-0.5)*4)),
        y: Math.max(8, Math.min(88, e.y + (Math.random()-0.5)*4)),
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const floor = buildingFloors[selectedFloor];
  const floorEntities = entities.filter(e => e.floor === floor.floor);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📡 RFID Asset & Patient Tracking</h1>
        <p className="page-subtitle">Pelacakan real-time alat medis, pasien, dan tenaga kesehatan — RSPPN Soedirman</p>
      </div>

      {/* Building overview */}
      <div className="rfid-layout">
        <div className="building-section">
          {/* Building 3D view */}
          <div className="building-3d">
            <div className="building-label">RSPPN Soedirman</div>
            <div className="building-floors-3d">
              {buildingFloors.slice().reverse().map((f, i) => (
                <div key={f.floor}
                  className={`floor-3d ${selectedFloor === buildingFloors.length - 1 - i ? 'active' : ''}`}
                  onClick={() => setSelectedFloor(buildingFloors.length - 1 - i)}
                  style={{ transform: `translateY(${i * -8}px) rotateX(15deg) rotateY(-10deg)` }}
                >
                  <span>Lt. {f.floor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floor tabs */}
          <div className="floor-tabs">
            {buildingFloors.map((f, i) => (
              <button key={f.floor} className={`floor-tab ${selectedFloor === i ? 'active' : ''}`} onClick={() => { setSelectedFloor(i); setSelectedRoom(null); }}>
                <span className="ft-floor">Lt. {f.floor}</span>
                <span className="ft-name">{f.name.split(' — ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Floor plan */}
          <div className="floor-plan-page">
            <div className="fp-title">{floor.name}</div>
            <div className="floor-plan-grid">
              {floor.rooms.map(room => (
                <div key={room.id}
                  className={`room-block ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                  style={{ left:`${room.x}%`, top:`${room.y}%`, width:`${room.w}%`, height:`${room.h}%`, borderColor: `${roomColors[room.type]}60`, background: `${roomColors[room.type]}08` }}
                  onClick={() => setSelectedRoom(selectedRoom?.id===room.id?null:room)}
                >
                  <span className="room-name">{room.name}</span>
                  {room.capacity && <span className="room-occ">{room.occupied}/{room.capacity}</span>}
                </div>
              ))}

              {/* Tracked entities on this floor */}
              {floorEntities.map(e => (
                <div key={e.id}
                  className="tracked-entity"
                  style={{ left:`${e.x}%`, top:`${e.y}%`, backgroundColor:entityColors[e.type], color:entityColors[e.type], boxShadow:`0 0 15px ${entityColors[e.type]}50` }}
                  onMouseEnter={() => setHoveredEntity(e)}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  <span className="entity-icon">{entityIcons[e.type]}</span>
                  {hoveredEntity?.id === e.id && (
                    <div className="entity-tooltip">
                      <div className="tooltip-title">{e.name}</div>
                      <div>ID: {e.id} • {e.location}</div>
                      <div className="tooltip-detail">{e.detail}</div>
                      <div>Status: <span className="tooltip-status">{e.status}</span></div>
                    </div>
                  )}
                </div>
              ))}

              {/* Scan line */}
              <div className="scan-line"></div>
            </div>

            {/* Floor legend */}
            <div className="floor-entity-legend">
              <span><span className="led" style={{background:'#3b82f6'}}></span> Pasien</span>
              <span><span className="led" style={{background:'#10b981'}}></span> Alat Medis</span>
              <span><span className="led" style={{background:'#f59e0b'}}></span> Nakes</span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="rfid-sidebar">
          {/* Room detail */}
          {selectedRoom ? (
            <div className="room-detail-card">
              <h3>{selectedRoom.name}</h3>
              <div className="rd-type" style={{color: roomColors[selectedRoom.type]}}>{selectedRoom.type.toUpperCase()}</div>
              {selectedRoom.capacity && (
                <div className="rd-occ">
                  <div className="rd-bar-track"><div className="rd-bar-fill" style={{width:`${(selectedRoom.occupied/selectedRoom.capacity)*100}%`, background: roomColors[selectedRoom.type]}}></div></div>
                  <span>{selectedRoom.occupied}/{selectedRoom.capacity} terisi</span>
                </div>
              )}
              <div className="rd-equip-title">Peralatan:</div>
              <ul className="rd-equip-list">
                {selectedRoom.equipment.map((eq,i) => <li key={i}>{eq}</li>)}
                {selectedRoom.equipment.length === 0 && <li className="text-muted">Tidak ada data</li>}
              </ul>
            </div>
          ) : (
            <div className="room-detail-card placeholder">
              <p>👆 Klik ruangan pada denah untuk melihat detail</p>
            </div>
          )}

          {/* Equipment status */}
          <div className="equip-card">
            <h3>Critical Equipment Status</h3>
            {Object.entries(equipmentData).map(([key, d]) => {
              const pct = (d.available / d.total) * 100;
              return (
                <div key={key} className="equip-row">
                  <span className="eq-label">{key}</span>
                  <div className="eq-bar-track"><div className={`eq-bar-fill ${pct<70?'red':pct<90?'yellow':'green'}`} style={{width:`${pct}%`}}></div></div>
                  <span className="eq-count">{d.available}/{d.total}</span>
                </div>
              );
            })}
          </div>

          {/* Entity list */}
          <div className="entity-list-card">
            <h3>Tracked Entities ({entities.length})</h3>
            <div className="entity-list">
              {entities.map(e => (
                <div key={e.id} className="entity-list-item" onMouseEnter={()=>setHoveredEntity(e)} onMouseLeave={()=>setHoveredEntity(null)}>
                  <span className="eli-icon">{entityIcons[e.type]}</span>
                  <div className="eli-info">
                    <span className="eli-name">{e.name}</span>
                    <span className="eli-detail">{e.id} • {e.location} • {e.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
