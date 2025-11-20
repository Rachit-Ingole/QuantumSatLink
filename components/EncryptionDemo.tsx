'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Send, Key as KeyIcon, Copy, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { copyToClipboard } from '@/lib/utils';

interface EncryptionDemoProps {
  quantumKey: number[];
  keyHex: string;
  isKeySecure: boolean;
}

export function EncryptionDemo({
  quantumKey,
  keyHex,
  isKeySecure
}: EncryptionDemoProps) {
  const [message, setMessage] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [iv, setIv] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState('');
  const [copiedCipher, setCopiedCipher] = useState(false);

  const hasQuantumKey = quantumKey.length > 0;
  const hasEncrypted = ciphertext.length > 0;

  const handleEncrypt = async () => {
    if (!message.trim()) {
      setError('Please enter a message to encrypt');
      return;
    }

    setIsEncrypting(true);
    setError('');

    try {
      const response = await apiClient.encryptMessage({
        message: message.trim(),
        quantum_key: quantumKey
      });

      setCiphertext(response.ciphertext_b64);
      setIv(response.iv_b64);
      setDecryptedMessage('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Encryption failed');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !iv) {
      setError('No encrypted message to decrypt');
      return;
    }

    setIsDecrypting(true);
    setError('');

    try {
      const response = await apiClient.decryptMessage({
        ciphertext_b64: ciphertext,
        iv_b64: iv,
        quantum_key: quantumKey
      });

      setDecryptedMessage(response.plaintext);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Decryption failed');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopyCiphertext = async () => {
    const success = await copyToClipboard(ciphertext);
    if (success) {
      setCopiedCipher(true);
      setTimeout(() => setCopiedCipher(false), 2000);
    }
  };

  const handleReset = () => {
    setMessage('');
    setCiphertext('');
    setIv('');
    setDecryptedMessage('');
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-white">Quantum Encryption Demo</h3>
        </div>
        {keyHex && (
          <div className="text-xs text-slate-400 font-mono">
            Key: {keyHex.substring(0, 16)}...
          </div>
        )}
      </div>

      {!hasQuantumKey ? (
        <div className="text-center py-8 bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-700">
          <p className="text-slate-400">Generate a quantum key first to encrypt messages</p>
        </div>
      ) : !isKeySecure ? (
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
          <p className="text-red-400 font-medium">Key is Not Secure</p>
          <p className="text-red-300 text-sm mt-1">
            The quantum key was compromised. Generate a new key without eavesdropping.
          </p>
        </div>
      ) : (
        <>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Message to Encrypt
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secret message..."
              rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isEncrypting || hasEncrypted}
            />
          </div>

          
          {!hasEncrypted && (
            <button
              onClick={handleEncrypt}
              disabled={isEncrypting || !message.trim()}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEncrypting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Encrypting...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Encrypt with Quantum Key
                </>
              )}
            </button>
          )}

          
          <AnimatePresence>
            {hasEncrypted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-300">
                      Encrypted Message (Ciphertext)
                    </label>
                    <button
                      onClick={handleCopyCiphertext}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedCipher ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-slate-800 border border-emerald-500/50 rounded-lg p-4 font-mono text-xs break-all text-emerald-400">
                    {ciphertext}
                  </div>
                  <div className="text-xs text-slate-400">
                    Algorithm: AES-256-CBC | IV: {iv.substring(0, 12)}...
                  </div>
                </div>

                
                <button
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isDecrypting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5" />
                      Decrypt with Quantum Key
                    </>
                  )}
                </button>

                
                {decryptedMessage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium text-slate-300">
                      Decrypted Message
                    </label>
                    <div className="bg-slate-800 border-2 border-emerald-500 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Successfully Decrypted!</span>
                      </div>
                      <p className="text-white font-medium">{decryptedMessage}</p>
                    </div>
                  </motion.div>
                )}

                
                <button
                  onClick={handleReset}
                  className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-all"
                >
                  Encrypt Another Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-900/30 border border-red-500 rounded-lg p-3 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          
          <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400">
            <p className="font-medium text-white mb-1">How it works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Your message is encrypted using AES-256-CBC</li>
              <li>The encryption key is derived from the quantum key</li>
              <li>Only someone with the exact quantum key can decrypt it</li>
              <li>Any eavesdropping is detected via QBER before encryption</li>
            </ul>
          </div>
        </>
      )}
    </motion.div>
  );
}
