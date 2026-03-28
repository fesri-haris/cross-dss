import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { hospitals } from '../data/hospitalData';
import 'leaflet/dist/leaflet.css';

const createIcon = (color, size = 12) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width:${size}px;height:${size}px;border-radius:50%;
    background:${color};
    border:2px solid rgba(255,255,255,0.7);
    box-shadow:0 0 ${size*1.5}px ${color}90, 0 0 ${size*3}px ${color}30;
    ${color === '#ef4444' ? 'animation:pulseMarker 1.5s infinite;' : ''}
    transition: all 0.3s ease;
  "></div>`,
  iconSize: [size, size],
  iconAnchor: [size/2, size/2],
});

const statusColors = { normal: '#10b981', waspada: '#f59e0b', kritis: '#ef4444' };
const forceColors = { AD: '#10b981', AL: '#3b82f6', AU: '#f97316' };

function MapEvents({ onMapReady }) {
  const map = useMap();
  useEffect(() => { onMapReady && onMapReady(map); }, [map, onMapReady]);
  return null;
}

export default function GISPanel() {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [filterKodam, setFilterKodam] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterAvail, setFilterAvail] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => { setTimeout(() => setIsLoaded(true), 300); }, []);

  const filteredHospitals = hospitals.filter(h => {
    if (filterType !== 'all' && h.type !== filterType) return false;
    if (filterAvail !== 'all' && h.status !== filterAvail) return false;
    return true;
  });

  const statusCounts = {
    normal: hospitals.filter(h => h.status === 'normal').length,
    waspada: hospitals.filter(h => h.status === 'waspada').length,
    kritis: hospitals.filter(h => h.status === 'kritis').length,
  };

  const totalBeds = hospitals.reduce((sum, h) => sum + h.beds, 0);

  return (
    <div className="panel gis-panel">
      <div className="panel-header">
        <h2 className="panel-title">GIS Monitoring Dashboard</h2>
        <div className="panel-actions">
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
          <span className="panel-dot"></span>
        </div>
      </div>
      <div className="gis-content">
        <div className="gis-filters">
          <div className="filter-group">
            <label>Wilayah Kodam</label>
            <select value={filterKodam} onChange={e => setFilterKodam(e.target.value)}>
              <option value="all">All Kodam</option>
              <option value="kodam1">Kodam I/BB</option>
              <option value="kodam2">Kodam II/Swj</option>
              <option value="kodam3">Kodam III/Slw</option>
              <option value="kodam4">Kodam IV/Dip</option>
              <option value="kodam5">Kodam V/Brw</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Tipe RS</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Type</option>
              <option value="Type A">Type A</option>
              <option value="Type B">Type B</option>
              <option value="Type C">Type C</option>
              <option value="Type D">Type D</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Ketersediaan</label>
            <select value={filterAvail} onChange={e => setFilterAvail(e.target.value)}>
              <option value="all">All Status</option>
              <option value="normal">Normal</option>
              <option value="waspada">Waspada</option>
              <option value="kritis">Kritis</option>
            </select>
          </div>
        </div>

        <div className="gis-map-container">
          <div className="map-force-legend">
            <span>Military RS</span>
            {Object.entries(forceColors).map(([k, v]) => (
              <span key={k} className="force-badge">
                <span style={{ color: v, textShadow: `0 0 6px ${v}` }}>●</span> {k}
              </span>
            ))}
          </div>

          <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            className="leaflet-map"
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <MapEvents onMapReady={(map) => { mapRef.current = map; }} />
            {filteredHospitals.map(hospital => (
              <Marker
                key={hospital.id}
                position={[hospital.lat, hospital.lng]}
                icon={createIcon(
                  statusColors[hospital.status],
                  hospital.type === 'Type A' ? 18 : hospital.type === 'Type B' ? 14 : 10
                )}
                eventHandlers={{ click: () => setSelectedHospital(hospital) }}
              >
                <Popup className="hospital-popup">
                  <div className="popup-content">
                    <h4>{hospital.name}</h4>
                    <div className="popup-type">{hospital.type} • TNI {hospital.force}</div>
                    <div className="popup-status">
                      Status: <span className={`status-tag ${hospital.status}`}>
                        {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                      </span>
                    </div>
                    <div className="popup-stats">
                      <div>BOR: <strong>{hospital.bor}%</strong></div>
                      <div>Nakes: <strong>{hospital.nakes}</strong></div>
                      <div>Alkes Utama: <strong>{hospital.alkesReady}% Ready</strong></div>
                      <div>Beds: <strong>{hospital.beds}</strong></div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="map-overlay-stats">
            <div className="overlay-stat">
              <div className="stat-label">Distribusi Fasilitas</div>
              <div className="stat-value-large">({hospitals.length} RS)</div>
            </div>
            <div className="overlay-stat">
              <div className="stat-label">Kapasitas Total Bed</div>
              <div className="stat-value-large">({totalBeds.toLocaleString()})</div>
            </div>
          </div>

          <div className="map-status-legend">
            <span className="legend-title">Live Status</span>
            <div className="legend-items">
              <span><span className="legend-dot normal"></span> Normal ({statusCounts.normal})</span>
              <span><span className="legend-dot waspada"></span> Waspada ({statusCounts.waspada})</span>
              <span><span className="legend-dot kritis"></span> Kritis ({statusCounts.kritis})</span>
            </div>
          </div>

          <div className="map-force-bottom-legend">
            <span><span className="legend-dot" style={{backgroundColor: forceColors.AD, boxShadow: `0 0 6px ${forceColors.AD}50`}}></span> AD</span>
            <span><span className="legend-dot" style={{backgroundColor: forceColors.AL, boxShadow: `0 0 6px ${forceColors.AL}50`}}></span> AL</span>
            <span><span className="legend-dot" style={{backgroundColor: forceColors.AU, boxShadow: `0 0 6px ${forceColors.AU}50`}}></span> AU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
