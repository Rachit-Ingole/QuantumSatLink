"""
FastAPI Backend for Quantum Key Distribution Satellite Simulator
Main application entry point
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import logging

from qkd.bb84 import BB84Protocol
from encryption.aes import encrypt_message, decrypt_message, get_encryption_info
from utils.math_utils import (
    calculate_satellite_distance,
    calculate_orbital_period,
    calculate_orbital_velocity
)
from models.request import (
    QKDGenerateRequest,
    EncryptMessageRequest,
    DecryptMessageRequest,
    SatelliteStatsRequest
)
from models.response import (
    QKDGenerateResponse,
    EncryptMessageResponse,
    DecryptMessageResponse,
    SatelliteStats,
    ErrorResponse
)
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="QKD Satellite Simulator API",
    description="Quantum Key Distribution simulation using BB84 protocol with satellite communication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "QKD Satellite Simulator API",
        "version": "1.0.0",
        "endpoints": {
            "qkd_generate": "/api/qkd/generate",
            "encrypt": "/api/qkd/encrypt",
            "decrypt": "/api/qkd/decrypt",
            "satellite_stats": "/api/satellite/stats",
            "docs": "/docs"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "qkd-api"}


@app.post("/api/qkd/generate", response_model=QKDGenerateResponse)
async def generate_quantum_key(request: QKDGenerateRequest):
    """
    Generate quantum key using BB84 protocol
    
    This endpoint simulates the complete BB84 QKD process:
    1. Alice generates random bits and bases
    2. Photons are transmitted through atmospheric channel
    3. (Optional) Eve performs intercept-resend attack
    4. Bob measures photons in random bases
    5. Basis reconciliation and key sifting
    6. QBER calculation and error testing
    7. Privacy amplification to produce final key
    
    Args:
        request: QKD generation parameters
    
    Returns:
        Complete QKD trace with final secure key
    """
    try:
        logger.info(f"Generating quantum key: {request.num_bits} bits, Eve: {request.eve_active}, Weather: {request.weather}")
        
        # Initialize BB84 protocol with all parameters
        bb84 = BB84Protocol(
            num_bits=request.num_bits,
            eve_active=request.eve_active,
            eve_interception_rate=request.eve_interception_rate,
            eve_attack_type=request.eve_attack_type,
            distance_km=request.distance_km,
            weather=request.weather,
            time_of_day=request.time_of_day,
            telescope_aperture_cm=request.telescope_aperture_cm
        )
        
        # Run the protocol
        trace = bb84.run_protocol()
        
        # Convert to response model
        response = QKDGenerateResponse(
            success=True,
            **trace
        )
        
        logger.info(
            f"QKD complete: {response.final_key_length} bit key, "
            f"QBER: {response.qber}%, Security: {response.security_level}"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error generating quantum key: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate quantum key: {str(e)}"
        )


@app.post("/api/qkd/encrypt", response_model=EncryptMessageResponse)
async def encrypt_with_quantum_key(request: EncryptMessageRequest):
    """
    Encrypt a message using quantum-generated key
    
    Uses AES-256-CBC encryption with key derived from quantum bits.
    This demonstrates practical application of QKD.
    
    Args:
        request: Message and quantum key
    
    Returns:
        Encrypted message with encryption details
    """
    try:
        logger.info(f"Encrypting message ({len(request.message)} chars) with quantum key")
        
        # Validate quantum key
        if not request.quantum_key or len(request.quantum_key) < 16:
            raise HTTPException(
                status_code=400,
                detail="Quantum key must have at least 16 bits"
            )
        
        # Encrypt message
        ciphertext_b64, iv_b64, key_hex = encrypt_message(
            request.message,
            request.quantum_key
        )
        
        # Get encryption info
        encryption_info = get_encryption_info(request.quantum_key)
        
        response = EncryptMessageResponse(
            success=True,
            ciphertext_b64=ciphertext_b64,
            iv_b64=iv_b64,
            encryption_info=encryption_info,
            original_length=len(request.message.encode('utf-8')),
            encrypted_length=len(ciphertext_b64)
        )
        
        logger.info(f"Encryption successful: {response.encrypted_length} bytes")
        
        return response
        
    except Exception as e:
        logger.error(f"Encryption error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Encryption failed: {str(e)}"
        )


@app.post("/api/qkd/decrypt", response_model=DecryptMessageResponse)
async def decrypt_with_quantum_key(request: DecryptMessageRequest):
    """
    Decrypt a message using quantum-generated key
    
    Args:
        request: Ciphertext, IV, and quantum key
    
    Returns:
        Decrypted plaintext message
    """
    try:
        logger.info("Decrypting message with quantum key")
        
        # Decrypt message
        plaintext = decrypt_message(
            request.ciphertext_b64,
            request.iv_b64,
            request.quantum_key
        )
        
        response = DecryptMessageResponse(
            success=True,
            plaintext=plaintext
        )
        
        logger.info("Decryption successful")
        
        return response
        
    except Exception as e:
        logger.error(f"Decryption error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Decryption failed: {str(e)}"
        )


@app.post("/api/satellite/stats", response_model=SatelliteStats)
async def get_satellite_statistics(request: SatelliteStatsRequest):
    """
    Calculate satellite orbital statistics
    
    Provides realistic orbital parameters for visualization.
    
    Args:
        request: Satellite altitude and elevation angle
    
    Returns:
        Orbital statistics including distance, period, velocity
    """
    try:
        logger.info(f"Calculating satellite stats: altitude={request.altitude_km}km")
        
        distance = calculate_satellite_distance(
            request.altitude_km,
            request.elevation_angle_deg
        )
        
        period = calculate_orbital_period(request.altitude_km)
        velocity = calculate_orbital_velocity(request.altitude_km)
        
        response = SatelliteStats(
            altitude_km=request.altitude_km,
            distance_km=distance,
            orbital_period_minutes=period,
            orbital_velocity_km_s=velocity,
            elevation_angle_deg=request.elevation_angle_deg
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Satellite stats error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate satellite stats: {str(e)}"
        )


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions"""
    return ErrorResponse(
        success=False,
        error=exc.detail,
        detail=str(exc)
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return ErrorResponse(
        success=False,
        error="Internal server error",
        detail=str(exc)
    )


# Run with: uvicorn main:app --reload --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
