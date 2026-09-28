'use client';

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  HardDrive, 
  ArrowDownCircle, 
  PlusCircle, 
  CheckCircle2, 
  Layers, 
  Eye, 
  CloudRain, 
  Radio, 
  Play, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { PayloadTask } from '@/lib/types';
import { INITIAL_PAYLOAD_TASKS } from '@/lib/mockData';

export default function PayloadPage() {
  const [tasks, setTasks] = useState<PayloadTask[]>(INITIAL_PAYLOAD_TASKS);
  const [downlinking, setDownlinking] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // New task form state
  const [newTargetName, setNewTargetName] = useState<string>('');
  const [newSensorMode, setNewSensorMode] = useState<PayloadTask['sensorMode']>('MULTISPECTRAL_4K');
  const [newPriority, setNewPriority] = useState<PayloadTask['priority']>('HIGH');
  const [newDataSizeGb, setNewDataSizeGb] = useState<number>(45);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('satorbit_payload_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveTasks = (newTasks: PayloadTask[]) => {
    setTasks(newTasks);
    localStorage.setItem('satorbit_payload_tasks', JSON.stringify(newTasks));
  };

  // Trigger high-speed downlink transfer
  const handleTriggerDownlink = () => {
    setDownlinking(true);

    const interval = setInterval(() => {
      setTasks(prev => {
        let allDone = true;
        const updated = prev.map(t => {
          if (t.downlinkStatus === 'DOWNLINKING' || t.downlinkStatus === 'BUFFERED') {
            const nextPct = Math.min(100, t.downlinkProgressPct + 15);
            const status = nextPct >= 100 ? 'COMPLETED' : 'DOWNLINKING';
            if (nextPct < 100) allDone = false;
            return {
              ...t,
              downlinkProgressPct: nextPct,
              downlinkStatus: status as PayloadTask['downlinkStatus']
            };
          }
          return t;
        });

        if (allDone) {
          clearInterval(interval);
          setDownlinking(false);
        }
        localStorage.setItem('satorbit_payload_tasks', JSON.stringify(updated));
        return updated;
      });
    }, 600);
  };

  // Add new observation task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetName.trim()) return;

    const newTask: PayloadTask = {
      id: `TASK-${Math.floor(1000 + Math.random() * 9000)}`,
      satId: 'SAT-01',
      satName: 'EOS-AURA',
      targetName: newTargetName.trim(),
      targetLat: Number((Math.random() * 120 - 60).toFixed(3)),
      targetLng: Number((Math.random() * 360 - 180).toFixed(3)),
      sensorMode: newSensorMode,
      gsdResolutionM: newSensorMode === 'MULTISPECTRAL_4K' ? 0.35 : 1.2,
      priority: newPriority,
      dataSizeGb: Number(newDataSizeGb),
      cloudCoverEstimatePct: Math.floor(Math.random() * 20),
      downlinkStatus: 'BUFFERED',
      downlinkProgressPct: 0,
      acquisitionTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
    };

    saveTasks([newTask, ...tasks]);
    setNewTargetName('');
    setShowModal(false);
  };

  // Calculate total buffered data
  const totalGb = tasks.reduce((sum, t) => sum + t.dataSizeGb, 0);
  const ssrCapacityGb = 2048; // 2 TB SSR
  const ssrUsedPct = Math.min(100, Math.round((totalGb / ssrCapacityGb) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-500/30 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-950/60 text-pink-400 border border-pink-500/40">
              PAYLOAD INSTRUMENTATION // EARTH OBSERVATION
            </span>
            <span className="text-xs text-cyan-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              DIRECT X-BAND MODEM (850 MBPS) READY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-200 to-cyan-300 glow-pink mt-1">
            EARTH OBSERVATION IMAGERY & DOWNLINK QUEUE
          </h1>
          <p className="text-xs text-purple-300/70 mt-1 font-mono">
            Multispectral 4K, SAR stripmap radar, Solid-State Recorder (SSR) buffer, and space-to-ground downlink management.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-500/50 hover:border-cyan-400 text-purple-200 hover:text-cyan-300 font-mono text-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>QUEUE NEW EO MISSION</span>
          </button>

          <button
            onClick={handleTriggerDownlink}
            disabled={downlinking}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-xs border transition-all ${
              downlinking 
                ? 'bg-cyan-950 text-cyan-300 border-cyan-400 box-glow-cyan' 
                : 'bg-pink-950/80 hover:bg-pink-900 border-pink-500 text-pink-200 box-glow-pink'
            }`}
          >
            <ArrowDownCircle className={`w-4 h-4 ${downlinking ? 'animate-bounce text-cyan-400' : 'text-pink-400'}`} />
            <span>{downlinking ? 'DOWNLINKING RAW FRAMES...' : 'TRANSMIT DOWNLINK PASS'}</span>
          </button>
        </div>
      </div>

      {/* Solid State Recorder (SSR) Storage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-pink-500/40 bg-[#0d001e]/80 box-glow-pink">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-purple-300/80 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-pink-400" />
              ONBOARD SOLID-STATE RECORDER (SSR)
            </span>
            <span className="text-xs font-mono text-cyan-300 font-bold">{ssrUsedPct}% FULL</span>
          </div>
          <div className="w-full h-3 rounded-full bg-purple-950 overflow-hidden border border-purple-800 mb-2">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 transition-all duration-500" 
              style={{ width: `${ssrUsedPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-purple-400/70">
            <span>BUFFERED: {totalGb.toFixed(1)} GB</span>
            <span>CAPACITY: 2,048 GB (2.0 TB)</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-purple-300/80 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" />
              RF DOWNLINK BITRATE
            </span>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">850.0 Mbps</div>
            <p className="text-[10px] font-mono text-purple-400/60 mt-0.5">X-Band Direct-to-Ground Carrier</p>
          </div>
          <div className="text-right font-mono text-xs text-purple-300/80">
            <span className="block text-pink-400 font-bold">QPSK 3/4 FEC</span>
            <span className="text-[10px] text-purple-400/60">BER &lt; 10⁻⁹</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-purple-500/40 bg-[#0d001e]/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-purple-300/80 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-pink-400" />
              OPTICAL SENSOR APERTURE
            </span>
            <div className="text-xl font-bold font-mono text-pink-300 mt-1">0.35m / PIXEL GSD</div>
            <p className="text-[10px] font-mono text-purple-400/60 mt-0.5">TDI Pushbroom CCD 32k Channels</p>
          </div>
          <div className="text-right font-mono text-xs text-purple-300/80">
            <span className="block text-emerald-400 font-bold">CALIBRATED</span>
            <span className="text-[10px] text-purple-400/60">Focal Plane: -15°C</span>
          </div>
        </div>
      </div>

      {/* Observation Tasks Table */}
      <div className="p-6 rounded-xl border border-pink-500/40 bg-[#0d001e]/90 box-glow-pink space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-pink-400" />
            <h2 className="text-base font-mono font-bold text-white tracking-wider">
              PAYLOAD TASKING & DOWNLINK BUFFER ({tasks.length} ACQUISITIONS)
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-400/80">
            CCSDS PACKET PROTOCOL 102.0-B-5
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-purple-800/80 text-purple-300/70 text-[11px]">
                <th className="pb-3 font-normal">TASK ID</th>
                <th className="pb-3 font-normal">TARGET NAME / COORDINATES</th>
                <th className="pb-3 font-normal">SENSOR MODE</th>
                <th className="pb-3 font-normal">GSD</th>
                <th className="pb-3 font-normal">DATA SIZE</th>
                <th className="pb-3 font-normal">CLOUD COVER</th>
                <th className="pb-3 font-normal">DOWNLINK PROGRESS</th>
                <th className="pb-3 font-normal">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/40">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-purple-950/30 transition-colors">
                  <td className="py-3.5 font-bold text-cyan-300 whitespace-nowrap">
                    {task.id}
                  </td>
                  <td className="py-3.5">
                    <div className="font-bold text-white">{task.targetName}</div>
                    <div className="text-[10px] text-purple-400/70">
                      {task.targetLat.toFixed(2)}°, {task.targetLng.toFixed(2)}° • {task.satName}
                    </div>
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-pink-300 border border-purple-800">
                      {task.sensorMode}
                    </span>
                  </td>
                  <td className="py-3.5 whitespace-nowrap text-purple-200">
                    {task.gsdResolutionM}m
                  </td>
                  <td className="py-3.5 whitespace-nowrap text-cyan-300 font-bold">
                    {task.dataSizeGb} GB
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-purple-300">
                      <CloudRain className="w-3 h-3 text-cyan-400" />
                      {task.cloudCoverEstimatePct}%
                    </span>
                  </td>
                  <td className="py-3.5 w-36">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-purple-300/80">
                        <span>{task.downlinkProgressPct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-purple-950 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${task.downlinkProgressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 whitespace-nowrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${
                      task.downlinkStatus === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50' :
                      task.downlinkStatus === 'DOWNLINKING' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 animate-pulse' :
                      task.downlinkStatus === 'BUFFERED' ? 'bg-purple-950 text-pink-300 border-pink-500/40' :
                      'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {task.downlinkStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Queueing New Task */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-xl border border-pink-500/60 bg-[#0e0022] box-glow-pink font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-purple-800/60 pb-3">
              <h3 className="font-bold text-base text-pink-300">SCHEDULE OBSERVATION TASK</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-purple-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-purple-300/80 mb-1">TARGET IDENTIFIER / REGION:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strait of Hormuz Tanker Traffic"
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-purple-950/60 border border-purple-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-purple-300/80 mb-1">SENSOR INSTRUMENT MODE:</label>
                <select
                  value={newSensorMode}
                  onChange={(e) => setNewSensorMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded bg-purple-950/60 border border-purple-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="MULTISPECTRAL_4K">MULTISPECTRAL 4K (0.35m GSD)</option>
                  <option value="HYPERSPECTRAL_16CH">HYPERSPECTRAL 16-BAND (1.5m GSD)</option>
                  <option value="SAR_STRIPMAP">SAR RADAR STRIPMAP (1.0m GSD)</option>
                  <option value="THERMAL_INFRARED">THERMAL INFRARED (2.0m GSD)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300/80 mb-1">DATA ALLOCATION (GB):</label>
                  <input
                    type="number"
                    min="5"
                    max="250"
                    value={newDataSizeGb}
                    onChange={(e) => setNewDataSizeGb(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-purple-950/60 border border-purple-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-purple-300/80 mb-1">PRIORITY CLASS:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded bg-purple-950/60 border border-purple-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="CRITICAL">CRITICAL (LEVEL 1)</option>
                    <option value="HIGH">HIGH (LEVEL 2)</option>
                    <option value="ROUTINE">ROUTINE (LEVEL 3)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-purple-950/80 text-purple-300 border border-purple-800 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-500 text-white font-bold border border-pink-400 shadow-[0_0_12px_rgba(255,0,127,0.5)]"
                >
                  CONFIRM TASK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
