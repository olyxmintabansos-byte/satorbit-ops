'use client';

import React, { useState, useEffect } from 'react';
import { 
  Orbit, 
  Satellite as SatIcon, 
  Activity, 
  Compass, 
  Zap, 
  Thermometer, 
  BatteryCharging, 
  Copy, 
  Check, 
  Play, 
  RotateCw, 
  Crosshair,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { Satellite, GroundStation } from '@/lib/types';
import { INITIAL_SATELLITES, INITIAL_GROUND_STATIONS } from '@/lib/mockData';

export default function OrbitalTrackPage() {
  const [satellites, setSatellites] = useState<Satellite[]>(INITIAL_SATELLITES);
  const [selectedSatId, setSelectedSatId] = useState<string>('SAT-01');
  const [copiedTle, setCopiedTle] = useState<boolean>(false);
  const [timeOffsetMinutes, setTimeOffsetMinutes] = useState<number>(0);
  const [simActive, setSimActive] = useState<boolean>(true);

  // Load selection from localStorage
  useEffect(() => {
    const savedSat = localStorage.getItem('satorbit_active_sat');
    if (savedSat && satellites.some(s => s.id === savedSat)) {
      setSelectedSatId(savedSat);
    }
  }, [satellites]);

  const handleSelectSat = (id: string) => {
    setSelectedSatId(id);
    localStorage.setItem('satorbit_active_sat', id);
  };

  const currentSat = satellites.find(s => s.id === selectedSatId) || satellites[0];

  // Simulation tick for orbital movement
  useEffect(() => {
    if (!simActive) return;
    const timer = setInterval(() => {
      setTimeOffsetMinutes(prev => (prev + 1) % 1440);
    }, 3000);
    return () => clearInterval(timer);
  }, [simActive]);

  const copyTle = () => {
    const tle = `${currentSat.tleLine1}\n${currentSat.tleLine2}`;
    navigator.clipboard.writeText(tle);
    setCopiedTle(true);
    setTimeout(() => setCopiedTle(false), 2000);
  };

  // Convert lat/lng to SVG coordinates (-180..180 -> 0..800, -90..90 -> 400..0)
  const mapWidth = 800;
  const mapHeight = 400;

  const toSvgX = (lng: number) => ((lng + 180) / 360) * mapWidth;
  const toSvgY = (lat: number) => ((90 - lat) / 180) * mapHeight;

  // Generate ground track points for current satellite based on inclination
  const generateGroundTrack = (sat: Satellite, offsetMin: number) => {
    const points: { x: number; y: number }[] = [];
    const period = sat.periodMinutes;
    const inc = sat.inclinationDeg;

    for (let t = -60; t <= 60; t += 3) {
      const angle = ((t + offsetMin) / period) * 2 * Math.PI;
      const lat = Math.sin(angle) * (inc > 90 ? 180 - inc : inc);
      const lng = (((sat.lng + (t * 360) / period) + 180) % 360) - 180;
      points.push({ x: toSvgX(lng), y: toSvgY(lat) });
    }
    return points;
  };

  const groundTrackPoints = generateGroundTrack(currentSat, timeOffsetMinutes);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950/60 text-pink-400 border border-pink-500/40">
              MISSION CONTROL // LEO EPHEMERIS
            </span>
            <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SGP4 PROPAGATOR ONLINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-200 to-cyan-300 glow-pink mt-1">
            ORBITAL GROUND TRACK & CONSTELLATION MAP
          </h1>
          <p className="text-xs text-purple-300/70 mt-1 font-mono">
            Interactive sub-satellite coordinate trajectory, ground station visibility footprints, and SGP4 orbital parameters.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTimeOffsetMinutes(prev => prev + 10)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-950/60 border border-purple-500/40 text-purple-200 hover:text-cyan-300 hover:border-cyan-400 font-mono text-xs transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>+10 MIN STEP</span>
          </button>
          <button
            onClick={() => setSimActive(!simActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs border transition-all ${
              simActive 
                ? 'bg-pink-950/70 text-pink-300 border-pink-500 box-glow-pink' 
                : 'bg-purple-950/40 text-purple-400 border-purple-500/30'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${simActive ? 'text-pink-400 animate-spin-slow' : ''}`} />
            <span>{simActive ? 'ORBIT TICK: ON' : 'SIM PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Satellite Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {satellites.map((sat) => {
          const isSelected = sat.id === selectedSatId;
          return (
            <button
              key={sat.id}
              onClick={() => handleSelectSat(sat.id)}
              className={`text-left p-3 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-pink-950/60 border-pink-400 text-white shadow-[0_0_15px_rgba(255,0,127,0.35)]'
                  : 'bg-[#120024]/60 border-purple-900/60 text-purple-300/70 hover:border-pink-500/40 hover:text-purple-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-cyan-300">{sat.id}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  sat.status === 'NOMINAL' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40' :
                  sat.status === 'DOWNLINK' ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40' :
                  sat.status === 'ECLIPSE' ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40' :
                  'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                }`}>
                  {sat.status}
                </span>
              </div>
              <div className="text-sm font-bold truncate text-pink-200">{sat.name}</div>
              <div className="text-[11px] font-mono text-purple-300/60 flex items-center justify-between mt-1">
                <span>ALT {sat.altitudeKm} km</span>
                <span>{sat.velocityKmh.toLocaleString()} km/h</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Ground Track Map Display */}
      <div className="p-4 sm:p-6 rounded-xl border border-pink-500/40 bg-[#0d001e]/80 backdrop-blur-md relative overflow-hidden box-glow-pink">
        {/* Subtle grid background */}
        <div className="absolute inset-0 vapor-grid opacity-25 pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-mono font-bold text-white tracking-wider">
              GLOBAL EQUAL-AREA PROJECTION // GROUND TRACK
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-purple-300/80">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              TRACK (±60m)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              GROUND STATION
            </span>
          </div>
        </div>

        {/* Interactive SVG World Track Canvas */}
        <div className="relative border border-purple-800/60 rounded-lg bg-[#06000e] overflow-hidden">
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-auto max-h-[500px] select-none"
          >
            {/* Latitude / Longitude Grid Lines */}
            <g stroke="#240046" strokeWidth="0.75" strokeDasharray="3,3">
              {[60, 30, 0, -30, -60].map(lat => (
                <line key={`lat-${lat}`} x1="0" y1={toSvgY(lat)} x2={mapWidth} y2={toSvgY(lat)} />
              ))}
              {[-120, -60, 0, 60, 120].map(lng => (
                <line key={`lng-${lng}`} x1={toSvgX(lng)} y1="0" x2={toSvgX(lng)} y2={mapHeight} />
              ))}
            </g>

            {/* Continents Outline Silhouette (Stylized Cyber Wireframe) */}
            <g fill="none" stroke="#4c1d95" strokeWidth="1" opacity="0.45">
              {/* North America */}
              <polygon points="120,60 190,70 210,130 180,180 150,160 110,120 100,70" />
              {/* South America */}
              <polygon points="220,190 260,210 270,270 230,340 210,280 200,210" />
              {/* Eurasia */}
              <polygon points="380,50 490,40 650,60 700,120 620,150 510,130 420,110 390,70" />
              {/* Africa */}
              <polygon points="390,140 450,150 470,230 430,300 390,260 370,180" />
              {/* Australia */}
              <polygon points="630,240 700,250 690,300 620,290" />
            </g>

            {/* Equator & Prime Meridian Emphasis */}
            <line x1="0" y1={mapHeight / 2} x2={mapWidth} y2={mapHeight / 2} stroke="#7209b7" strokeWidth="1.2" />
            <line x1={mapWidth / 2} y1="0" x2={mapWidth / 2} y2={mapHeight} stroke="#7209b7" strokeWidth="1.2" />

            {/* Ground Stations Footprints & Markers */}
            {INITIAL_GROUND_STATIONS.map((gs) => {
              const gx = toSvgX(gs.lng);
              const gy = toSvgY(gs.lat);
              return (
                <g key={gs.id}>
                  {/* Coverage Ring */}
                  <circle
                    cx={gx}
                    cy={gy}
                    r="40"
                    fill="rgba(0, 245, 212, 0.05)"
                    stroke="#00f5d4"
                    strokeWidth="0.8"
                    strokeDasharray="2,2"
                  />
                  {/* Station Marker */}
                  <circle cx={gx} cy={gy} r="3.5" fill="#00f5d4" />
                  <text
                    x={gx + 5}
                    y={gy - 4}
                    fill="#00f5d4"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {gs.code}
                  </text>
                </g>
              );
            })}

            {/* Orbital Ground Track Path */}
            {groundTrackPoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#ff007f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4,2"
                points={groundTrackPoints.map(p => `${p.x},${p.y}`).join(' ')}
              />
            )}

            {/* Active Satellite Marker */}
            {(() => {
              const satX = toSvgX(currentSat.lng);
              const satY = toSvgY(currentSat.lat);
              return (
                <g>
                  {/* Pulse wave ring */}
                  <circle
                    cx={satX}
                    cy={satY}
                    r="14"
                    fill="none"
                    stroke="#ff007f"
                    strokeWidth="1.5"
                    className="animate-ping"
                    style={{ transformOrigin: `${satX}px ${satY}px` }}
                  />
                  {/* Central Dot */}
                  <circle cx={satX} cy={satY} r="5" fill="#ff007f" />
                  <circle cx={satX} cy={satY} r="2" fill="#ffffff" />
                  {/* Label */}
                  <rect
                    x={satX + 8}
                    y={satY - 18}
                    width="110"
                    height="18"
                    rx="3"
                    fill="#15002b"
                    stroke="#ff007f"
                    strokeWidth="0.8"
                  />
                  <text
                    x={satX + 12}
                    y={satY - 5}
                    fill="#f1f5f9"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {currentSat.name}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Map Coordinates Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-purple-900/50 text-[11px] font-mono text-purple-300">
          <div className="flex items-center gap-3">
            <span>SUB-SAT LAT: <strong className="text-pink-400">{currentSat.lat.toFixed(2)}°</strong></span>
            <span>SUB-SAT LNG: <strong className="text-cyan-400">{currentSat.lng.toFixed(2)}°</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span>INCLINATION: <strong className="text-white">{currentSat.inclinationDeg}°</strong></span>
            <span>PERIOD: <strong className="text-white">{currentSat.periodMinutes} MIN</strong></span>
          </div>
        </div>
      </div>

      {/* Detailed Satellite Telemetry & TLE Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orbital Mechanics Parameters */}
        <div className="p-5 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-800/40 pb-3">
            <Orbit className="w-5 h-5 text-pink-400" />
            <h3 className="font-mono font-bold text-sm text-pink-300">ORBITAL KEPLERIAN ELEMENTS</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">NORAD CATALOG ID:</span>
              <span className="text-cyan-300 font-bold">{currentSat.noradId}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">INTERNATIONAL DESIGNATOR:</span>
              <span className="text-white font-bold">{currentSat.designator}</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">APOGEE ALTITUDE:</span>
              <span className="text-pink-400 font-bold">{currentSat.apogeeKm} km</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">PERIGEE ALTITUDE:</span>
              <span className="text-pink-400 font-bold">{currentSat.perigeeKm} km</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">ORBITAL VELOCITY:</span>
              <span className="text-cyan-300 font-bold">{currentSat.velocityKmh.toLocaleString()} km/h</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">MISSION LAUNCH DATE:</span>
              <span className="text-white font-bold">{currentSat.launchDate}</span>
            </div>
          </div>
        </div>

        {/* Bus Power & Thermal Status */}
        <div className="p-5 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-800/40 pb-3">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-sm text-cyan-300">BUS POWER & THERMAL METRICS</h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-purple-300/80 flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
                  BATTERY LEVEL (DOD RESERVE)
                </span>
                <span className="text-cyan-300 font-bold">{currentSat.batteryLevelPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-950 overflow-hidden border border-purple-800">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-cyan-400" 
                  style={{ width: `${currentSat.batteryLevelPct}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-purple-300/70">SOLAR ARRAY HARVEST</span>
                <div className="text-lg font-bold text-pink-400">{currentSat.solarKw} kW</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-purple-300/70">BUS CORE TEMP</span>
                <div className="text-lg font-bold text-cyan-300 flex items-center gap-1 justify-end">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  {currentSat.busTempC}°C
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-pink-950/20 border border-pink-500/30 text-[11px] text-pink-300/90 leading-tight">
              {currentSat.status === 'ECLIPSE' ? (
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  UMBRA SHADOW: Running on LiFePO4 battery reserve.
                </span>
              ) : (
                <span className="text-emerald-400">
                  SUNLIT PASS: Dual-axis GaAs solar wings tracking solar vector.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* TLE Two-Line Element Set */}
        <div className="p-5 rounded-xl border border-pink-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-pink-400" />
              <h3 className="font-mono font-bold text-sm text-pink-300">TWO-LINE ELEMENT (TLE)</h3>
            </div>
            <button
              onClick={copyTle}
              className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-pink-950/60 border border-pink-500/40 text-pink-300 hover:text-white transition-colors"
            >
              {copiedTle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTle ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>

          <div className="p-3 rounded bg-[#06000e] border border-purple-800/80 font-mono text-[10px] text-cyan-300 overflow-x-auto space-y-1">
            <p className="whitespace-pre">{currentSat.tleLine1}</p>
            <p className="whitespace-pre">{currentSat.tleLine2}</p>
          </div>

          <div className="text-[11px] font-mono text-purple-300/70 space-y-1">
            <p>• Format: NORAD standard 69-character fixed column.</p>
            <p>• Epoch Rev: SGP4 mathematical orbit model compliant.</p>
            <p>• B* Drag Term: 0.48201e-4 / Inclination: {currentSat.inclinationDeg}°.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
