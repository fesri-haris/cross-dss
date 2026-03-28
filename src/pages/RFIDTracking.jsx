import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../rfid-tracking.css';
import { hospitals } from '../data/hospitalData';
import { rsBuildingData, buildingPolygons, eMedicalRecords, roomTypeConfig, entityTypeConfig } from '../data/rfidData';
import { allHospitalRfidData, getHospitalRfidData } from '../data/allHospitalRfidData';

const SATELLITE_STYLE = {
  version: 8,
  name: 'Satellite',
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      maxzoom: 19,
      attribution: '© Esri'
    },
    'carto-labels': {
      type: 'raster',
      tiles: ['https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'],
      tileSize: 256,
      maxzoom: 19
    }
  },
  layers: [
    { id: 'satellite', type: 'raster', source: 'esri-satellite', paint: { 'raster-opacity': 1 } },
    { id: 'labels', type: 'raster', source: 'carto-labels', paint: { 'raster-opacity': 0.8 } }
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf'
};

const statusColors = { active: '#10b981', idle: '#f59e0b', critical: '#ef4444' };
const statusLabels = { active: 'Aktif', idle: 'Idle', critical: 'Darurat' };

// Compute lat/lng for entity strictly within its room geo-bounds
function getEntityGeoPosition(entity, rsData) {
  if (!rsData?.buildings) return null;
  for (const bld of rsData.buildings) {
    if (!bld.geoBounds) continue;
    for (const f of bld.floors) {
      const room = f.rooms?.find(r => r.id === entity.room);
      if (room) {
        const { minLat, maxLat, minLng, maxLng } = bld.geoBounds;
        const bw = maxLng - minLng;
        const bh = maxLat - minLat;
        // Room geo bounds within building
        const rMinLng = minLng + bw * (room.x / 100);
        const rMaxLng = minLng + bw * ((room.x + room.w) / 100);
        const rMaxLat = maxLat - bh * (room.y / 100);
        const rMinLat = maxLat - bh * ((room.y + room.h) / 100);
        // Entity x/y might be absolute floor coords OR within room
        // Clamp entity position into room bounds, then normalize to 0-1
        const clampedEntX = Math.max(room.x + 1, Math.min(room.x + room.w - 1, entity.x));
        const clampedEntY = Math.max(room.y + 1, Math.min(room.y + room.h - 1, entity.y));
        const normX = (clampedEntX - room.x) / room.w;
        const normY = (clampedEntY - room.y) / room.h;
        // Add small jitter to avoid exact overlaps
        const jitterX = (Math.random() - 0.5) * 0.1;
        const jitterY = (Math.random() - 0.5) * 0.1;
        const finalX = Math.max(0.05, Math.min(0.95, normX + jitterX));
        const finalY = Math.max(0.05, Math.min(0.95, normY + jitterY));
        const lng = rMinLng + (rMaxLng - rMinLng) * finalX;
        const lat = rMaxLat - (rMaxLat - rMinLat) * finalY;
        return { lng, lat, buildingId: bld.id, floorIdx: bld.floors.indexOf(f) };
      }
    }
  }
  return null;
}

export default function RFIDTracking() {
  const [selectedRS, setSelectedRS] = useState(1);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [entityFilter, setEntityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // NEW: status filter
  const [entities, setEntities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [tacticalPopup, setTacticalPopup] = useState(null);
  const [showRsDropdown, setShowRsDropdown] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const rotationFrameRef = useRef(null);
  const popupMarkerRef = useRef(null);

  const rs = hospitals.find(h => h.id === selectedRS);
  // Resolve rsData: RSPPN uses rsBuildingData, others use allHospitalRfidData
  const rsData = selectedRS === 1 ? rsBuildingData[1] : getHospitalRfidData(selectedRS);
  const activeBuildingId = selectedBuildingId || rsData?.buildings?.[0]?.id;
  const building = rsData?.buildings?.find(b => b.id === activeBuildingId) || rsData?.buildings?.[0];
  const floors = building?.floors || [];
  const validSelectedFloor = Math.max(0, Math.min(selectedFloor, floors.length > 0 ? floors.length - 1 : 0));

  useEffect(() => {
    const ents = rsData?.entities;
    if (ents) {
      setEntities(ents.map(e => ({ ...e })));
      setSelectedFloor(0);
      setSelectedEntity(null);
      setSelectedRoom(null);
      setTacticalPopup(null);
      setSelectedBuildingId(rsData?.buildings?.[0]?.id || null);
      setStatusFilter('all');
      setEntityFilter('all');
      setSearchQuery('');
    }
  }, [selectedRS, rsData]);

  // Gentle entity drift within room bounds
  useEffect(() => {
    const iv = setInterval(() => {
      setEntities(prev => prev.map(e => {
        let roomObj = null;
        if (rsData?.buildings) {
          for (const b of rsData.buildings) {
            for (const f of b.floors) {
              const r = f.rooms?.find(r => r.id === e.room);
              if (r) { roomObj = r; break; }
            }
            if (roomObj) break;
          }
        }
        let newX = e.x + (Math.random() - 0.5) * 1.5;
        let newY = e.y + (Math.random() - 0.5) * 1.5;
        if (roomObj) {
          const minX = roomObj.x + 2; const maxX = roomObj.x + roomObj.w - 2;
          const minY = roomObj.y + 2; const maxY = roomObj.y + roomObj.h - 2;
          newX = Math.max(minX, Math.min(maxX, newX));
          newY = Math.max(minY, Math.min(maxY, newY));
        } else {
          newX = Math.max(5, Math.min(93, newX));
          newY = Math.max(5, Math.min(93, newY));
        }
        return { ...e, x: newX, y: newY };
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, [rsData]);

  // Convert selectedFloor index to actual floor number for filtering
  const selectedFloorNum = floors[validSelectedFloor]?.floor || 1;

  const allFiltered = useMemo(() => {
    let filtered = [...entities];
    if (activeBuildingId) {
      filtered = filtered.filter(e => {
        let eBld = null;
        rsData?.buildings?.forEach(b => {
          b.floors.forEach(f => {
            if (f.rooms?.some(r => r.id === e.room)) eBld = b.id;
          });
        });
        return eBld ? eBld === activeBuildingId : true;
      });
    }
    // Filter by actual floor number (1-indexed), not array index
    filtered = filtered.filter(e => e.floor <= selectedFloorNum);
    if (statusFilter !== 'all') filtered = filtered.filter(e => e.status === statusFilter);
    if (entityFilter !== 'all') filtered = filtered.filter(e => e.type === entityFilter);
    if (searchQuery) filtered = filtered.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return filtered;
  }, [entities, entityFilter, statusFilter, searchQuery, selectedFloorNum, activeBuildingId, rsData]);

  const stats = useMemo(() => ({
    active: entities.filter(e => e.status === 'active').length,
    idle: entities.filter(e => e.status === 'idle').length,
    critical: entities.filter(e => e.status === 'critical').length,
    total: entities.length,
    patient: entities.filter(e => e.type === 'patient').length,
    nakes: entities.filter(e => e.type === 'nakes').length,
    equipment: entities.filter(e => e.type === 'equipment').length,
    logistic: entities.filter(e => e.type === 'logistic').length,
  }), [entities]);

  // ═══ AUTO-ROTATION ═══
  const startRotation = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const rotate = () => {
      if (!mapRef.current) return;
      mapRef.current.rotateTo((mapRef.current.getBearing() + 0.15) % 360, { duration: 0 });
      rotationFrameRef.current = requestAnimationFrame(rotate);
    };
    rotationFrameRef.current = requestAnimationFrame(rotate);
  }, []);

  const stopRotation = useCallback(() => {
    if (rotationFrameRef.current) {
      cancelAnimationFrame(rotationFrameRef.current);
      rotationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && isRotating) {
      startRotation();
    } else {
      stopRotation();
    }
    return () => stopRotation();
  }, [mapLoaded, isRotating, startRotation, stopRotation]);

  // ═══ MAPLIBRE INTEGRATION ═══
  useEffect(() => {
    if (!mapContainerRef.current || !rs) return;
    if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: SATELLITE_STYLE,
      center: [rs.lng, rs.lat],
      zoom: 17.5,
      pitch: 65,
      bearing: -17.6,
      antialias: true,
    });

    // Navigation controls bottom-right
    // Navigation controls are now embedded in the top panel HUD

    // Stop rotation on user interaction
    map.on('dragstart', () => setIsRotating(false));
    map.on('zoomstart', (e) => { if (e.originalEvent) setIsRotating(false); });

    map.on('load', () => {
      setMapLoaded(true);

      // Building polygon outlines
      const polygons = buildingPolygons[selectedRS] || [];
      polygons.forEach((bld, idx) => {
        const coords = bld.coords.map(c => [c[1], c[0]]);
        coords.push(coords[0]);
        if (map.getSource(`bld-source-${idx}`)) return;
        map.addSource(`bld-source-${idx}`, {
          type: 'geojson',
          data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [coords] }, properties: { name: bld.name } }
        });
        map.addLayer({
          id: `bld-outline-${idx}`, type: 'line', source: `bld-source-${idx}`,
          paint: { 'line-color': bld.color, 'line-width': 2, 'line-dasharray': [3, 2] }
        });
      });

      // 3D Room Extrusions
      const roomFeatures = [];
      if (rsData?.buildings) {
        rsData.buildings.forEach(bld => {
          if (!bld.geoBounds) return;
          const { minLat, maxLat, minLng, maxLng } = bld.geoBounds;
          const bw = maxLng - minLng;
          const bh = maxLat - minLat;
          bld.floors.forEach((f, fIdx) => {
            const baseH = fIdx * 4;
            const h = baseH + 3.8;
            f.rooms.forEach(room => {
              const cfg = roomTypeConfig[room.type] || roomTypeConfig.admin;
              const rMinLng = minLng + bw * (room.x / 100);
              const rMaxLng = minLng + bw * ((room.x + room.w) / 100);
              const rMaxLat = maxLat - bh * (room.y / 100);
              const rMinLat = maxLat - bh * ((room.y + room.h) / 100);
              roomFeatures.push({
                type: 'Feature',
                properties: {
                  id: room.id, name: room.name,
                  floor: fIdx, buildingId: bld.id,
                  type: room.type, color: cfg.color || '#3b82f6',
                  base_height: baseH, height: h
                },
                geometry: {
                  type: 'Polygon',
                  coordinates: [[
                    [rMinLng, rMaxLat], [rMaxLng, rMaxLat],
                    [rMaxLng, rMinLat], [rMinLng, rMinLat], [rMinLng, rMaxLat]
                  ]]
                }
              });
            });
          });
        });
      }

      if (roomFeatures.length > 0) {
        map.addSource('rooms-source', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: roomFeatures }
        });
        map.addLayer({
          id: 'rooms-3d', type: 'fill-extrusion', source: 'rooms-source',
          paint: {
            'fill-extrusion-color': ['get', 'color'],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'base_height'],
            'fill-extrusion-opacity': 0.75
          }
        });

        // Room click → tactical popup
        map.on('click', 'rooms-3d', (e) => {
          if (e.features.length > 0) {
            const props = e.features[0].properties;
            let fullRoom = null;
            let parentBuilding = null;
            if (rsData?.buildings) {
              for (const b of rsData.buildings) {
                if (b.id === props.buildingId) {
                  parentBuilding = b;
                  // Search ALL floors for the room by id
                  for (let fi = 0; fi < b.floors.length; fi++) {
                    const foundRoom = b.floors[fi].rooms?.find(r => r.id === props.id);
                    if (foundRoom) { fullRoom = foundRoom; break; }
                  }
                }
              }
            }
            if (fullRoom) {
              const roomEntities = entities.filter(ent => ent.room === fullRoom.id);
              const entBreakdown = {
                patient: roomEntities.filter(e => e.type === 'patient'),
                nakes: roomEntities.filter(e => e.type === 'nakes'),
                equipment: roomEntities.filter(e => e.type === 'equipment'),
                logistic: roomEntities.filter(e => e.type === 'logistic'),
              };
              // Set tactical popup with screen coordinates
              const screenPt = map.project(e.lngLat);
              setTacticalPopup({
                screenX: screenPt.x, screenY: screenPt.y,
                lngLat: e.lngLat,
                data: { ...fullRoom, floor: props.floor, parentBuilding: parentBuilding?.name, entBreakdown, roomEntities },
                type: 'room'
              });
              setSelectedRoom({ ...fullRoom, floor: props.floor, parentBuilding: parentBuilding?.name, entBreakdown, roomEntities });
              setSelectedEntity(null);
              setIsRotating(false);
              // Zoom to clicked area
              map.flyTo({ center: e.lngLat, zoom: 19, pitch: 55, duration: 1200 });
            }
          }
        });

        map.on('mouseenter', 'rooms-3d', () => { map.getCanvas().style.cursor = 'crosshair'; });
        map.on('mouseleave', 'rooms-3d', () => { map.getCanvas().style.cursor = ''; });
      }

      // ═══ CLUSTERED RFID ENTITY SOURCE ═══
      map.addSource('rfid-entities', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 18,
        clusterRadius: 40,
        clusterProperties: {
          critical_count: ['+', ['case', ['==', ['get', 'status'], 'critical'], 1, 0]],
          patient_count: ['+', ['case', ['==', ['get', 'etype'], 'patient'], 1, 0]],
          nakes_count: ['+', ['case', ['==', ['get', 'etype'], 'nakes'], 1, 0]],
        }
      });

      // Cluster circle layer
      map.addLayer({
        id: 'rfid-clusters', type: 'circle', source: 'rfid-entities',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'case',
            ['>', ['get', 'critical_count'], 0], '#ef4444',
            '#3b82f6'
          ],
          'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 32, 100, 40],
          'circle-stroke-width': 3,
          'circle-stroke-color': 'rgba(255,255,255,0.7)',
          'circle-opacity': 0.85,
          'circle-blur': 0.1
        }
      });

      // Cluster glow ring
      map.addLayer({
        id: 'rfid-cluster-glow', type: 'circle', source: 'rfid-entities',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'case',
            ['>', ['get', 'critical_count'], 0], '#ef4444',
            '#3b82f6'
          ],
          'circle-radius': ['step', ['get', 'point_count'], 26, 10, 34, 50, 44, 100, 54],
          'circle-opacity': 0.15,
          'circle-blur': 0.5
        }
      });

      // Cluster count label
      map.addLayer({
        id: 'rfid-cluster-count', type: 'symbol', source: 'rfid-entities',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Open Sans Bold'],
          'text-size': 13,
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0,0,0,0.5)',
          'text-halo-width': 1,
        }
      });

      // Individual unclustered points
      map.addLayer({
        id: 'rfid-unclustered', type: 'circle', source: 'rfid-entities',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match', ['get', 'status'],
            'active', '#10b981',
            'idle', '#f59e0b',
            'critical', '#ef4444',
            '#10b981'
          ],
          'circle-radius': 7,
          'circle-stroke-width': 2.5,
          'circle-stroke-color': 'rgba(255,255,255,0.9)',
          'circle-opacity': 0.9
        }
      });

      // Unclustered point glow
      map.addLayer({
        id: 'rfid-unclustered-glow', type: 'circle', source: 'rfid-entities',
        filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'status'], 'critical']],
        paint: {
          'circle-color': '#ef4444',
          'circle-radius': 14,
          'circle-opacity': 0.25,
          'circle-blur': 0.6
        }
      });

      // Unclustered icon label
      map.addLayer({
        id: 'rfid-unclustered-icon', type: 'symbol', source: 'rfid-entities',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'icon'],
          'text-size': 12,
          'text-allow-overlap': true,
          'text-offset': [0, -1.5],
        },
        paint: {
          'text-color': '#ffffff',
        }
      });

      // Click cluster → zoom in
      map.on('click', 'rfid-clusters', async (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['rfid-clusters'] });
        if (!features.length) return;
        const clusterId = features[0].properties.cluster_id;
        const source = map.getSource('rfid-entities');
        try {
          const zoom = await source.getClusterExpansionZoom(clusterId);
          map.flyTo({ center: features[0].geometry.coordinates, zoom: zoom + 1, pitch: 55, duration: 800 });
          setIsRotating(false);
        } catch (err) { /* ignore */ }
      });

      // Click unclustered point → tactical popup for entity
      map.on('click', 'rfid-unclustered', (e) => {
        if (!e.features.length) return;
        const props = e.features[0].properties;
        const entityId = props.entityId;
        const entity = entities.find(ent => ent.id === entityId);
        if (entity) {
          handleEntityClick(entity, e.lngLat, map.project(e.lngLat));
        }
      });

      map.on('mouseenter', 'rfid-clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'rfid-clusters', () => { map.getCanvas().style.cursor = ''; });
      map.on('mouseenter', 'rfid-unclustered', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'rfid-unclustered', () => { map.getCanvas().style.cursor = ''; });

      // Close popup on general map click
      map.on('click', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['rfid-unclustered', 'rfid-clusters', 'rooms-3d'] });
        if (features.length === 0) {
          setTacticalPopup(null);
          setSelectedEntity(null);
          setSelectedRoom(null);
        }
      });
    });

    mapRef.current = map;
    return () => { setMapLoaded(false); stopRotation(); if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, [selectedRS, rs]);

  // Floor & building filter on 3D extrusions
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    if (map.getLayer('rooms-3d')) {
      map.setFilter('rooms-3d', [
        'all',
        ['==', ['get', 'buildingId'], activeBuildingId],
        ['<=', ['get', 'floor'], validSelectedFloor]
      ]);
      // Use constant opacity (data expressions not supported for fill-extrusion-opacity)
      map.setPaintProperty('rooms-3d', 'fill-extrusion-opacity', 0.75);
    }
  }, [validSelectedFloor, activeBuildingId, mapLoaded]);

  // ═══ UPDATE CLUSTERED SOURCE WITH ENTITY POSITIONS ═══
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !rs) return;
    const map = mapRef.current;
    const source = map.getSource('rfid-entities');
    if (!source) return;

    const features = allFiltered.map(e => {
      const pos = getEntityGeoPosition(e, rsData);
      if (!pos) return null;
      const cfg = entityTypeConfig[e.type] || entityTypeConfig.patient;
      return {
        type: 'Feature',
        properties: {
          entityId: e.id,
          name: e.name,
          etype: e.type,
          status: e.status,
          icon: cfg.icon,
          rfidTag: e.rfidTag,
          floor: e.floor,
          room: e.room,
          location: e.location,
          detail: e.detail,
        },
        geometry: { type: 'Point', coordinates: [pos.lng, pos.lat] }
      };
    }).filter(Boolean);

    source.setData({ type: 'FeatureCollection', features });
  }, [allFiltered, rs, rsData, mapLoaded]);

  // ═══ UPDATE TACTICAL POPUP POSITION ON MAP MOVE ═══
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !tacticalPopup?.lngLat) return;
    const map = mapRef.current;
    const updatePopupScreen = () => {
      if (!tacticalPopup?.lngLat) return;
      const pt = map.project(tacticalPopup.lngLat);
      setTacticalPopup(prev => prev ? { ...prev, screenX: pt.x, screenY: pt.y } : null);
    };
    map.on('move', updatePopupScreen);
    return () => map.off('move', updatePopupScreen);
  }, [mapLoaded, tacticalPopup?.lngLat?.lng, tacticalPopup?.lngLat?.lat]);

  const handleEntityClick = useCallback((e, lngLat, screenPt) => {
    setSelectedEntity(e);
    setSelectedRoom(null);

    let foundBuilding = null;
    let foundFloorIndex = -1;
    if (rsData?.buildings) {
      outer: for (const b of rsData.buildings) {
        if (b.floors) {
          for (let i = 0; i < b.floors.length; i++) {
            if (b.floors[i].rooms && b.floors[i].rooms.some(r => r.id === e.room)) {
              foundBuilding = b; foundFloorIndex = i; break outer;
            }
          }
        }
      }
    }
    if (foundBuilding) {
      setSelectedBuildingId(foundBuilding.id);
      setSelectedFloor(foundFloorIndex);
    }

    // Compute position for tactical popup
    if (lngLat && screenPt) {
      setTacticalPopup({
        screenX: screenPt.x, screenY: screenPt.y,
        lngLat: lngLat,
        data: e, type: 'entity'
      });
    } else if (mapRef.current && rsData) {
      const pos = getEntityGeoPosition(e, rsData);
      if (pos) {
        const ll = new maplibregl.LngLat(pos.lng, pos.lat);
        const pt = mapRef.current.project(ll);
        setTacticalPopup({ screenX: pt.x, screenY: pt.y, lngLat: ll, data: e, type: 'entity' });
        mapRef.current.flyTo({ center: [pos.lng, pos.lat], zoom: 20, pitch: 50, duration: 1000 });
      }
    }
    setIsRotating(false);
  }, [rsData]);

  // Handle entity click from side panel (no lngLat)
  const handleSideEntityClick = useCallback((e) => {
    handleEntityClick(e, null, null);
  }, [handleEntityClick]);

  // E-Medical record
  const entityMedRecord = useMemo(() => {
    if (!selectedEntity || selectedEntity.type !== 'patient') return null;
    return eMedicalRecords[selectedEntity.id] || null;
  }, [selectedEntity]);

  const entityRoom = useMemo(() => {
    if (!selectedEntity) return null;
    let room = null;
    rsData?.buildings?.forEach(b => {
      b.floors.forEach(f => {
        const r = f.rooms?.find(r => r.id === selectedEntity.room);
        if (r) room = r;
      });
    });
    return room;
  }, [selectedEntity, rsData]);

  // ═══ RENDER TACTICAL SVG CONNECTOR LINE ═══
  const renderTacticalConnector = () => {
    if (!tacticalPopup) return null;
    const { screenX, screenY } = tacticalPopup;
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return null;
    const rect = mapContainer.getBoundingClientRect();

    // Popup goes bottom-left or bottom-right of click point
    const goRight = screenX < rect.width / 2;
    const lineEndX = goRight ? screenX + 120 : screenX - 120;
    const lineEndY = screenY + 60;
    const popupY = lineEndY + 10;

    return (
      <svg className="tactical-connector-svg" style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 15, overflow: 'visible'
      }}>
        {/* Diagonal line from click to bend point */}
        <line x1={screenX} y1={screenY} x2={lineEndX} y2={lineEndY}
          stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" opacity="0.9" />
        {/* Vertical line down to popup */}
        <line x1={lineEndX} y1={lineEndY} x2={lineEndX} y2={popupY + 200}
          stroke="#3b82f6" strokeWidth="2" opacity="0.7" />
        {/* Click point indicator */}
        <circle cx={screenX} cy={screenY} r="6" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.9">
          <animate attributeName="r" values="4;10;4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={screenX} cy={screenY} r="3" fill="#3b82f6" opacity="0.9" />
        {/* Bend point dot */}
        <circle cx={lineEndX} cy={lineEndY} r="3" fill="#3b82f6" opacity="0.7" />
        {/* Military flag symbol at bend */}
        <g transform={`translate(${lineEndX - 12}, ${lineEndY - 25})`}>
          <rect x="0" y="0" width="24" height="18" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.8" />
          <line x1="0" y1="0" x2="24" y2="18" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
          <line x1="24" y1="0" x2="0" y2="18" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
        </g>
      </svg>
    );
  };

  // ═══ TACTICAL POPUP CONTENT ═══
  const renderTacticalPopupContent = () => {
    if (!tacticalPopup) return null;
    const { screenX, screenY, data, type } = tacticalPopup;
    const mapContainer = mapContainerRef.current;
    if (!mapContainer) return null;
    const rect = mapContainer.getBoundingClientRect();

    const goRight = screenX < rect.width / 2;
    const popupLeft = goRight ? screenX + 120 - 220 : screenX - 120 - 220;
    const popupTop = screenY + 80;

    if (type === 'entity') {
      const entity = data;
      const cfg = entityTypeConfig[entity.type] || entityTypeConfig.patient;
      const medRec = entity.type === 'patient' ? (eMedicalRecords[entity.id] || null) : null;
      let eRoom = null;
      rsData?.buildings?.forEach(b => {
        b.floors.forEach(f => {
          const r = f.rooms?.find(r => r.id === entity.room);
          if (r) eRoom = r;
        });
      });

      return (
        <div className="tactical-flag-popup" style={{ left: Math.max(10, popupLeft), top: Math.max(10, Math.min(popupTop, rect.height - 400)) }}>
          <div className="tfp-header">
            <div className="tfp-flag-marker">
              <svg width="28" height="22" viewBox="0 0 28 22">
                <rect x="1" y="1" width="26" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                <line x1="1" y1="1" x2="27" y2="21" stroke="#3b82f6" strokeWidth="1" />
                <line x1="27" y1="1" x2="1" y2="21" stroke="#3b82f6" strokeWidth="1" />
              </svg>
            </div>
            <div className="tfp-title-area">
              <span className="tfp-icon">{cfg.icon}</span>
              <div className="tfp-title-text">
                <h3>{entity.name}</h3>
                <span>{entity.rfidTag} • {cfg.label}</span>
              </div>
            </div>
            <div className={`tfp-status ${entity.status}`}>{statusLabels[entity.status]}</div>
            <button className="tfp-close" onClick={() => { setTacticalPopup(null); setSelectedEntity(null); }}>✕</button>
          </div>
          <div className="tfp-body">
            <div className="tfp-grid">
              <div className="tfp-cell"><label>📍 LOKASI</label><span>Lt.{entity.floor} • {entity.location}</span></div>
              <div className="tfp-cell"><label>🕐 SCAN</label><span style={{color:'#10b981'}}>{entity.lastScan || currentTime}</span></div>
              <div className="tfp-cell"><label>🏢 RUANGAN</label><span>{eRoom?.name || entity.room}</span></div>
              <div className="tfp-cell"><label>📡 SINYAL</label><span style={{color:'#3b82f6'}}>●●●●○ — 82 dBm</span></div>
            </div>
            <div className="tfp-detail"><label>📋 KETERANGAN</label><span>{entity.detail}</span></div>
            {medRec && (
              <div className="tfp-med-section">
                <div className="tfp-med-header">📋 E-MR — {medRec.mrNo}</div>
                <div className="tfp-vitals">
                  <div className="tfp-vital"><span className="tfp-vl">BP</span><span className={`tfp-vv ${medRec.vitals.bp.split('/')[0] < 90 ? 'critical' : ''}`}>{medRec.vitals.bp}</span></div>
                  <div className="tfp-vital"><span className="tfp-vl">HR</span><span className={`tfp-vv ${medRec.vitals.hr > 110 ? 'critical' : medRec.vitals.hr > 100 ? 'warning' : ''}`}>{medRec.vitals.hr}</span></div>
                  <div className="tfp-vital"><span className="tfp-vl">T°</span><span className={`tfp-vv ${medRec.vitals.temp > 38 ? 'warning' : ''}`}>{medRec.vitals.temp}°C</span></div>
                  <div className="tfp-vital"><span className="tfp-vl">SpO₂</span><span className={`tfp-vv ${medRec.vitals.spo2 < 92 ? 'critical' : medRec.vitals.spo2 < 95 ? 'warning' : ''}`}>{medRec.vitals.spo2}%</span></div>
                </div>
                <div className="tfp-med-info">
                  <span><strong>Dx:</strong> {medRec.diagnosis}</span>
                  <span><strong>DPJP:</strong> {medRec.doctor}</span>
                  {medRec.allergies?.length > 0 && <span className="tfp-allergy">⚠️ ALERGI: {medRec.allergies.join(', ')}</span>}
                </div>
              </div>
            )}
          </div>
          <div className="tfp-footer">
            <div className="tfp-scan-line"></div>
            <span>[ ENCRYPTED MILITARY LINK • RFID ACTIVE • {entity.id} ]</span>
          </div>
        </div>
      );
    }

    if (type === 'room') {
      const room = data;
      const roomCfg = roomTypeConfig[room.type] || roomTypeConfig.admin;
      return (
        <div className="tactical-flag-popup tfp-room" style={{ left: Math.max(10, popupLeft), top: Math.max(10, Math.min(popupTop, rect.height - 350)) }}>
          <div className="tfp-header">
            <div className="tfp-flag-marker">
              <svg width="28" height="22" viewBox="0 0 28 22">
                <rect x="1" y="1" width="26" height="20" fill="none" stroke="#10b981" strokeWidth="1.5" />
                <line x1="1" y1="1" x2="27" y2="21" stroke="#10b981" strokeWidth="1" />
                <line x1="27" y1="1" x2="1" y2="21" stroke="#10b981" strokeWidth="1" />
              </svg>
            </div>
            <div className="tfp-title-area">
              <span className="tfp-icon">{roomCfg.icon}</span>
              <div className="tfp-title-text">
                <h3>{room.name}</h3>
                <span style={{ color: roomCfg.color }}>{roomCfg.label} • {room.parentBuilding || 'Gedung Utama'}</span>
              </div>
            </div>
            <button className="tfp-close" onClick={() => { setTacticalPopup(null); setSelectedRoom(null); }}>✕</button>
          </div>
          <div className="tfp-body">
            {room.capacity && (
              <div className="tfp-occupancy">
                <label>📊 OKUPANSI</label>
                <div className="tfp-occ-bar">
                  <div className="tfp-occ-fill" style={{
                    width: `${(room.occupied / room.capacity) * 100}%`,
                    background: (room.occupied / room.capacity) > 0.9 ? '#ef4444' : (room.occupied / room.capacity) > 0.7 ? '#f59e0b' : roomCfg.color
                  }}></div>
                </div>
                <span className="tfp-occ-text">{room.occupied}/{room.capacity} ({Math.round((room.occupied / room.capacity) * 100)}%)</span>
              </div>
            )}
            <div className="tfp-breakdown">
              <label>📡 RFID BREAKDOWN</label>
              {Object.entries(room.entBreakdown || {}).map(([type, arr]) => {
                const cfg = entityTypeConfig[type];
                if (!cfg || arr.length === 0) return null;
                const critical = arr.filter(e => e.status === 'critical').length;
                return (
                  <div key={type} className="tfp-eb-row">
                    <span>{cfg.icon}</span>
                    <span className="tfp-eb-label">{cfg.label}</span>
                    <span className="tfp-eb-count">{arr.length}</span>
                    {critical > 0 && <span className="tfp-eb-crit">🔴{critical}</span>}
                  </div>
                );
              })}
              <div className="tfp-eb-total">
                <span>TOTAL</span>
                <span className="tfp-eb-total-num">{room.roomEntities?.length || 0}</span>
              </div>
            </div>
            {room.equipment?.length > 0 && (
              <div className="tfp-equip">
                <label>🔧 ASET</label>
                <div className="tfp-equip-tags">{room.equipment.map((eq, i) => <span key={i} className="tfp-etag">{eq}</span>)}</div>
              </div>
            )}
          </div>
          <div className="tfp-footer">
            <div className="tfp-scan-line"></div>
            <span>[ ZONE SCAN COMPLETE • {room.id?.toUpperCase()} ]</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Map control handlers
  const handleZoomIn = useCallback(() => { if (mapRef.current) mapRef.current.zoomIn({ duration: 300 }); }, []);
  const handleZoomOut = useCallback(() => { if (mapRef.current) mapRef.current.zoomOut({ duration: 300 }); }, []);
  const handleResetNorth = useCallback(() => { if (mapRef.current) mapRef.current.easeTo({ bearing: 0, pitch: 60, duration: 600 }); }, []);

  // Handle RS change
  const handleRSChange = useCallback((id) => {
    setSelectedRS(id);
    setShowRsDropdown(false);
    setIsRotating(true);
  }, []);

  return (
    <div className="rt-page rt-hud-mode">
      {/* FULL SCREEN MAP */}
      <div ref={mapContainerRef} className="rt-mapbox-full" />

      {/* SVG TACTICAL CONNECTOR */}
      {renderTacticalConnector()}

      {/* TACTICAL FLAG POPUP */}
      {renderTacticalPopupContent()}

      {/* ═══ REDESIGNED TOP PANEL ═══ */}
      <div className="rt-hud-topbar">
        {/* LEFT: RS Selector + Dynamic Title */}
        <div className="rt-hud-brand" style={{ position: 'relative' }}>
          <div className="rt-hud-live-beacon">
            <span className="rt-beacon-dot"></span>
            <span className="rt-beacon-ring"></span>
          </div>
          <div className="rt-hud-text" onClick={() => setShowRsDropdown(!showRsDropdown)} style={{ cursor: 'pointer' }}>
            <span className="rt-hud-rs-title">
              {rs?.name || 'RS'}
              <span className="rt-hud-rs-dash"> — </span>
              <span className="rt-hud-rs-subtitle">RFID Live Tracking</span>
              <span className="rt-hud-rs-arrow">{showRsDropdown ? '▲' : '▼'}</span>
            </span>
            <small>📡 {stats.total} Entity Terpantau • {rs?.type} • {rs?.force}</small>
          </div>
          {/* RS Dropdown */}
          {showRsDropdown && (
            <div className="rt-rs-dropdown" onClick={e => e.stopPropagation()}>
              <div className="rt-rs-dd-header">🏥 Pilih Rumah Sakit Kemhan</div>
              <div className="rt-rs-dd-list">
                {hospitals.map(h => {
                  const isActive = h.id === selectedRS;
                  const force = h.force === 'AD' ? '🟢' : h.force === 'AL' ? '🔵' : '⚪';
                  return (
                    <button key={h.id} className={`rt-rs-dd-item ${isActive ? 'active' : ''}`} onClick={() => handleRSChange(h.id)}>
                      <span className="rt-rs-dd-force">{force}</span>
                      <div className="rt-rs-dd-info">
                        <span className="rt-rs-dd-name">{h.name}</span>
                        <span className="rt-rs-dd-meta">{h.type} • {h.force} • {h.beds} Bed</span>
                      </div>
                      {isActive && <span className="rt-rs-dd-check">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CENTER: Interactive Status Pills with Labels */}
        <div className="rt-hud-quickstats">
          <button className={`rt-hs-pill active-pill ${statusFilter === 'active' ? 'selected' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
            title="Klik untuk filter entitas Aktif">
            <span className="dot" style={{background:'#10b981'}}></span>
            <span className="rt-pill-count">{stats.active}</span>
            <span className="rt-pill-label">Aktif</span>
          </button>
          <button className={`rt-hs-pill idle-pill ${statusFilter === 'idle' ? 'selected' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'idle' ? 'all' : 'idle')}
            title="Klik untuk filter entitas Idle">
            <span className="dot" style={{background:'#f59e0b'}}></span>
            <span className="rt-pill-count">{stats.idle}</span>
            <span className="rt-pill-label">Idle</span>
          </button>
          <button className={`rt-hs-pill critical-pill ${statusFilter === 'critical' ? 'selected' : ''}`}
            onClick={() => setStatusFilter(statusFilter === 'critical' ? 'all' : 'critical')}
            title="Klik untuk filter entitas Darurat">
            <span className="dot" style={{background:'#ef4444'}}></span>
            <span className="rt-pill-count">{stats.critical}</span>
            <span className="rt-pill-label">Darurat</span>
          </button>
        </div>

        {/* Type Stats */}
        <div className="rt-hud-type-stats">
          <span className="rt-ts" title="Pasien">🏥 {stats.patient}</span>
          <span className="rt-ts" title="Tenaga Medis">👨‍⚕️ {stats.nakes}</span>
          <span className="rt-ts" title="Peralatan">⚙️ {stats.equipment}</span>
          <span className="rt-ts" title="Logistik">📦 {stats.logistic}</span>
        </div>

        {/* RIGHT: Map Controls */}
        <div className="rt-hud-controls">
          <button className="rt-ctrl-btn" onClick={handleZoomIn} title="Zoom In">
            <svg width="16" height="16" viewBox="0 0 16 16"><line x1="8" y1="3" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/><line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          <button className="rt-ctrl-btn" onClick={handleZoomOut} title="Zoom Out">
            <svg width="16" height="16" viewBox="0 0 16 16"><line x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          <span className="rt-ctrl-divider"></span>
          <button className="rt-ctrl-btn" onClick={handleResetNorth} title="Reset North">
            <svg width="16" height="16" viewBox="0 0 16 16"><polygon points="8,2 12,10 8,8 4,10" fill="currentColor"/><line x1="8" y1="8" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
          <button className={`rt-ctrl-btn rt-ctrl-rotate ${isRotating ? 'active' : ''}`}
            onClick={() => setIsRotating(prev => !prev)}
            title={isRotating ? 'Stop Rotation' : 'Start Rotation'}>
            <svg width="16" height="16" viewBox="0 0 16 16">
              {isRotating
                ? <><rect x="3" y="3" width="4" height="10" fill="currentColor" rx="1"/><rect x="9" y="3" width="4" height="10" fill="currentColor" rx="1"/></>
                : <path d="M3,2 C3,2 13,8 13,8 L3,14 Z" fill="currentColor"/>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* LEFT PANEL: Entity List */}
      <div className="rt-hud-left-panel glass-panel">
        <div className="rt-hud-search">
          <span>🔍</span>
          <input placeholder="Cari RFID / Nama..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="rt-hud-filters">
          {[['all', 'Semua'], ['patient', 'Pasien'], ['nakes', 'Nakes'], ['equipment', 'Alat'], ['logistic', 'Logistik']].map(([key, label]) => (
            <button key={key} className={entityFilter === key ? 'active' : ''} onClick={() => setEntityFilter(key)}>{label}</button>
          ))}
        </div>
        {statusFilter !== 'all' && (
          <div className="rt-status-filter-badge" onClick={() => setStatusFilter('all')}>
            <span className="dot" style={{background: statusColors[statusFilter]}}></span>
            Filter: {statusLabels[statusFilter]} <span className="rt-sfb-clear">✕</span>
          </div>
        )}
        <div className="rt-hud-entity-list">
          {allFiltered.length === 0 && <div className="rt-no-data">Tidak ada entitas terpantau di lantai ini.</div>}
          {allFiltered.slice(0, 200).map(e => {
            const cfg = entityTypeConfig[e.type] || entityTypeConfig.patient;
            return (
              <div key={e.id} className={`rt-hud-ei ${selectedEntity?.id === e.id ? 'selected' : ''} ${e.status === 'critical' ? 'critical-flash' : ''}`} onClick={() => handleSideEntityClick(e)}>
                <span className="ei-icon">{cfg.icon}</span>
                <div className="ei-info">
                  <span className="ei-name">{e.name}</span>
                  <span className="ei-loc">Lt.{e.floor} • {e.location}</span>
                </div>
                <span className="ei-tick" style={{background: statusColors[e.status]}}></span>
              </div>
            );
          })}
          {allFiltered.length > 200 && <div className="rt-no-data" style={{textAlign:'center',color:'#64748b'}}>+{allFiltered.length - 200} entitas lainnya...</div>}
        </div>
      </div>

      {/* RIGHT PANEL: Building + Floor selector */}
      <div className="rt-hud-right-panel glass-panel">
        <div className="rt-hud-bld-selector">
          <h4>Pilih Gedung</h4>
          <div className="rt-hud-bld-grid">
            {rsData?.buildings?.map(b => (
              <button key={b.id} className={building?.id === b.id ? 'active' : ''}
                onClick={() => { setSelectedBuildingId(b.id); setSelectedFloor(0); }}>
                {b.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="rt-hud-floor-slice">
          <h4>Floor Slicer 3D</h4>
          <div className="rt-hud-floor-list">
            {floors.slice().reverse().map((f, ri) => {
              const fi = floors.length - 1 - ri;
              return (
                <button key={f.floor} className={`rt-hud-floor-btn ${validSelectedFloor === fi ? 'active' : ''} ${fi > validSelectedFloor ? 'disabled' : ''}`}
                  onClick={() => { setSelectedFloor(fi); }}>
                  <span className="fb-num">Lt. {f.floor}</span>
                  <span className="fb-name">{f.name.split(' — ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

