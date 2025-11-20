'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, Download, Eye, EyeOff } from 'lucide-react';
import { copyToClipboard, downloadAsFile } from '@/lib/utils';

interface KeyDisplayProps {
  finalKey: number[];
  finalKeyHex: string;
  keyLength: number;
  secure: boolean;
}

export function KeyDisplay({
  finalKey,
  finalKeyHex,
  keyLength,
  secure
}: KeyDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showBinary, setShowBinary] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(finalKeyHex);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const content = `Quantum Key (BB84)
Generated: ${new Date().toISOString()}
Length: ${keyLength} bits
Secure: ${secure}

Hexadecimal:
${finalKeyHex}

Binary:
${finalKey.join('')}
`;
    downloadAsFile(content, `quantum-key-${Date.now()}.txt`);
  };

  const maxBinaryDisplay = 128;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white">Final Quantum Key</h3>
        </div>
        {secure ? (
          <div className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm font-medium border border-green-500">
            ✓ SECURE
          </div>
        ) : (
          <div className="px-3 py-1 bg-red-900/50 text-red-400 rounded-full text-sm font-medium border border-red-500">
            INSECURE
          </div>
        )}
      </div>

      {finalKey.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No quantum key generated yet...
        </div>
      ) : (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Key Length</span>
            <span className="text-2xl font-bold text-purple-400">{keyLength} bits</span>
          </div>

          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400 font-medium">Hexadecimal</span>
              <button
                onClick={() => setShowBinary(!showBinary)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                {showBinary ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showBinary ? 'Hide Binary' : 'Show Binary'}
              </button>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm break-all">
              <span className="text-green-400">{finalKeyHex}</span>
            </div>
          </div>

          
          {showBinary && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <span className="text-sm text-slate-400 font-medium">Binary</span>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="flex flex-wrap gap-1 font-mono text-xs">
                  {finalKey.slice(0, maxBinaryDisplay).map((bit, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.01 }}
                      className={bit === 1 ? 'text-blue-400' : 'text-slate-500'}
                    >
                      {bit}
                    </motion.span>
                  ))}
                  {finalKey.length > maxBinaryDisplay && (
                    <span className="text-slate-500">
                      ... +{finalKey.length - maxBinaryDisplay} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Key
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-800/50 rounded p-2">
              <div className="text-slate-400">Hex Length</div>
              <div className="text-white font-bold">{finalKeyHex.length}</div>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <div className="text-slate-400">Bit Length</div>
              <div className="text-white font-bold">{keyLength}</div>
            </div>
            <div className="bg-slate-800/50 rounded p-2">
              <div className="text-slate-400">Entropy</div>
              <div className="text-white font-bold">{keyLength} bits</div>
            </div>
          </div>

          
          {!secure && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-sm">
              <p className="text-red-400 font-medium">Key Compromised</p>
              <p className="text-red-300 text-xs mt-1">
                Do not use this key for encryption. High QBER detected.
              </p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
