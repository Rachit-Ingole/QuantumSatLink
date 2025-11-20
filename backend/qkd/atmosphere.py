"""
Atmospheric Channel Simulation
Models photon loss, scattering, and distance-based attenuation
"""

import random
import math
from typing import List
from .photon import Photon


class AtmosphericChannel:
    """
    Simulates realistic atmospheric effects on quantum photon transmission
    """
    
    def __init__(
        self,
        distance_km: float = 500.0,
        base_loss_rate: float = 0.15,
        scattering_coefficient: float = 0.0001,
        turbulence_factor: float = 0.05
    ):
        """
        Initialize atmospheric channel
        
        Args:
            distance_km: Distance between satellite and ground station (km)
            base_loss_rate: Base photon loss probability (0.0 - 1.0)
            scattering_coefficient: Rayleigh scattering coefficient
            turbulence_factor: Atmospheric turbulence impact
        """
        self.distance_km = distance_km
        self.base_loss_rate = base_loss_rate
        self.scattering_coefficient = scattering_coefficient
        self.turbulence_factor = turbulence_factor
    
    def calculate_total_loss(self) -> float:
        """
        Calculate total photon loss probability based on atmospheric effects
        
        Formula combines:
        - Base atmospheric absorption
        - Distance-dependent attenuation (Beer-Lambert law)
        - Rayleigh scattering
        - Turbulence
        
        Returns:
            Total loss probability (0.0 - 1.0)
        """
        # Distance attenuation (exponential decay)
        distance_loss = 1.0 - math.exp(-self.scattering_coefficient * self.distance_km)
        
        # Atmospheric absorption
        absorption = self.base_loss_rate
        
        # Turbulence (random fluctuation)
        turbulence = random.uniform(0, self.turbulence_factor)
        
        # Combined loss (capped at 0.95 to allow some photons through)
        total_loss = min(0.95, distance_loss + absorption + turbulence)
        
        return total_loss
    
    def transmit_photons(self, photons: List[Photon]) -> List[Photon]:
        """
        Simulate photon transmission through atmospheric channel
        
        Args:
            photons: List of photons to transmit
        
        Returns:
            List of photons that survived transmission
        """
        loss_probability = self.calculate_total_loss()
        
        transmitted_photons = []
        for photon in photons:
            # Each photon has a chance of being lost
            if random.random() > loss_probability:
                photon.is_transmitted = True
                
                # Atmospheric effects can cause phase/polarization errors
                # Even without eavesdropping:
                # - Turbulence causes wavefront distortion
                # - Birefringence in atmosphere rotates polarization
                # - Background light causes detector errors
                # These introduce ~1-3% bit errors naturally
                
                # Small chance of bit flip due to atmospheric noise
                atmospheric_error_rate = 0.01 + (self.distance_km / 2000.0) * 0.02  # 1-3%
                if random.random() < atmospheric_error_rate:
                    photon.bit = 1 - photon.bit  # Flip bit due to atmospheric distortion
                
                transmitted_photons.append(photon)
            else:
                photon.is_transmitted = False
        
        return transmitted_photons
    
    def get_transmission_efficiency(self) -> float:
        """
        Get the expected transmission efficiency percentage
        
        Returns:
            Efficiency as percentage (0-100)
        """
        loss = self.calculate_total_loss()
        efficiency = (1.0 - loss) * 100
        return round(efficiency, 2)
    
    def get_channel_stats(self) -> dict:
        """Get detailed channel statistics"""
        total_loss = self.calculate_total_loss()
        distance_loss = 1.0 - math.exp(-self.scattering_coefficient * self.distance_km)
        
        return {
            "distance_km": self.distance_km,
            "total_loss_probability": round(total_loss, 4),
            "transmission_efficiency": self.get_transmission_efficiency(),
            "distance_attenuation": round(distance_loss, 4),
            "base_atmospheric_loss": self.base_loss_rate,
            "scattering_coefficient": self.scattering_coefficient,
            "turbulence_factor": self.turbulence_factor
        }
