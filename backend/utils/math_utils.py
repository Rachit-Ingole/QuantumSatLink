"""
Utility functions for mathematical calculations
"""

import math


def calculate_satellite_distance(
    altitude_km: float,
    elevation_angle_deg: float
) -> float:
    """
    Calculate line-of-sight distance from ground station to satellite
    
    Uses spherical Earth model and basic trigonometry
    
    Args:
        altitude_km: Satellite orbital altitude above Earth surface
        elevation_angle_deg: Elevation angle from ground station (0-90°)
    
    Returns:
        Distance in kilometers
    """
    EARTH_RADIUS_KM = 6371.0
    
    elevation_rad = math.radians(elevation_angle_deg)
    
    # Using law of cosines for spherical triangle
    # d = sqrt(R² + (R+h)² - 2R(R+h)cos(90°+elevation))
    
    r = EARTH_RADIUS_KM
    h = altitude_km
    
    # Simplified for small elevation angles
    distance = math.sqrt(
        r**2 + (r + h)**2 - 2 * r * (r + h) * math.cos(math.pi/2 + elevation_rad)
    )
    
    return round(distance, 2)


def calculate_orbital_period(altitude_km: float) -> float:
    """
    Calculate orbital period of satellite
    
    Uses Kepler's third law
    
    Args:
        altitude_km: Orbital altitude above Earth surface
    
    Returns:
        Orbital period in minutes
    """
    EARTH_RADIUS_KM = 6371.0
    EARTH_MU = 398600.4418  # Earth's gravitational parameter (km³/s²)
    
    semi_major_axis = EARTH_RADIUS_KM + altitude_km
    
    # T = 2π * sqrt(a³/μ)
    period_seconds = 2 * math.pi * math.sqrt(semi_major_axis**3 / EARTH_MU)
    period_minutes = period_seconds / 60
    
    return round(period_minutes, 2)


def calculate_orbital_velocity(altitude_km: float) -> float:
    """
    Calculate orbital velocity of satellite
    
    Args:
        altitude_km: Orbital altitude above Earth surface
    
    Returns:
        Velocity in km/s
    """
    EARTH_RADIUS_KM = 6371.0
    EARTH_MU = 398600.4418
    
    orbital_radius = EARTH_RADIUS_KM + altitude_km
    
    # v = sqrt(μ/r)
    velocity = math.sqrt(EARTH_MU / orbital_radius)
    
    return round(velocity, 2)


def bits_to_bytes(bits: list[int]) -> bytes:
    """
    Convert list of bits to bytes
    
    Args:
        bits: List of 0s and 1s
    
    Returns:
        Byte array
    """
    # Pad to multiple of 8
    padded = bits + [0] * (8 - len(bits) % 8) if len(bits) % 8 != 0 else bits
    
    byte_array = bytearray()
    for i in range(0, len(padded), 8):
        byte = padded[i:i+8]
        value = sum(bit << (7 - j) for j, bit in enumerate(byte))
        byte_array.append(value)
    
    return bytes(byte_array)


def bytes_to_bits(byte_data: bytes) -> list[int]:
    """
    Convert bytes to list of bits
    
    Args:
        byte_data: Byte array
    
    Returns:
        List of 0s and 1s
    """
    bits = []
    for byte in byte_data:
        for i in range(7, -1, -1):
            bits.append((byte >> i) & 1)
    return bits
