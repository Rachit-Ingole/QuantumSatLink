'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Activity } from 'lucide-react';
import { getQBERColor, getSecurityColor } from '@/lib/utils';

interface QBERDisplayProps {
  qber: number;
  securityLevel: string;
  assessment: string;
  errorsDetected: number;
  bitsTested: number;
  eveActive: boolean;
}

export function QBERDisplay({
  qber,
  securityLevel,
  assessment,
  errorsDetected,
  bitsTested,
  eveActive
}: QBERDisplayProps) {
  const qberColor = getQBERColor(qber);
  const securityColor = getSecurityColor(securityLevel);
  const qberPercentage = Math.min((qber / 20) * 100, 100); // Scale to 20% max for display

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-white">QBER Analysis</h3>
      </div>

      
      <div className="mb-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-slate-400">Quantum Bit Error Rate</span>
          <span className="text-3xl font-bold" style={{ color: qberColor }}>
            {qber.toFixed(2)}%
          </span>
        </div>

        
        <div className="h-6 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${qberPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: qberColor }}
          />
          
          
          <div className="absolute inset-0 flex">
            <div className="flex-1 border-r border-slate-600" title="< 5% Secure"></div>
            <div className="flex-1 border-r border-slate-600" title="5-11% Acceptable"></div>
            <div className="flex-1 border-r border-slate-600" title="11-15% Suspicious"></div>
            <div className="flex-1" title="> 15% Abort"></div>
          </div>
        </div>

        
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0%</span>
          <span>5%</span>
          <span>11%</span>
          <span>15%</span>
          <span>20%</span>
        </div>
      </div>

      
      <div 
        className="rounded-lg p-3 mb-4 border-2"
        style={{ 
          borderColor: securityColor,
          backgroundColor: `${securityColor}20`
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: securityColor }} />
            <span className="font-bold" style={{ color: securityColor }}>
              {securityLevel}
            </span>
          </div>
          {securityLevel === 'ABORT' && (
            <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
          )}
        </div>
        <p className="text-sm text-slate-300">{assessment}</p>
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Errors Detected</div>
          <div className="text-2xl font-bold text-red-400">{errorsDetected}</div>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Bits Tested</div>
          <div className="text-2xl font-bold text-blue-400">{bitsTested}</div>
        </div>
      </div>

      
      {eveActive && qber > 11 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-red-900/30 border border-red-500 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="font-bold text-sm">EAVESDROPPER DETECTED!</span>
          </div>
          <p className="text-xs text-red-300 mt-1">
            High error rate indicates possible interception
          </p>
        </motion.div>
      )}

      
      <div className="mt-4 pt-4 border-t border-slate-700 space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></div>
          <span className="text-slate-400">&lt; 5%: Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
          <span className="text-slate-400">5-11%: Acceptable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f97316' }}></div>
          <span className="text-slate-400">11-15%: Suspicious</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
          <span className="text-slate-400">&gt; 15%: Abort</span>
        </div>
      </div>
    </motion.div>
  );
}
