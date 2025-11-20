"""
Weather condition modeling for satellite-ground quantum links.
Affects photon transmission based on cloud cover and precipitation.
"""
import random
from typing import List, Optional

class WeatherCondition:
    """Weather conditions affecting quantum communication."""
    
    CLEAR = "clear"
    LIGHT_HAZE = "light_haze"
    HEAVY_CLOUDS = "heavy_clouds"
    RAIN = "rain"
    
    LOSS_FACTORS = {
        CLEAR: 1.0,           # No additional loss
        LIGHT_HAZE: 1.3,      # 30% more loss
        HEAVY_CLOUDS: 2.5,    # 150% more loss
        RAIN: 10.0            # QKD nearly impossible
    }
    
    ERROR_FACTORS = {
        CLEAR: 1.0,           # Normal errors
        LIGHT_HAZE: 1.2,      # 20% more errors
        HEAVY_CLOUDS: 1.8,    # 80% more errors
        RAIN: 3.0             # 200% more errors
    }

def apply_weather_effects(
    photon_states: List[Optional[int]],
    weather: str = WeatherCondition.CLEAR
) -> tuple[List[Optional[int]], dict]:
    """
    Apply weather-based attenuation to photon transmission.
    
    Args:
        photon_states: List of photon states (0, 1, or None for lost)
        weather: Weather condition
        
    Returns:
        Tuple of (attenuated photons, statistics dict)
    """
    if weather not in WeatherCondition.LOSS_FACTORS:
        weather = WeatherCondition.CLEAR
    
    loss_factor = WeatherCondition.LOSS_FACTORS[weather]
    
    # Calculate additional loss probability
    base_loss_rate = sum(1 for p in photon_states if p is None) / len(photon_states)
    weather_loss_rate = min(0.95, base_loss_rate * loss_factor)
    
    result = []
    photons_lost_to_weather = 0
    
    for photon in photon_states:
        if photon is None:
            # Already lost
            result.append(None)
        else:
            # Apply weather-based loss
            if random.random() < (weather_loss_rate - base_loss_rate):
                result.append(None)
                photons_lost_to_weather += 1
            else:
                result.append(photon)
    
    stats = {
        "weather_condition": weather,
        "additional_loss_factor": loss_factor,
        "photons_lost_to_weather": photons_lost_to_weather,
        "total_photons_lost": sum(1 for p in result if p is None),
        "weather_description": get_weather_description(weather)
    }
    
    return result, stats

def get_weather_description(weather: str) -> str:
    """Get human-readable description of weather condition."""
    descriptions = {
        WeatherCondition.CLEAR: "Clear sky, optimal conditions",
        WeatherCondition.LIGHT_HAZE: "Light atmospheric haze, minor attenuation",
        WeatherCondition.HEAVY_CLOUDS: "Heavy cloud cover, significant attenuation",
        WeatherCondition.RAIN: "Rain or heavy precipitation, QKD not recommended"
    }
    return descriptions.get(weather, "Unknown weather condition")

def calculate_weather_qber_factor(weather: str) -> float:
    """
    Get error rate multiplication factor for given weather.
    
    Args:
        weather: Weather condition
        
    Returns:
        Factor to multiply QBER by (1.0 = no change)
    """
    return WeatherCondition.ERROR_FACTORS.get(
        weather, 
        WeatherCondition.ERROR_FACTORS[WeatherCondition.CLEAR]
    )
