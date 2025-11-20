'use client';

import { motion } from 'framer-motion';
import { User, Radio } from 'lucide-react';
import { getBasisColor } from '@/lib/utils';

interface AliceBobPanelProps {
  title: string;
  icon: 'alice' | 'bob';
  bits: number[];
  bases: string[];
  matches?: boolean[];
  showMatches?: boolean;
}

export function AliceBobPanel({
  title,
  icon,
  bits,
  bases,
  matches,
  showMatches = false
}: AliceBobPanelProps) {
  const Icon = icon === 'alice' ? User : Radio;
  const iconColor = icon === 'alice' ? 'text-blue-400' : 'text-green-400';
  const maxDisplay = 32; // Show first 32 bits

  return (
    <motion.div
      initial={{ opacity: 0, x: icon === 'alice' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {bits.length > 0 && (
          <span className="ml-auto text-sm text-slate-400">
            {bits.length} bits
          </span>
        )}
      </div>

      {bits.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Waiting for quantum transmission...
        </div>
      ) : (
        <div className="space-y-3">
          
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">Bits</div>
            <div className="flex flex-wrap gap-1">
              {bits.slice(0, maxDisplay).map((bit, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono font-bold ${
                    showMatches && matches && matches[i]
                      ? 'bg-green-900/50 text-green-300 border border-green-500'
                      : bit === null
                      ? 'bg-slate-800 text-slate-600'
                      : 'bg-slate-800 text-white border border-slate-600'
                  }`}
                >
                  {bit === null ? '-' : bit}
                </motion.div>
              ))}
              {bits.length > maxDisplay && (
                <div className="w-8 h-8 flex items-center justify-center text-slate-500 text-xs">
                  +{bits.length - maxDisplay}
                </div>
              )}
            </div>
          </div>

          
          <div>
            <div className="text-xs text-slate-400 mb-1 font-medium">Bases</div>
            <div className="flex flex-wrap gap-1">
              {bases.slice(0, maxDisplay).map((basis, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.02 + 0.1 }}
                  className="w-8 h-8 flex items-center justify-center rounded text-sm font-bold border-2"
                  style={{
                    borderColor: getBasisColor(basis),
                    color: getBasisColor(basis),
                    backgroundColor: `${getBasisColor(basis)}20`
                  }}
                >
                  {basis}
                </motion.div>
              ))}
              {bases.length > maxDisplay && (
                <div className="w-8 h-8 flex items-center justify-center text-slate-500 text-xs">
                  +{bases.length - maxDisplay}
                </div>
              )}
            </div>
          </div>

          
          <div className="flex gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getBasisColor('+') }}></div>
              <span>+ (Rectilinear)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: getBasisColor('×') }}></div>
              <span>× (Diagonal)</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
