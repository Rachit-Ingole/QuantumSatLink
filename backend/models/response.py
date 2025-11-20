"""
API Response Models (Pydantic)
Defines schemas for API responses
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class ErrorAnalysis(BaseModel):
    """QBER and error analysis results"""
    
    qber_percentage: float = Field(description="Quantum Bit Error Rate as percentage")
    errors_detected: int = Field(description="Number of bit errors found")
    bits_tested: int = Field(description="Total bits tested for errors")
    tested_indices: List[int] = Field(description="Indices of bits tested")
    matching_bases_count: int = Field(description="Number of matching bases")
    basis_match_rate: float = Field(description="Percentage of matching bases")
    security_level: str = Field(description="Security assessment: SECURE, ACCEPTABLE, SUSPICIOUS, ABORT")
    assessment: str = Field(description="Human-readable security assessment")
    eve_active: bool = Field(description="Whether Eve was active")
    safe_to_use_key: bool = Field(description="Whether key is safe to use")


class ChannelStats(BaseModel):
    """Atmospheric channel statistics"""
    
    distance_km: float = Field(description="Transmission distance in kilometers")
    total_loss_probability: float = Field(description="Total photon loss probability")
    transmission_efficiency: float = Field(description="Transmission efficiency percentage")
    distance_attenuation: float = Field(description="Distance-based attenuation factor")
    base_atmospheric_loss: float = Field(description="Base atmospheric loss rate")
    scattering_coefficient: float = Field(description="Rayleigh scattering coefficient")
    turbulence_factor: float = Field(description="Atmospheric turbulence factor")


class EveStats(BaseModel):
    """Eavesdropper attack statistics"""
    
    active: bool = Field(description="Whether Eve was active")
    interception_rate: float = Field(description="Fraction of photons intercepted")
    photons_intercepted: int = Field(description="Number of photons intercepted")
    basis_matches: int = Field(description="Times Eve's basis matched Alice's")
    measurement_errors: int = Field(description="Measurement errors introduced by Eve")
    measurements: List[Dict[str, Any]] = Field(description="Sample of Eve's measurements")


class QKDGenerateResponse(BaseModel):
    """Response from QKD key generation"""
    
    success: bool = Field(description="Whether key generation succeeded")
    
    # Original data
    alice_bits: List[int] = Field(description="Alice's original bit sequence")
    alice_bases: List[str] = Field(description="Alice's preparation bases")
    bob_bases: List[str] = Field(description="Bob's measurement bases")
    bob_bits: List[Optional[int]] = Field(description="Bob's measured bits")
    
    # Matching information
    matching_indices: List[int] = Field(description="Indices where bases matched")
    matches: List[bool] = Field(description="Boolean array of basis matches")
    
    # Keys
    sifted_key: List[int] = Field(description="Key after basis reconciliation")
    final_key: List[int] = Field(description="Final secure key after privacy amplification")
    final_key_length: int = Field(description="Length of final key in bits")
    final_key_hex: str = Field(description="Final key as hexadecimal string")
    
    # Statistics
    total_bits_sent: int = Field(description="Total bits sent by Alice")
    photons_received: int = Field(description="Photons received by Bob")
    transmission_efficiency: float = Field(description="Photon transmission efficiency %")
    basis_match_rate: float = Field(description="Basis matching rate %")
    key_efficiency: float = Field(description="Final key efficiency %")
    
    # Analysis
    qber: float = Field(description="Quantum Bit Error Rate %")
    error_analysis: ErrorAnalysis = Field(description="Detailed error analysis")
    channel_stats: ChannelStats = Field(description="Atmospheric channel stats")
    
    # Security
    eve_active: bool = Field(description="Whether Eve was attacking")
    eve_stats: Optional[EveStats] = Field(description="Eve's attack statistics")
    secure: bool = Field(description="Whether the key is secure")
    security_level: str = Field(description="Security level assessment")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "alice_bits": [1, 0, 1, 1, 0],
                "alice_bases": ["+", "×", "+", "×", "+"],
                "bob_bases": ["+", "+", "×", "×", "+"],
                "bob_bits": [1, 0, 0, 1, 0],
                "matching_indices": [0, 3, 4],
                "matches": [True, False, False, True, True],
                "sifted_key": [1, 1, 0],
                "final_key": [1, 0],
                "final_key_length": 2,
                "final_key_hex": "2",
                "total_bits_sent": 5,
                "photons_received": 4,
                "transmission_efficiency": 80.0,
                "basis_match_rate": 60.0,
                "key_efficiency": 40.0,
                "qber": 3.5,
                "secure": True,
                "security_level": "SECURE"
            }
        }


class EncryptionInfo(BaseModel):
    """Encryption algorithm information"""
    
    algorithm: str = Field(description="Encryption algorithm name")
    key_size_bits: int = Field(description="Key size in bits")
    key_size_bytes: int = Field(description="Key size in bytes")
    block_size: int = Field(description="Block size in bytes")
    mode: str = Field(description="Encryption mode")
    key_hex: str = Field(description="Encryption key in hex")
    key_source: str = Field(description="Source of encryption key")
    quantum_bits_used: int = Field(description="Number of quantum bits used")


class EncryptMessageResponse(BaseModel):
    """Response from message encryption"""
    
    success: bool = Field(description="Whether encryption succeeded")
    ciphertext_b64: str = Field(description="Encrypted message (base64)")
    iv_b64: str = Field(description="Initialization vector (base64)")
    encryption_info: EncryptionInfo = Field(description="Encryption parameters")
    original_length: int = Field(description="Original message length in bytes")
    encrypted_length: int = Field(description="Encrypted message length in bytes")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "ciphertext_b64": "dGVzdCBjaXBoZXJ0ZXh0",
                "iv_b64": "dGVzdCBpdg==",
                "encryption_info": {
                    "algorithm": "AES-256-CBC",
                    "key_size_bits": 256,
                    "mode": "CBC"
                },
                "original_length": 32,
                "encrypted_length": 48
            }
        }


class DecryptMessageResponse(BaseModel):
    """Response from message decryption"""
    
    success: bool = Field(description="Whether decryption succeeded")
    plaintext: str = Field(description="Decrypted plaintext message")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "plaintext": "This is a secret message!"
            }
        }


class SatelliteStats(BaseModel):
    """Satellite orbital statistics"""
    
    altitude_km: float = Field(description="Orbital altitude in km")
    distance_km: float = Field(description="Line-of-sight distance to ground station")
    orbital_period_minutes: float = Field(description="Orbital period in minutes")
    orbital_velocity_km_s: float = Field(description="Orbital velocity in km/s")
    elevation_angle_deg: float = Field(description="Elevation angle from ground station")
    
    class Config:
        json_schema_extra = {
            "example": {
                "altitude_km": 550.0,
                "distance_km": 678.5,
                "orbital_period_minutes": 95.8,
                "orbital_velocity_km_s": 7.6,
                "elevation_angle_deg": 45.0
            }
        }


class ErrorResponse(BaseModel):
    """Error response"""
    
    success: bool = Field(default=False, description="Always false for errors")
    error: str = Field(description="Error message")
    detail: Optional[str] = Field(default=None, description="Detailed error information")
