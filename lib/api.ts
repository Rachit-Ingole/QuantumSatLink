/**
 * API Client for QKD Backend
 */

import {
  QKDGenerateRequest,
  QKDGenerateResponse,
  EncryptMessageRequest,
  EncryptMessageResponse,
  DecryptMessageRequest,
  DecryptMessageResponse,
  SatelliteStatsRequest,
  SatelliteStats,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate quantum key using BB84 protocol
   */
  async generateQuantumKey(
    request: QKDGenerateRequest
  ): Promise<QKDGenerateResponse> {
    const response = await fetch(`${this.baseUrl}/api/qkd/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to generate quantum key');
    }

    return response.json();
  }

  /**
   * Encrypt message using quantum key
   */
  async encryptMessage(
    request: EncryptMessageRequest
  ): Promise<EncryptMessageResponse> {
    const response = await fetch(`${this.baseUrl}/api/qkd/encrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to encrypt message');
    }

    return response.json();
  }

  /**
   * Decrypt message using quantum key
   */
  async decryptMessage(
    request: DecryptMessageRequest
  ): Promise<DecryptMessageResponse> {
    const response = await fetch(`${this.baseUrl}/api/qkd/decrypt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to decrypt message');
    }

    return response.json();
  }

  /**
   * Get satellite orbital statistics
   */
  async getSatelliteStats(
    request: SatelliteStatsRequest
  ): Promise<SatelliteStats> {
    const response = await fetch(`${this.baseUrl}/api/satellite/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get satellite stats');
    }

    return response.json();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for custom instances
export { APIClient };
