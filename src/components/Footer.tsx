'use client';

import React from 'react';
import { Terminal, Shield, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-purple-500/30 bg-[#080010] text-purple-300 font-mono text-xs overflow-hidden">
      {/* Synth perspective grid background */}
      <div className="absolute inset-0 perspective-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-pink-400 font-bold tracking-wider">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>SATORBIT.OPS // CORE</span>
            </div>
            <p className="text-[11px] text-purple-300/70 leading-relaxed">
              Real-time deep orbit telemetry, ground station antenna scheduling, and multispectral Earth observation downlink orchestrator.
            </p>
          </div>

          <div>
            <div className="text-pink-400 font-bold mb-2 tracking-wider flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>GROUND NETWORK SITES</span>
            </div>
            <ul className="space-y-1 text-[11px] text-purple-300/80">
              <li>SGS - Svalbard Arctic Terminal (78.2° N)</li>
              <li>HBK - Hartebeesthoek RSA (25.8° S)</li>
              <li>WFF - Wallops Flight Facility (37.9° N)</li>
              <li>TRL - Troll Antarctic Station (72.0° S)</li>
            </ul>
          </div>

          <div>
            <div className="text-pink-400 font-bold mb-2 tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>ORBITAL COMPLIANCE</span>
            </div>
            <p className="text-[11px] text-purple-300/80 leading-relaxed">
              CCSDS Space Link Protocol & NORAD Two-Line Element (TLE) epoch synchronization engine. Ephemeris propagation: SGP4/SDP4 models.
            </p>
          </div>

          <div>
            <div className="text-pink-400 font-bold mb-2 tracking-wider">
              <span>TITAN #48 ECOSYSTEM</span>
            </div>
            <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40">
              <p className="text-[10px] text-cyan-300 font-semibold mb-1">
                STYLE #12: VAPORWAVE / DEEP ORBIT
              </p>
              <p className="text-[10px] text-purple-300/70 mb-2">
                Part of The 50 Titans Enterprise Suite by olyxmintabansos-byte.
              </p>
              <a
                href="https://github.com/olyxmintabansos-byte/satorbit-ops"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] text-pink-400 hover:text-cyan-300 transition-colors underline"
              >
                <span>olyxmintabansos-byte/satorbit-ops</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between text-[11px] text-purple-400/60">
          <p>© 2026 SATORBIT.OPS • SPACE NETWORK OPERATIONS • ALL SYSTEMS GO</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono">
            <span className="text-cyan-400">EPOCH: 2026-271.8492</span>
            <span>|</span>
            <span className="text-pink-400">DOWNLINK: 850 MBPS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
