"""
Quantum Basis Implementation
Rectilinear (+) and Diagonal (×) bases for BB84
"""

from enum import Enum
from typing import Tuple
import random


class BasisType(Enum):
    """Quantum measurement bases"""
    RECTILINEAR = "+"  # 0°/90° (|0⟩, |1⟩)
    DIAGONAL = "×"     # 45°/135° (|+⟩, |-⟩)


class QuantumBasis:
    """Handles quantum basis selection and measurement"""
    
    @staticmethod
    def random_basis() -> BasisType:
        """Generate a random measurement basis"""
        return random.choice([BasisType.RECTILINEAR, BasisType.DIAGONAL])
    
    @staticmethod
    def generate_random_bases(count: int) -> list[BasisType]:
        """Generate a list of random bases"""
        return [QuantumBasis.random_basis() for _ in range(count)]
    
    @staticmethod
    def bases_match(basis1: BasisType, basis2: BasisType) -> bool:
        """Check if two bases are the same"""
        return basis1 == basis2
    
    @staticmethod
    def measure_photon(bit: int, preparation_basis: BasisType, 
                      measurement_basis: BasisType) -> Tuple[int, bool]:
        """
        Measure a photon in a given basis
        
        Returns:
            (measured_bit, is_correct): 
            - measured_bit: 0 or 1
            - is_correct: True if bases match (deterministic), 
                         False if bases don't match (50% random)
        """
        if preparation_basis == measurement_basis:
            # Bases match: measurement is mostly deterministic, but with natural errors
            # Error sources:
            # - Detector dark counts: ~0.5%
            # - Timing jitter: ~0.3%
            # Note: Atmospheric errors are handled in transmission, not here
            detector_error = 0.008  # 0.8% detector error
            
            if random.random() < detector_error:
                measured_bit = 1 - bit  # Flip the bit
            else:
                measured_bit = bit
            return measured_bit, True
        else:
            # Bases don't match: measurement is random (50/50)
            measured_bit = random.choice([0, 1])
            return measured_bit, False
    
    @staticmethod
    def to_string(basis: BasisType) -> str:
        """Convert basis to string representation"""
        return basis.value
    
    @staticmethod
    def from_string(basis_str: str) -> BasisType:
        """Convert string to basis type"""
        if basis_str == "+":
            return BasisType.RECTILINEAR
        elif basis_str == "×":
            return BasisType.DIAGONAL
        else:
            raise ValueError(f"Invalid basis string: {basis_str}")
