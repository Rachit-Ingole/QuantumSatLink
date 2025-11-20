"""
Satellite visibility window calculator.
Determines if satellite is above horizon for ground station.
"""
import math
from typing import Tuple

def calculate_satellite_elevation(
    satellite_position: Tuple[float, float, float],
    ground_station_lat: float,
    ground_station_lon: float,
    earth_radius: float = 6371.0  # km
) -> dict:
    """
    Calculate satellite elevation angle and visibility from ground station.
    
    Args:
        satellite_position: (x, y, z) in orbital units
        ground_station_lat: Latitude in degrees
        ground_station_lon: Longitude in degrees
        earth_radius: Earth radius in km
        
    Returns:
        Dictionary with elevation angle, visibility, and time window
    """
    # Convert ground station position to Cartesian
    lat_rad = math.radians(ground_station_lat)
    lon_rad = math.radians(ground_station_lon)
    
    gs_x = earth_radius * math.cos(lat_rad) * math.cos(lon_rad)
    gs_y = earth_radius * math.sin(lat_rad)
    gs_z = earth_radius * math.cos(lat_rad) * math.sin(lon_rad)
    
    # Vector from ground station to satellite
    dx = satellite_position[0] - gs_x
    dy = satellite_position[1] - gs_y
    dz = satellite_position[2] - gs_z
    
    # Distance to satellite
    distance = math.sqrt(dx*dx + dy*dy + dz*dz)
    
    # Ground station normal vector (points away from Earth center)
    gs_mag = math.sqrt(gs_x*gs_x + gs_y*gs_y + gs_z*gs_z)
    normal_x = gs_x / gs_mag
    normal_y = gs_y / gs_mag
    normal_z = gs_z / gs_mag
    
    # Dot product to find elevation angle
    dot_product = (dx * normal_x + dy * normal_y + dz * normal_z)
    elevation_rad = math.asin(dot_product / distance) if distance > 0 else 0
    elevation_deg = math.degrees(elevation_rad)
    
    # Satellite is visible if elevation > 10 degrees (typical minimum)
    min_elevation = 10.0
    is_visible = elevation_deg >= min_elevation
    
    # Estimate time remaining (assumes circular orbit, approximate)
    # For low Earth orbit, visible window is typically 5-10 minutes
    orbital_period_seconds = 5400  # ~90 minutes typical LEO
    visible_fraction = 0.15  # ~15% of orbit is visible
    max_visible_time = orbital_period_seconds * visible_fraction
    
    # Estimate based on elevation angle
    if not is_visible:
        time_remaining = 0
    else:
        # Higher elevation = closer to peak = more time remaining
        time_factor = math.sin(math.radians(elevation_deg))
        time_remaining = int(max_visible_time * time_factor)
    
    return {
        "elevation_angle": round(elevation_deg, 2),
        "is_visible": is_visible,
        "min_elevation_required": min_elevation,
        "time_remaining_seconds": time_remaining,
        "distance_km": round(distance, 2),
        "visibility_status": get_visibility_status(elevation_deg, min_elevation)
    }

def get_visibility_status(elevation: float, min_elevation: float) -> str:
    """Get human-readable visibility status."""
    if elevation < min_elevation:
        return "Below horizon - QKD not possible"
    elif elevation < min_elevation + 5:
        return "Low elevation - marginal link quality"
    elif elevation < 45:
        return "Good visibility"
    else:
        return "Excellent visibility - near zenith"

def is_qkd_window_open(
    satellite_angle: float,
    ground_station_lat: float = 28.6,
    ground_station_lon: float = 77.2,
    satellite_radius_km: float = 500
) -> dict:
    """
    Simplified check if QKD window is currently open.
    
    Args:
        satellite_angle: Current orbital angle in radians
        ground_station_lat: Latitude in degrees
        ground_station_lon: Longitude in degrees
        satellite_radius_km: Orbital radius from Earth center
        
    Returns:
        Dictionary with visibility information
    """
    # Calculate satellite position in 3D
    sat_x = math.cos(satellite_angle) * satellite_radius_km
    sat_y = math.sin(satellite_angle * 0.3) * satellite_radius_km * 0.2
    sat_z = math.sin(satellite_angle) * satellite_radius_km
    
    return calculate_satellite_elevation(
        (sat_x, sat_y, sat_z),
        ground_station_lat,
        ground_station_lon,
        earth_radius=6371.0
    )
