/**
 * TypeScript Types for QKD Satellite Simulator
 */

export interface QKDGenerateRequest {
  num_bits: number;
  eve_active: boolean;
  eve_interception_rate: number;
  eve_attack_type?: string;
  distance_km: number;
  weather?: string;
  time_of_day?: string;
  telescope_aperture_cm?: number;
}

export interface ErrorAnalysis {
  qber_percentage: number;
  errors_detected: number;
  bits_tested: number;
  tested_indices: number[];
  matching_bases_count: number;
  basis_match_rate: number;
  security_level: 'SECURE' | 'ACCEPTABLE' | 'SUSPICIOUS' | 'ABORT';
  assessment: string;
  eve_active: boolean;
  safe_to_use_key: boolean;
}

export interface ChannelStats {
  distance_km: number;
  total_loss_probability: number;
  transmission_efficiency: number;
  distance_attenuation: number;
  base_atmospheric_loss: number;
  scattering_coefficient: number;
  turbulence_factor: number;
}

export interface EveStats {
  active: boolean;
  interception_rate: number;
  photons_intercepted: number;
  basis_matches: number;
  measurement_errors: number;
  measurements: Array<{
    index: number;
    eve_basis: string;
    measured_bit: number;
    bases_matched: boolean;
    original_bit: number;
  }>;
}

export interface QKDGenerateResponse {
  success: boolean;
  alice_bits: number[];
  alice_bases: string[];
  bob_bases: string[];
  bob_bits: (number | null)[];
  matching_indices: number[];
  matches: boolean[];
  sifted_key: number[];
  final_key: number[];
  final_key_length: number;
  final_key_hex: string;
  total_bits_sent: number;
  photons_received: number;
  transmission_efficiency: number;
  basis_match_rate: number;
  key_efficiency: number;
  qber: number;
  error_analysis: ErrorAnalysis;
  channel_stats: ChannelStats;
  eve_active: boolean;
  eve_stats?: EveStats;
  secure: boolean;
  security_level: string;
}

export interface EncryptMessageRequest {
  message: string;
  quantum_key: number[];
}

export interface EncryptionInfo {
  algorithm: string;
  key_size_bits: number;
  key_size_bytes: number;
  block_size: number;
  mode: string;
  key_hex: string;
  key_source: string;
  quantum_bits_used: number;
}

export interface EncryptMessageResponse {
  success: boolean;
  ciphertext_b64: string;
  iv_b64: string;
  encryption_info: EncryptionInfo;
  original_length: number;
  encrypted_length: number;
}

export interface DecryptMessageRequest {
  ciphertext_b64: string;
  iv_b64: string;
  quantum_key: number[];
}

export interface DecryptMessageResponse {
  success: boolean;
  plaintext: string;
}

export interface SatelliteStatsRequest {
  altitude_km: number;
  elevation_angle_deg: number;
}

export interface SatelliteStats {
  altitude_km: number;
  distance_km: number;
  orbital_period_minutes: number;
  orbital_velocity_km_s: number;
  elevation_angle_deg: number;
}

export interface SimulationState {
  isRunning: boolean;
  isComplete: boolean;
  currentStep: number;
  qkdData: QKDGenerateResponse | null;
  encryptionData: EncryptMessageResponse | null;
  decryptionData: DecryptMessageResponse | null;
  error: string | null;
}
