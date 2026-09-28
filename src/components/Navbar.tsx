'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Orbit, 
  Radio, 
  Cpu, 
  Camera, 
  Satellite, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [utcTime, setUtcTime] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'ORBITAL TRACK', icon: Orbit, badge: '5 LEO' },
    { href: '/groundstations/', label: 'GROUND NETWORK', icon: Radio, badge: '6 SITES' },
    { href: '/telemetry/', label: 'SUBSYSTEMS HUD', icon: Cpu, badge: 'BUS 28V' },
    { href: '/payload/', label: 'EO IMAGERY & DL', icon: Camera, badge: 'SSR 1.2TB' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-pink-500/30 bg-[#0c0018]/90 backdrop-blur-md">
      {/* Vaporwave top neon strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#ff007f] via-[#7b2cbf] to-[#00f5d4]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative p-2 rounded-lg bg-pink-950/40 border border-pink-500/50 group-hover:border-cyan-400 transition-all box-glow-pink">
              <Satellite className="w-6 h-6 text-pink-400 group-hover:text-cyan-300 transition-colors animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 glow-pink">
                  SATORBIT<span className="text-cyan-400">.OPS</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-900/60 text-pink-300 border border-pink-500/40">
                  VAPOR-12
                </span>
              </div>
              <p className="text-[10px] text-pink-300/70 tracking-tight font-mono">
                CONSTELLATION TELEMETRY & RF MISSION CONTROL
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono tracking-wider transition-all duration-200 border ${
                    isActive
                      ? 'bg-pink-950/60 text-cyan-300 border-pink-500 shadow-[0_0_12px_rgba(255,0,127,0.4)]'
                      : 'text-purple-200/80 border-transparent hover:text-white hover:bg-purple-950/40 hover:border-pink-500/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400 animate-spin-slow' : 'text-pink-400'}`} />
                  <span>{item.label}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-sans ${
                    isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'bg-purple-900/50 text-pink-300'
                  }`}>
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Status Indicators & Clock */}
          <div className="flex items-center gap-3">
            {/* UTC Clock */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-950/40 border border-purple-500/30 text-purple-200 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{utcTime || 'SYNCING UTC...'}</span>
            </div>

            {/* Constellation Lock Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-pink-950/30 border border-pink-500/40 text-pink-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="hidden lg:inline">CONSTELLATION:</span>
              <span className="text-cyan-300 font-bold">NOMINAL</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Synth Sound: ON' : 'Synth Sound: MUTED'}
              className="p-1.5 rounded border border-purple-500/30 bg-purple-950/40 text-purple-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-pink-400" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
