'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Satellite as SatelliteIcon, Waves } from 'lucide-react';
import { Scene3D } from '@/components/Scene3D';
import { QKDControlPanel } from '@/components/QKDControlPanel';
import { AliceBobPanel } from '@/components/AliceBobPanel';
import { MatchingPanel } from '@/components/MatchingPanel';
import { QBERDisplay } from '@/components/QBERDisplay';
import { KeyDisplay } from '@/components/KeyDisplay';
import { EncryptionDemo } from '@/components/EncryptionDemo';
import { useQKDSimulation } from '@/hooks/useQKDSimulation';

export default function Home() {
  const { isRunning, isComplete, qkdData, error, currentParams, generateKey, reset } = useQKDSimulation();
  const [showEveWarning, setShowEveWarning] = useState(false);

  // Show Eve warning when QBER is high and Eve is active
  useEffect(() => {
    if (qkdData?.eve_active && qkdData.qber > 11) {
      setShowEveWarning(true);
    } else {
      setShowEveWarning(false);
    }
  }, [qkdData]);

  return (
    <div className="min-h-screen bg-slate-900">
      
      <header className="bg-[#0e1f2f] backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/QSLink.png?v=2"
                alt="QSLink Logo"
                width={80}
                height={80}
                className="rounded-lg"
                priority
                unoptimized
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Q-SatLink : Quantum Secure Communication Simulator
                </h1>
                <p className="text-sm text-slate-400">
                  BB84 Protocol • Satellite Communication
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link
                href="/manual"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
              >
                Manual
              </Link>
            </div>
          </div>
        </div>
      </header>

      
      <AnimatePresence>
        {showEveWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-red-900/90 border-b-2 border-red-500"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                <div className="flex-1">
                  <p className="text-white font-bold">
                    EAVESDROPPER DETECTED
                  </p>
                  <p className="text-red-200 text-sm">
                    High QBER ({qkdData?.qber.toFixed(2)}%) indicates possible interception. 
                    The quantum key may be compromised.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden"
              style={{ height: '500px' }}
            >
              <Scene3D
                isSimulating={isRunning}
                aliceBits={qkdData?.alice_bits || []}
                aliceBases={qkdData?.alice_bases || []}
                eveActive={qkdData?.eve_active || false}
                distanceKm={currentParams.distanceKm}
                showCommunication={isComplete}
              />
            </motion.div>

            {isComplete && qkdData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AliceBobPanel
                  title="Alice (Sender)"
                  icon="alice"
                  bits={qkdData.alice_bits}
                  bases={qkdData.alice_bases}
                  matches={qkdData.matches}
                  showMatches={true}
                />
                <AliceBobPanel
                  title="Bob (Receiver)"
                  icon="bob"
                  bits={qkdData.bob_bits.map(b => b ?? -1)}
                  bases={qkdData.bob_bases}
                  matches={qkdData.matches}
                  showMatches={true}
                />
              </div>
            )}

            
            {isComplete && qkdData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MatchingPanel
                  matches={qkdData.matches}
                  matchingCount={qkdData.matching_indices.length}
                  totalBits={qkdData.total_bits_sent}
                  matchRate={qkdData.basis_match_rate}
                />
                <QBERDisplay
                  qber={qkdData.qber}
                  securityLevel={qkdData.error_analysis.security_level}
                  assessment={qkdData.error_analysis.assessment}
                  errorsDetected={qkdData.error_analysis.errors_detected}
                  bitsTested={qkdData.error_analysis.bits_tested}
                  eveActive={qkdData.eve_active}
                />
              </div>
            )}

            
            {isComplete && qkdData && (
              <EncryptionDemo
                quantumKey={qkdData.final_key}
                keyHex={qkdData.final_key_hex}
                isKeySecure={qkdData.secure}
              />
            )}
          </div>

          
          <div className="space-y-6">
            
            <QKDControlPanel
              onGenerateKey={generateKey} 
              isRunning={isRunning}
              onReset={reset}
            />

            
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-900/30 border border-red-500 rounded-lg p-4"
              >
                <p className="text-red-400 font-bold mb-2">❌ Error</p>
                <p className="text-red-300 text-sm">{error}</p>
                <p className="text-red-200 text-xs mt-2">
                  Make sure the backend is running at localhost:8000
                </p>
              </motion.div>
            )}

            
            {isComplete && qkdData && (
              <KeyDisplay
                finalKey={qkdData.final_key}
                finalKeyHex={qkdData.final_key_hex}
                keyLength={qkdData.final_key_length}
                secure={qkdData.secure}
              />
            )}

            
            {isComplete && qkdData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold text-white mb-3">
                  Transmission Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Photons Sent</span>
                    <span className="text-white font-bold">{qkdData.total_bits_sent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Photons Received</span>
                    <span className="text-white font-bold">{qkdData.photons_received}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Transmission Efficiency</span>
                    <span className="text-green-400 font-bold">
                      {qkdData.transmission_efficiency.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Basis Match Rate</span>
                    <span className="text-blue-400 font-bold">
                      {qkdData.basis_match_rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Key Efficiency</span>
                    <span className="text-purple-400 font-bold">
                      {qkdData.key_efficiency.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distance</span>
                    <span className="text-cyan-400 font-bold">
                      {qkdData.channel_stats.distance_km} km
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4"
            >
              <h3 className="text-lg font-bold text-white mb-3">
                How BB84 Works
              </h3>
              <ol className="space-y-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">1.</span>
                  <span>Alice sends photons with random bits and bases</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">2.</span>
                  <span>Photons travel through space (with losses)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">3.</span>
                  <span>Eve may intercept (introduces errors)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">4.</span>
                  <span>Bob measures in random bases</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">5.</span>
                  <span>They compare bases and keep matches</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">6.</span>
                  <span>QBER calculated to detect eavesdropping</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-slate-400 font-bold">7.</span>
                  <span>Final secure key is generated</span>
                </li>
              </ol>
            </motion.div>
          </div>
        </div>
      </main>

      
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-slate-400 text-sm">
          <p>
            Quantum Key Distribution Simulator • BB84 Protocol • Built for SkyHack 2025
          </p>
          <p className="mt-1 text-xs">
            Backend: FastAPI | Frontend: Next.js + React Three Fiber
          </p>
        </div>
      </footer>
    </div>
  );
}

