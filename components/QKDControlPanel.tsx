'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Cloud, 
  Satellite as SatelliteIcon,
  Hash
} from 'lucide-react';

interface QKDControlPanelProps {
  onGenerateKey: (params: {
    numBits: number;
    eveActive: boolean;
    eveInterceptionRate: number;
    eveAttackType: string;
    distanceKm: number;
    weather: string;
    timeOfDay: string;
    telescopeApertureCm: number;
  }) => void;
  isRunning: boolean;
  onReset: () => void;
}

export function QKDControlPanel({
  onGenerateKey,
  isRunning,
  onReset
}: QKDControlPanelProps) {
  const [numBits, setNumBits] = useState(256);
  const [eveActive, setEveActive] = useState(false);
  const [eveInterceptionRate, setEveInterceptionRate] = useState(0.5);
  const [eveAttackType, setEveAttackType] = useState('intercept_resend');
  const [distanceKm, setDistanceKm] = useState(500);
  const [weather, setWeather] = useState('clear');
  const [timeOfDay, setTimeOfDay] = useState('night');
  const [telescopeApertureCm, setTelescopeApertureCm] = useState(30);

  const handleGenerate = () => {
    // Prevent QKD in rain conditions
    if (weather === 'rain') {
      alert('QKD is not possible in rain conditions. Please select clear sky or light haze.');
      return;
    }
    
    onGenerateKey({
      numBits,
      eveActive,
      eveInterceptionRate,
      eveAttackType,
      distanceKm,
      weather,
      timeOfDay,
      telescopeApertureCm
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          QKD Control Panel
        </h2>
      </div>

      
      <button
        onClick={handleGenerate}
        disabled={isRunning || weather === 'rain'}
        className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          isRunning || weather === 'rain'
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white'
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="w-5 h-5 animate-pulse" />
            Generating Key...
          </>
        ) : weather === 'rain' ? (
          <>
            <Pause className="w-5 h-5" />
            QKD Not Possible (Rain)
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Generate Quantum Key
          </>
        )}
      </button>

      
      <button
        onClick={onReset}
        disabled={isRunning}
        className="w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all disabled:opacity-50"
      >
        <RotateCcw className="w-4 h-4" />
        Reset
      </button>

      
      <div className="pt-4 border-t border-slate-700">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-white font-medium">
            Eavesdropper (Eve)
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={eveActive}
              onChange={(e) => setEveActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-red-600 transition-all"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
          </div>
        </label>

        {eveActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-3"
          >
            <label className="block">
              <span className="text-sm text-slate-300">Attack Type</span>
              <select
                value={eveAttackType}
                onChange={(e) => setEveAttackType(e.target.value)}
                className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value="intercept_resend">Intercept-Resend (Classic)</option>
                <option value="beam_splitting">Beam Splitting</option>
                <option value="photon_number_splitting">Photon Number Splitting</option>
                <option value="detector_blinding">Detector Blinding</option>
                <option value="jammed_link">Jammed Link (DoS)</option>
              </select>
            </label>
            
            <label className="block">
              <span className="text-sm text-slate-300">Interception Rate: {(eveInterceptionRate * 100).toFixed(0)}%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={eveInterceptionRate}
                onChange={(e) => setEveInterceptionRate(parseFloat(e.target.value))}
                className="w-full mt-1 accent-red-500"
              />
            </label>
          </motion.div>
        )}
      </div>

      
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm text-white font-medium">Weather</span>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option value="clear">Clear Sky</option>
            <option value="light_haze">Light Haze</option>
            <option value="heavy_clouds">Heavy Clouds</option>
            <option value="rain">Rain (QKD Impossible)</option>
          </select>
        </label>
        {weather === 'rain' && (
          <p className="text-xs text-red-400 mt-1">
            ⚠ Severe attenuation - QKD not possible
          </p>
        )}
      </div>

      
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm text-white font-medium">Time of Day</span>
          <select
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white"
          >
            <option value="night">Night (Optimal)</option>
            <option value="day">Day (More Noise)</option>
          </select>
        </label>
      </div>

      
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm text-white font-medium">
            Telescope Aperture: {telescopeApertureCm} cm
          </span>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={telescopeApertureCm}
            onChange={(e) => setTelescopeApertureCm(parseInt(e.target.value))}
            className="w-full mt-1 accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10 cm</span>
            <span>100 cm</span>
          </div>
        </label>
      </div>

      
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm text-white font-medium">
            Distance: {distanceKm} km
          </span>
          <input
            type="range"
            min="200"
            max="2000"
            step="50"
            value={distanceKm}
            onChange={(e) => setDistanceKm(parseInt(e.target.value))}
            className="w-full mt-1 accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>200 km</span>
            <span>2000 km</span>
          </div>
        </label>
      </div>

      
      <div className="space-y-2">
        <label className="block">
          <span className="text-sm text-white font-medium">
            Photon Count: {numBits} bits
          </span>
          <input
            type="range"
            min="64"
            max="512"
            step="64"
            value={numBits}
            onChange={(e) => setNumBits(parseInt(e.target.value))}
            className="w-full mt-1 accent-purple-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>64</span>
            <span>512</span>
          </div>
        </label>
      </div>

      
      <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-300 space-y-1">
        <p className="font-medium text-white">Configuration</p>
        <p>• Photons: {numBits} | Distance: {distanceKm} km</p>
        <p>• Weather: {weather.replace('_', ' ')} | {timeOfDay === 'night' ? 'Night' : 'Day'}</p>
        <p>• Aperture: {telescopeApertureCm} cm</p>
        {eveActive && (
          <p className="text-red-400">
            • Eve: {eveAttackType.replace(/_/g, ' ')} ({(eveInterceptionRate * 100).toFixed(0)}%)
          </p>
        )}
      </div>
    </motion.div>
  );
}
