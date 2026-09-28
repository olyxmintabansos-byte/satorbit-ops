'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Disc, 
  Sun, 
  Magnet, 
  BatteryMedium, 
  Navigation, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle,
  Sliders,
  Sparkles
} from 'lucide-react';
import { INITIAL_SUBSYSTEM_TELEMETRY } from '@/lib/mockData';
import { SubsystemTelemetry } from '@/lib/types';

export default function TelemetryPage() {
  const [telemetry, setTelemetry] = useState<SubsystemTelemetry>(INITIAL_SUBSYSTEM_TELEMETRY);
  const [desatInProgress, setDesatInProgress] = useState<boolean>(false);
  const [dumpMessage, setDumpMessage] = useState<string | null>(null);

  // Trigger Reaction Wheel Desaturation via Magnetorquers
  const handleDumpMomentum = () => {
    setDesatInProgress(true);
    setDumpMessage('MAGNETORQUER MOMENTUM DUMP INITIATED: Applying counter-torque...');

    setTimeout(() => {
      setTelemetry(prev => ({
        ...prev,
        reactionWheels: prev.reactionWheels.map(rw => ({
          ...rw,
          rpm: Math.round(rw.rpm * 0.45) // wheel speeds reduced
        })),
        magnetorquers: prev.magnetorquers.map(mq => ({
          ...mq,
          state: 'DAMPING',
          dipoleAm2: Number((mq.dipoleAm2 * 1.5).toFixed(1))
        }))
      }));
      setDesatInProgress(false);
      setDumpMessage('MOMENTUM DESATURATION COMPLETE: Reaction wheel RPM reduced below safety threshold.');
      setTimeout(() => setDumpMessage(null), 4000);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950/60 text-pink-400 border border-pink-500/40">
              SATELLITE BUS // ADCS & POWER SYSTEMS
            </span>
            <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              BUS 28V REGULATED EPS NOMINAL
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-200 to-cyan-300 glow-pink mt-1">
            SUBSYSTEMS & ATTITUDE CONTROL HUD
          </h1>
          <p className="text-xs text-purple-300/70 mt-1 font-mono">
            Reaction wheels flywheel momentum, GaAs solar array sun vector tracking, 3-axis magnetorquers, and star tracker quaternions.
          </p>
        </div>

        {/* Global Action Button */}
        <div>
          <button
            onClick={handleDumpMomentum}
            disabled={desatInProgress}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs border transition-all ${
              desatInProgress 
                ? 'bg-amber-950 text-amber-300 border-amber-500' 
                : 'bg-pink-950/70 hover:bg-pink-900 border-pink-500 text-cyan-300 box-glow-pink'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${desatInProgress ? 'animate-spin text-pink-400' : 'text-cyan-400'}`} />
            <span>{desatInProgress ? 'DUMPING ANGULAR MOMENTUM...' : 'TRIGGER MOMENTUM DESAT'}</span>
          </button>
        </div>
      </div>

      {/* Alert Banner if any */}
      {dumpMessage && (
        <div className="p-3 rounded-lg bg-pink-950/60 border border-pink-500 text-xs font-mono text-pink-200 flex items-center gap-2 box-glow-pink">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{dumpMessage}</span>
        </div>
      )}

      {/* Grid: Reaction Wheels & Magnetorquers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reaction Wheels (Flywheels) */}
        <div className="p-6 rounded-xl border border-pink-500/40 bg-[#0d001e]/80 box-glow-pink space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-pink-400" />
              <h2 className="font-mono font-bold text-sm text-pink-300">
                4-AXIS REACTION WHEELS (ADCS FLYWHEELS)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
              PYRAMID CONFIG (45° SKEW)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {telemetry.reactionWheels.map((wheel) => {
              const absRpm = Math.abs(wheel.rpm);
              const maxRpm = 6000;
              const pct = Math.min(100, Math.round((absRpm / maxRpm) * 100));

              return (
                <div key={wheel.id} className="p-3.5 rounded-lg bg-purple-950/40 border border-purple-800/60 font-mono text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-300">WHEEL RW-{wheel.id}</span>
                    <span className="text-pink-400 font-bold">{wheel.rpm} RPM</span>
                  </div>

                  {/* RPM Bar */}
                  <div className="w-full h-1.5 rounded-full bg-purple-900/60 overflow-hidden">
                    <div 
                      className={`h-full ${absRpm > 4500 ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-400 to-pink-500'}`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-purple-300/70 pt-1">
                    <span>TEMP: <strong className="text-white">{wheel.tempC}°C</strong></span>
                    <span>CURRENT: <strong className="text-white">{wheel.currentAmps}A</strong></span>
                  </div>
                  <div className="text-[10px] text-purple-400/60">
                    Jitter: {wheel.jitterMilliRad} mrad/s • Motor Torque: 0.08 Nm
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3-Axis Magnetorquer Coils */}
        <div className="p-6 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-800/40 pb-3">
            <div className="flex items-center gap-2">
              <Magnet className="w-5 h-5 text-cyan-400" />
              <h2 className="font-mono font-bold text-sm text-cyan-300">
                3-AXIS ELECTROMAGNETIC TORQUERS (MTQ)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/40">
              GEOMAGNETIC DESAT
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {telemetry.magnetorquers.map((mtq) => (
              <div key={mtq.axis} className="p-3.5 rounded-lg bg-purple-950/40 border border-purple-800/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">MAGNETORQUER {mtq.axis}-COIL</span>
                  <div className="text-[11px] text-purple-300/70 mt-0.5">
                    Dipole Moment: <strong className="text-pink-400">{mtq.dipoleAm2} A·m²</strong> (Polarity: {mtq.polarity})
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                  mtq.state === 'ACTIVE' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50' :
                  mtq.state === 'DAMPING' ? 'bg-pink-950 text-pink-300 border-pink-500/50 animate-pulse' :
                  'bg-slate-900 text-slate-400 border-slate-700'
                }`}>
                  {mtq.state}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40 text-[11px] font-mono text-purple-300/80">
            Torquers utilize the Earth's geomagnetic field (IGRF-13 model) to bleed excess angular momentum accumulated by solar radiation pressure and aerodynamic drag.
          </div>
        </div>
      </div>

      {/* Grid: Solar Arrays & Power Bus & Star Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solar Arrays */}
        <div className="p-5 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-800/40 pb-3">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono font-bold text-sm text-pink-300">SOLAR ARRAY DRIVES (SADA)</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {telemetry.solarPanels.map((sp) => (
              <div key={sp.panel} className="p-3 rounded bg-purple-950/40 border border-purple-800/60 space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-white">{sp.panel}</span>
                  <span className="text-amber-300">{sp.outputWatts}W</span>
                </div>
                <div className="flex justify-between text-[11px] text-purple-300/70">
                  <span>Sun Angle: {sp.sunAngleDeg}°</span>
                  <span>{sp.voltageV}V / {sp.currentA}A</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold">
                  STATUS: {sp.status} (GaAs TRIPLE-JUNCTION)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EPS Power Bus */}
        <div className="p-5 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-800/40 pb-3">
            <BatteryMedium className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-sm text-cyan-300">ELECTRICAL POWER BUS (EPS)</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">REGULATED BUS:</span>
              <span className="text-cyan-300 font-bold">{telemetry.powerBus.busVoltageV} VDC</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">TOTAL CURRENT LOAD:</span>
              <span className="text-white font-bold">{telemetry.powerBus.busCurrentA} A</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">DEPTH OF DISCHARGE:</span>
              <span className="text-pink-400 font-bold">{telemetry.powerBus.batteryDODPct}% DOD</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">BATTERY PACK TEMP:</span>
              <span className="text-cyan-300 font-bold">{telemetry.powerBus.packTempC}°C</span>
            </div>
            <div className="flex justify-between p-2 rounded bg-purple-950/30 border border-purple-900/40">
              <span className="text-purple-300/70">RESERVE CAPACITY:</span>
              <span className="text-white font-bold">{telemetry.powerBus.whRemaining} Wh</span>
            </div>
          </div>
        </div>

        {/* Star Tracker & Attitude Quaternions */}
        <div className="p-5 rounded-xl border border-pink-500/40 bg-[#0d001e]/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-purple-800/40 pb-3">
            <Navigation className="w-5 h-5 text-pink-400" />
            <h3 className="font-mono font-bold text-sm text-pink-300">STAR TRACKER & QUATERNIONS</h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                STAR TRACKER LOCK
              </span>
              <span className="text-[10px] text-emerald-300">32 STARS MATCHED</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-purple-300/70">
                <span>ROLL (Φ):</span>
                <span className="text-white font-bold">{telemetry.attitude.rollDeg}°</span>
              </div>
              <div className="flex justify-between text-purple-300/70">
                <span>PITCH (θ):</span>
                <span className="text-white font-bold">{telemetry.attitude.pitchDeg}°</span>
              </div>
              <div className="flex justify-between text-purple-300/70">
                <span>YAW (ψ):</span>
                <span className="text-white font-bold">{telemetry.attitude.yawDeg}°</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#06000e] border border-purple-800 font-mono text-[10px] text-cyan-300">
              <span className="text-purple-400/80 block mb-1">ATTITUDE QUATERNION [q0, q1, q2, q3]:</span>
              [{telemetry.attitude.quaternion.join(', ')}]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
