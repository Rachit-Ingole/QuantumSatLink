'use client';

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { QKDGenerateResponse } from '@/lib/types';

export function useQKDSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [qkdData, setQkdData] = useState<QKDGenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState({
    numBits: 256,
    eveActive: false,
    eveInterceptionRate: 0.5,
    eveAttackType: 'intercept_resend',
    distanceKm: 500,
    weather: 'clear',
    timeOfDay: 'night',
    telescopeApertureCm: 30
  });

  const generateKey = useCallback(async (params: {
    numBits: number;
    eveActive: boolean;
    eveInterceptionRate: number;
    eveAttackType: string;
    distanceKm: number;
    weather: string;
    timeOfDay: string;
    telescopeApertureCm: number;
  }) => {
    setIsRunning(true);
    setIsComplete(false);
    setError(null);
    setCurrentParams(params);

    try {
      const response = await apiClient.generateQuantumKey({
        num_bits: params.numBits,
        eve_active: params.eveActive,
        eve_interception_rate: params.eveInterceptionRate,
        eve_attack_type: params.eveAttackType,
        distance_km: params.distanceKm,
        weather: params.weather,
        time_of_day: params.timeOfDay,
        telescope_aperture_cm: params.telescopeApertureCm
      });

      setQkdData(response);
      setIsComplete(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to generate quantum key');
      setQkdData(null);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setQkdData(null);
    setIsComplete(false);
    setError(null);
  }, []);

  return {
    isRunning,
    isComplete,
    qkdData,
    error,
    currentParams,
    generateKey,
    reset
  };
}
