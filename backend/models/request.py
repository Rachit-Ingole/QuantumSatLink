"""
API Request Models (Pydantic)
Defines schemas for incoming requests
"""

from pydantic import BaseModel, Field
from typing import Optional


class QKDGenerateRequest(BaseModel):
    """Request to generate quantum key using BB84"""
    
    num_bits: int = Field(
        default=256,
        ge=64,
        le=2048,
        description="Number of bits to generate (final key will be shorter due to sifting)"
    )
    
    eve_active: bool = Field(
        default=False,
        description="Whether to simulate eavesdropper (Eve) attack"
    )
    
    eve_interception_rate: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Fraction of photons Eve intercepts (0.0 - 1.0)"
    )
    
    eve_attack_type: str = Field(
        default="intercept_resend",
        description="Type of Eve attack: intercept_resend, beam_splitting, photon_number_splitting, detector_blinding, jammed_link"
    )
    
    distance_km: float = Field(
        default=500.0,
        ge=100.0,
        le=2000.0,
        description="Satellite-to-ground station distance in kilometers"
    )
    
    weather: str = Field(
        default="clear",
        description="Weather condition: clear, light_haze, heavy_clouds, rain"
    )
    
    time_of_day: str = Field(
        default="night",
        description="Time of day: day, night (affects background noise)"
    )
    
    telescope_aperture_cm: float = Field(
        default=30.0,
        ge=10.0,
        le=100.0,
        description="Ground station telescope aperture in centimeters"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "num_bits": 256,
                "eve_active": False,
                "eve_interception_rate": 0.5,
                "eve_attack_type": "intercept_resend",
                "distance_km": 500.0,
                "weather": "clear",
                "time_of_day": "night",
                "telescope_aperture_cm": 30.0
            }
        }


class EncryptMessageRequest(BaseModel):
    """Request to encrypt a message using quantum key"""
    
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Plaintext message to encrypt"
    )
    
    quantum_key: list[int] = Field(
        ...,
        description="Quantum key bits from QKD protocol"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "This is a secret message protected by quantum cryptography!",
                "quantum_key": [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1]
            }
        }


class DecryptMessageRequest(BaseModel):
    """Request to decrypt a message using quantum key"""
    
    ciphertext_b64: str = Field(
        ...,
        description="Encrypted message (base64 encoded)"
    )
    
    iv_b64: str = Field(
        ...,
        description="Initialization vector (base64 encoded)"
    )
    
    quantum_key: list[int] = Field(
        ...,
        description="Quantum key bits from QKD protocol"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "ciphertext_b64": "dGVzdCBjaXBoZXJ0ZXh0",
                "iv_b64": "dGVzdCBpdg==",
                "quantum_key": [1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1]
            }
        }


class SatelliteStatsRequest(BaseModel):
    """Request satellite statistics"""
    
    altitude_km: float = Field(
        default=550.0,
        ge=200.0,
        le=2000.0,
        description="Satellite orbital altitude in kilometers"
    )
    
    elevation_angle_deg: float = Field(
        default=45.0,
        ge=0.0,
        le=90.0,
        description="Elevation angle from ground station in degrees"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "altitude_km": 550.0,
                "elevation_angle_deg": 45.0
            }
        }
