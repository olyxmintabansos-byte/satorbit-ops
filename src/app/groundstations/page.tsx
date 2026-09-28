'use client';

import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Signal, 
  MapPin, 
  Clock, 
  Wifi, 
  Activity, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Satellite as SatIcon
} from 'lucide-react';
import { GroundStation } from '@/lib/types';
import { INITIAL_GROUND_STATIONS } from '@/lib/mockData';

export default function GroundStationsPage() {
  const [stations, setStations] = useState<GroundStation[]>(INITIAL_GROUND_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState<string>('GS-SGS');
  const [slewingStationId, setSlewingStationId] = useState<string | null>(null);
  const [carrierLocked, setCarrierLocked] = useState<boolean>(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('satorbit_active_gs');
    if (saved && stations.some(s => s.id === saved)) {
      setSelectedStationId(saved);
    }
  }, [stations]);

  const handleSelectStation = (id: string) => {
    setSelectedStationId(id);
    localStorage.setItem('satorbit_active_gs', id);
  };

  const currentStation = stations.find(s => s.id === selectedStationId) || stations[0];

  const handleTriggerSlew = (id: string) => {
    setSlewingStationId(id);
    setStations(prev => prev.map(gs => {
      if (gs.id === id) {
        return {
          ...gs,
          currentStatus: 'TRACKING',
          snrDb: Number((16 + Math.random() * 6).toFixed(1))
        };
      }
      return gs;
    }));

    setTimeout(() => {
      setSlewingStationId(null);
    }, 2000);
  };

  const toggleCarrier = () => {
    setCarrierLocked(!carrierLocked);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950/60 text-pink-400 border border-pink-500/40">
              SPACE COMMUNICATION // GROUND NETWORK
            </span>
            <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              6/6 EARTH STATIONS OPERATIONAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-200 to-cyan-300 glow-pink mt-1">
            GROUND STATION NETWORK & RF PASS SCHEDULER
          </h1>
          <p className="text-xs text-purple-300/70 mt-1 font-mono">
            Autonomous parabolic dish tracking, AOS/LOS contact intervals, and high-gain S/X/Ka band telemetry links.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleCarrier}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs border transition-all ${
              carrierLocked 
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-400 box-glow-cyan' 
                : 'bg-amber-950/60 text-amber-300 border-amber-400'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>{carrierLocked ? 'CARRIER LOCK: ACTIVE' : 'CARRIER UNLOCKED'}</span>
          </button>
        </div>
      </div>

      {/* Ground Station Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((gs) => {
          const isSelected = gs.id === selectedStationId;
          const isSlewing = gs.id === slewingStationId;

          return (
            <div
              key={gs.id}
              onClick={() => handleSelectStation(gs.id)}
              className={`cursor-pointer p-5 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-pink-950/40 border-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.3)]'
                  : 'bg-[#0f0022]/70 border-purple-900/60 hover:border-pink-500/40'
              }`}
            >
              {/* Top Row: Code & Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-cyan-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                    {gs.code}
                  </span>
                  <span className="text-xs text-pink-300 font-bold truncate max-w-[150px]">
                    {gs.name}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  gs.currentStatus === 'TRACKING' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 animate-pulse' :
                  gs.currentStatus === 'ACQUIRING' ? 'bg-amber-950 text-amber-300 border-amber-500/60' :
                  gs.currentStatus === 'CALIBRATION' ? 'bg-purple-950 text-purple-300 border-purple-500/60' :
                  'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  {gs.currentStatus}
                </span>
              </div>

              {/* Location & Lat/Lng */}
              <div className="flex items-center gap-1.5 text-xs text-purple-300/80 mb-4 font-mono">
                <MapPin className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                <span className="truncate">{gs.location}</span>
                <span className="text-purple-400/60 ml-auto">{gs.lat.toFixed(1)}°, {gs.lng.toFixed(1)}°</span>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 text-xs font-mono mb-4 pt-3 border-t border-purple-900/50">
                <div className="flex justify-between">
                  <span className="text-purple-300/60">DISH APERTURE:</span>
                  <span className="text-white font-bold">{gs.dishDiameterM}m Parabolic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300/60">RF BANDS:</span>
                  <span className="text-pink-300">{gs.bands.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300/60">LINK SNR:</span>
                  <span className={`font-bold ${gs.snrDb > 10 ? 'text-emerald-400' : 'text-purple-400'}`}>
                    {gs.snrDb > 0 ? `${gs.snrDb} dB` : 'NO CARRIER'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300/60">NEXT PASS AOS:</span>
                  <span className="text-cyan-300 font-bold">{gs.nextPassAos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300/60">MAX ELEVATION:</span>
                  <span className="text-white font-bold">{gs.maxElevationDeg}°</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTriggerSlew(gs.id);
                  }}
                  disabled={isSlewing}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-purple-950/60 hover:bg-pink-900/40 border border-purple-500/40 hover:border-pink-400 text-purple-200 hover:text-cyan-300 text-xs font-mono transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isSlewing ? 'animate-spin text-pink-400' : ''}`} />
                  <span>{isSlewing ? 'SLEWING DISH GIMBALS...' : 'TEST ANTENNA SLEW & PING'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Station Deep Dive Telemetry */}
      <div className="p-6 rounded-xl border border-pink-500/40 bg-[#0d001e]/90 box-glow-pink">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-mono font-bold text-white tracking-wider">
            PRIMARY FEED TELEMETRY // {currentStation.code} ({currentStation.name})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-4 rounded-lg bg-purple-950/40 border border-purple-800/60">
            <span className="text-purple-300/70">ACTIVE TRACK TARGET</span>
            <div className="text-base font-bold text-pink-400 mt-1 flex items-center gap-1.5">
              <SatIcon className="w-4 h-4 text-cyan-400" />
              {currentStation.activePassSatId || 'STANDBY (NO ACTIVE SAT)'}
            </div>
            <p className="text-[10px] text-purple-400/60 mt-1">S-Band Command Uplink Active</p>
          </div>

          <div className="p-4 rounded-lg bg-purple-950/40 border border-purple-800/60">
            <span className="text-purple-300/70">CARRIER SNR LEVEL</span>
            <div className="text-base font-bold text-cyan-300 mt-1">
              {currentStation.snrDb > 0 ? `${currentStation.snrDb} dB (Eb/N0: 12.8)` : '0.0 dB (IDLE)'}
            </div>
            <p className="text-[10px] text-purple-400/60 mt-1">BER: 1.2e-9 (FEC Viterbi R=1/2)</p>
          </div>

          <div className="p-4 rounded-lg bg-purple-950/40 border border-purple-800/60">
            <span className="text-purple-300/70">AZIMUTH / ELEVATION</span>
            <div className="text-base font-bold text-white mt-1">
              AZ 142.4° / EL {currentStation.maxElevationDeg}°
            </div>
            <p className="text-[10px] text-purple-400/60 mt-1">Gimbal Rate: 2.5 deg/sec</p>
          </div>

          <div className="p-4 rounded-lg bg-purple-950/40 border border-purple-800/60">
            <span className="text-purple-300/70">CONTACT WINDOW</span>
            <div className="text-base font-bold text-pink-300 mt-1">
              {currentStation.passDurationMin} MINUTES
            </div>
            <p className="text-[10px] text-purple-400/60 mt-1">Horizon Limit: +5.0° Elevation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
