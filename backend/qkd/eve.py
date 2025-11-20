"""
Eve (Eavesdropper) Attack Simulation
Implements intercept-resend attack on BB84
"""

import random
from typing import List, Tuple
from .photon import Photon
from .basis import QuantumBasis, BasisType


class EveAttack:
    """
    Simulates an eavesdropper (Eve) performing intercept-resend attack
    
    Eve intercepts photons, measures them in a random basis,
    then resends new photons based on her measurement results.
    This introduces errors when Eve's basis doesn't match Alice's.
    """
    
    def __init__(self, interception_rate: float = 0.5):
        """
        Initialize Eve's attack parameters
        
        Args:
            interception_rate: Fraction of photons Eve intercepts (0.0 - 1.0)
        """
        self.interception_rate = interception_rate
        self.intercepted_count = 0
        self.measurements = []
    
    def intercept_and_resend(
        self,
        photons: List[Photon],
        alice_bases: List[BasisType]
    ) -> Tuple[List[Photon], List[BasisType]]:
        """
        Eve intercepts photons, measures them, and resends new photons
        
        Attack process:
        1. Eve randomly selects photons to intercept
        2. For each intercepted photon:
           - Eve measures in a random basis
           - If basis matches Alice's: measurement is correct
           - If basis differs: 50% chance of error
           - Eve resends a new photon based on her measurement
        3. This introduces detectable errors (increases QBER)
        
        Args:
            photons: List of photons from Alice
            alice_bases: Alice's preparation bases
        
        Returns:
            (modified_photons, eve_bases): 
            - Photons after Eve's attack
            - Eve's measurement bases
        """
        self.intercepted_count = 0
        self.measurements = []
        
        modified_photons = []
        eve_bases = []
        
        for i, photon in enumerate(photons):
            # Eve randomly decides whether to intercept this photon
            if random.random() < self.interception_rate:
                # EVE INTERCEPTS
                photon.is_intercepted = True
                self.intercepted_count += 1
                
                # Eve measures in a random basis
                eve_basis = QuantumBasis.random_basis()
                eve_bases.append(eve_basis)
                
                # Measure the photon
                measured_bit, bases_matched = QuantumBasis.measure_photon(
                    photon.bit,
                    alice_bases[i],
                    eve_basis
                )
                
                # Store Eve's measurement
                self.measurements.append({
                    "index": i,
                    "eve_basis": eve_basis.value,
                    "measured_bit": measured_bit,
                    "bases_matched": bases_matched,
                    "original_bit": photon.bit
                })
                
                # Eve resends a new photon based on her measurement
                # This is where errors are introduced if bases didn't match
                new_photon = Photon.create(measured_bit, eve_basis)
                new_photon.is_intercepted = True
                modified_photons.append(new_photon)
            else:
                # Photon passes through unintercepted
                eve_bases.append(None)
                modified_photons.append(photon)
        
        return modified_photons, eve_bases
    
    def get_attack_stats(self) -> dict:
        """Get statistics about Eve's attack"""
        basis_matches = sum(1 for m in self.measurements if m["bases_matched"])
        bit_errors = sum(
            1 for m in self.measurements 
            if m["measured_bit"] != m["original_bit"]
        )
        
        return {
            "active": self.interception_rate > 0,
            "interception_rate": self.interception_rate,
            "photons_intercepted": self.intercepted_count,
            "basis_matches": basis_matches,
            "measurement_errors": bit_errors,
            "measurements": self.measurements[:10]  # First 10 for debugging
        }
