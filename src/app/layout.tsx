import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SatOrbit Ops | Deep Orbit Constellation & Ground Station Network OS',
  description: 'Enterprise LEO constellation telemetry, ground station antenna tracking, and multispectral Earth observation downlink orchestrator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#080010] text-[#f1f5f9] min-h-screen flex flex-col relative selection:bg-pink-500 selection:text-white">
        {/* Subtle scanline overlay */}
        <div className="fixed inset-0 scanline z-50 pointer-events-none opacity-40" />

        {/* Ambient neon gradient orbs */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <Navbar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
