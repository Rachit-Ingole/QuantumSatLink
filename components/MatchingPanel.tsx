'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Shuffle } from 'lucide-react';

interface MatchingPanelProps {
  matches: boolean[];
  matchingCount: number;
  totalBits: number;
  matchRate: number;
}

export function MatchingPanel({
  matches,
  matchingCount,
  totalBits,
  matchRate
}: MatchingPanelProps) {
  const maxDisplay = 64;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Basis Matching</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">
            {matchRate.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400">
            {matchingCount}/{totalBits} match
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Waiting for basis reconciliation...
        </div>
      ) : (
        <div className="space-y-3">
          
          <div className="flex flex-wrap gap-1">
            {matches.slice(0, maxDisplay).map((match, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.01, type: 'spring' }}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  match
                    ? 'bg-green-900/50 border border-green-500'
                    : 'bg-red-900/50 border border-red-500'
                }`}
              >
                {match ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </motion.div>
            ))}
            {matches.length > maxDisplay && (
              <div className="w-6 h-6 flex items-center justify-center text-slate-500 text-xs">
                +{matches.length - maxDisplay}
              </div>
            )}
          </div>

          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700">
            <div className="bg-green-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-xs text-slate-400">Matched</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {matchingCount}
              </div>
            </div>
            <div className="bg-red-900/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-slate-400">Mismatched</span>
              </div>
              <div className="text-xl font-bold text-red-400">
                {totalBits - matchingCount}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Only matching bases are kept for the final key
          </div>
        </div>
      )}
    </motion.div>
  );
}
