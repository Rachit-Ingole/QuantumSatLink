"""
BB84 Quantum Key Distribution Protocol
Complete implementation with Alice, Bob, and optional Eve
"""

import random
from typing import List, Tuple, Optional
from .photon import Photon
from .basis import QuantumBasis, BasisType
from .atmosphere import AtmosphericChannel
from .eve import EveAttack
from .qber import calculate_qber, analyze_errors, apply_privacy_amplification
from .weather import apply_weather_effects, calculate_weather_qber_factor
from .attacks import apply_eve_attack


class BB84Protocol:
    """
    Complete BB84 QKD Protocol Implementation
    
    Steps:
    1. Alice generates random bits and bases
    2. Alice prepares photons and sends to Bob
    3. (Optional) Eve intercepts and resends
    4. Photons travel through atmospheric channel
    5. Bob measures photons in random bases
    6. Alice and Bob compare bases (public channel)
    7. They keep only bits where bases matched
    8. They test a sample for errors (QBER)
    9. Privacy amplification produces final key
    """
    
    def __init__(
        self,
        num_bits: int = 256,
        eve_active: bool = False,
        eve_interception_rate: float = 0.5,
        eve_attack_type: str = "intercept_resend",
        distance_km: float = 500.0,
        weather: str = "clear",
        time_of_day: str = "night",
        telescope_aperture_cm: float = 30.0
    ):
        """
        Initialize BB84 protocol
        
        Args:
            num_bits: Number of bits to generate (final key will be shorter)
            eve_active: Whether Eve is eavesdropping
            eve_interception_rate: Fraction of photons Eve intercepts
            eve_attack_type: Type of attack (intercept_resend, beam_splitting, etc.)
            distance_km: Satellite-to-ground distance
            weather: Weather condition (clear, light_haze, heavy_clouds, rain)
            time_of_day: Time of day (day, night)
            telescope_aperture_cm: Receiver telescope aperture diameter
        """
        self.num_bits = num_bits
        self.eve_active = eve_active
        self.eve_attack_type = eve_attack_type
        self.weather = weather
        self.time_of_day = time_of_day
        self.telescope_aperture_cm = telescope_aperture_cm
        
        # Initialize components
        self.atmosphere = AtmosphericChannel(distance_km=distance_km)
        self.eve = EveAttack(interception_rate=eve_interception_rate) if eve_active else None
        
        # Protocol data
        self.alice_bits: List[int] = []
        self.alice_bases: List[BasisType] = []
        self.alice_photons: List[Photon] = []
        
        self.bob_bases: List[BasisType] = []
        self.bob_bits: List[int] = []
        self.bob_received_photons: List[Photon] = []
        
        self.matching_indices: List[int] = []
        self.sifted_key: List[int] = []
        self.final_key: List[int] = []
        
        self.qber: float = 0.0
        self.error_analysis: dict = {}
        self.eve_stats: dict = {}
        self.weather_stats: dict = {}
    
    def run_protocol(self) -> dict:
        """
        Execute complete BB84 protocol
        
        Returns:
            Complete protocol trace with all steps and results
        """
        # Step 1: Alice prepares
        self._alice_prepare()
        
        # Step 2: Eve intercepts (if active)
        if self.eve_active and self.eve:
            self._eve_intercept()
        
        # Step 3: Atmospheric transmission
        self._atmospheric_transmission()
        
        # Step 3b: Apply weather effects
        self._apply_weather_effects()
        
        # Step 4: Bob measures
        self._bob_measure()
        
        # Step 5: Basis reconciliation
        self._basis_reconciliation()
        
        # Step 6: Error testing (QBER)
        self._error_testing()
        
        # Step 7: Privacy amplification
        self._privacy_amplification()
        
        # Return complete trace
        return self._generate_trace()
    
    def _alice_prepare(self):
        """Step 1: Alice generates random bits and prepares photons"""
        self.alice_bits = [random.randint(0, 1) for _ in range(self.num_bits)]
        self.alice_bases = QuantumBasis.generate_random_bases(self.num_bits)
        
        # Prepare photons
        self.alice_photons = [
            Photon.create(bit, basis)
            for bit, basis in zip(self.alice_bits, self.alice_bases)
        ]
    
    def _eve_intercept(self):
        """Step 2: Eve performs intercept-resend attack"""
        if not self.eve:
            return
        
        self.alice_photons, eve_bases = self.eve.intercept_and_resend(
            self.alice_photons,
            self.alice_bases
        )
        self.eve_stats = self.eve.get_attack_stats()
    
    def _atmospheric_transmission(self):
        """Step 3: Photons travel through atmospheric channel"""
        self.bob_received_photons = self.atmosphere.transmit_photons(
            self.alice_photons
        )
    
    def _apply_weather_effects(self):
        """Step 3b: Apply weather-based attenuation"""
        # Extract photon bits that were received
        received_bits = []
        for photon in self.bob_received_photons:
            if hasattr(photon, 'bit') and photon.bit is not None:
                received_bits.append(photon.bit)
            else:
                received_bits.append(None)
        
        # Apply weather effects
        from .weather import apply_weather_effects
        affected_bits, self.weather_stats = apply_weather_effects(
            received_bits,
            self.weather
        )
        
        # Update photons with weather-affected bits
        for i, (photon, affected_bit) in enumerate(zip(self.bob_received_photons, affected_bits)):
            if affected_bit is None and photon.bit is not None:
                # Weather caused this photon to be lost
                photon.is_transmitted = False
    
    def _bob_measure(self):
        """Step 4: Bob measures received photons in random bases"""
        # Bob generates random bases
        self.bob_bases = QuantumBasis.generate_random_bases(self.num_bits)
        
        # Bob measures each received photon
        self.bob_bits = [None] * self.num_bits
        
        received_indices = {
            id(photon): i for i, photon in enumerate(self.alice_photons)
            if photon.is_transmitted
        }
        
        for photon in self.bob_received_photons:
            original_idx = received_indices.get(id(photon))
            if original_idx is not None:
                measured_bit, _ = QuantumBasis.measure_photon(
                    photon.bit,
                    photon.preparation_basis,
                    self.bob_bases[original_idx]
                )
                self.bob_bits[original_idx] = measured_bit
    
    def _basis_reconciliation(self):
        """Step 5: Alice and Bob compare bases and keep matching bits"""
        self.matching_indices = []
        self.sifted_key = []
        
        for i in range(self.num_bits):
            # Only keep bits where bases matched AND photon was received
            if (self.bob_bits[i] is not None and 
                self.alice_bases[i] == self.bob_bases[i]):
                self.matching_indices.append(i)
                self.sifted_key.append(self.bob_bits[i])
    
    def _error_testing(self):
        """Step 6: Test for errors and calculate QBER"""
        # Test using only the sifted key (matching bases where photon received)
        alice_sifted = [self.alice_bits[i] for i in self.matching_indices]
        bob_sifted = [self.bob_bits[i] for i in self.matching_indices]
        
        # Calculate QBER on sifted key
        qber, tested_indices_in_sifted, errors, total_tested = calculate_qber(
            alice_sifted,
            bob_sifted,
            list(range(len(self.matching_indices)))  # All indices in sifted key
        )
        
        # Map back to original indices
        tested_indices_original = [self.matching_indices[i] for i in tested_indices_in_sifted]
        
        # Security assessment
        if qber < 5.0:
            security_level = "SECURE"
            assessment = "Normal atmospheric noise levels"
        elif qber < 11.0:
            security_level = "ACCEPTABLE"
            assessment = "Slightly elevated error rate, within acceptable bounds"
        elif qber < 15.0:
            security_level = "SUSPICIOUS"
            assessment = "High error rate detected - possible eavesdropping"
        else:
            security_level = "ABORT"
            assessment = "CRITICAL: Error rate too high - eavesdropper detected!"
        
        basis_match_rate = (len(self.matching_indices) / self.num_bits * 100) if self.num_bits > 0 else 0
        
        self.error_analysis = {
            "qber_percentage": round(qber, 2),
            "errors_detected": errors,
            "bits_tested": total_tested,
            "tested_indices": tested_indices_original,
            "matching_bases_count": len(self.matching_indices),
            "basis_match_rate": round(basis_match_rate, 2),
            "security_level": security_level,
            "assessment": assessment,
            "eve_active": self.eve_active,
            "safe_to_use_key": qber < 11.0
        }
        
        self.qber = qber
    
    def _privacy_amplification(self):
        """Step 7: Apply privacy amplification to get final secure key"""
        # tested_indices are now in original bit positions
        # Convert to sifted key positions
        tested_original_set = set(self.error_analysis.get("tested_indices", []))
        
        # Get Alice's and Bob's untested bits
        alice_untested = [
            self.alice_bits[self.matching_indices[i]]
            for i in range(len(self.sifted_key))
            if self.matching_indices[i] not in tested_original_set
        ]
        
        bob_untested = [
            self.sifted_key[i]
            for i in range(len(self.sifted_key))
            if self.matching_indices[i] not in tested_original_set
        ]
        
        # Error correction: Bob corrects his bits to match Alice
        # In real QKD, this uses Cascade or LDPC protocols over public channel
        # Here we simulate by directly correcting to match
        corrected_key = alice_untested  # Use Alice's bits as ground truth
        
        # Apply privacy amplification to corrected key
        self.final_key = apply_privacy_amplification(corrected_key, self.qber)
    
    def _generate_trace(self) -> dict:
        """Generate complete protocol trace for frontend visualization"""
        return {
            # Original data
            "alice_bits": self.alice_bits,
            "alice_bases": [b.value for b in self.alice_bases],
            "bob_bases": [b.value for b in self.bob_bases],
            "bob_bits": [b if b is not None else None for b in self.bob_bits],
            
            # Matching information
            "matching_indices": self.matching_indices,
            "matches": [
                self.alice_bases[i] == self.bob_bases[i]
                for i in range(self.num_bits)
            ],
            
            # Keys
            "sifted_key": self.sifted_key,
            "final_key": self.final_key,
            "final_key_length": len(self.final_key),
            "final_key_hex": self._bits_to_hex(self.final_key),
            
            # Statistics
            "total_bits_sent": self.num_bits,
            "photons_received": len(self.bob_received_photons),
            "transmission_efficiency": round(
                (len(self.bob_received_photons) / self.num_bits * 100), 2
            ),
            "basis_match_rate": round(
                (len(self.matching_indices) / self.num_bits * 100), 2
            ),
            "key_efficiency": round(
                (len(self.final_key) / self.num_bits * 100), 2
            ),
            
            # Error analysis
            "qber": self.qber,
            "error_analysis": self.error_analysis,
            
            # Channel info
            "channel_stats": self.atmosphere.get_channel_stats(),
            
            # Eve information
            "eve_active": self.eve_active,
            "eve_stats": self.eve_stats if self.eve_active else None,
            
            # Security
            "secure": self.error_analysis.get("safe_to_use_key", False),
            "security_level": self.error_analysis.get("security_level", "UNKNOWN")
        }
    
    @staticmethod
    def _bits_to_hex(bits: List[int]) -> str:
        """Convert bit list to hexadecimal string"""
        if not bits:
            return ""
        
        # Pad to multiple of 4
        padded = bits + [0] * (4 - len(bits) % 4) if len(bits) % 4 != 0 else bits
        
        hex_str = ""
        for i in range(0, len(padded), 4):
            nibble = padded[i:i+4]
            value = sum(bit << (3 - j) for j, bit in enumerate(nibble))
            hex_str += format(value, 'x')
        
        return hex_str
