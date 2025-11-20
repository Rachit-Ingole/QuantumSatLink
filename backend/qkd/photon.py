"""
Photon State Implementation
Represents quantum photon states in BB84
"""

from dataclasses import dataclass
from enum import Enum
from .basis import BasisType


class PhotonState(Enum):
    """Photon polarization states"""
    # Rectilinear basis
    HORIZONTAL = "H"    # |0⟩ - bit 0
    VERTICAL = "V"      # |1⟩ - bit 1
    
    # Diagonal basis
    DIAGONAL_45 = "+"   # |+⟩ - bit 0
    DIAGONAL_135 = "-"  # |-⟩ - bit 1


@dataclass
class Photon:
    """
    Represents a quantum photon with polarization state
    """
    bit: int                    # 0 or 1
    preparation_basis: BasisType  # Basis used to prepare the photon
    state: PhotonState          # Polarization state
    is_transmitted: bool = True  # Whether photon survived atmospheric loss
    is_intercepted: bool = False # Whether Eve intercepted this photon
    
    @staticmethod
    def create(bit: int, basis: BasisType) -> 'Photon':
        """
        Create a photon by encoding a bit in a specific basis
        
        Args:
            bit: 0 or 1
            basis: Measurement basis (+ or ×)
        
        Returns:
            Photon with appropriate polarization state
        """
        if basis == BasisType.RECTILINEAR:
            state = PhotonState.HORIZONTAL if bit == 0 else PhotonState.VERTICAL
        else:  # DIAGONAL
            state = PhotonState.DIAGONAL_45 if bit == 0 else PhotonState.DIAGONAL_135
        
        return Photon(
            bit=bit,
            preparation_basis=basis,
            state=state,
            is_transmitted=True,
            is_intercepted=False
        )
    
    def __repr__(self) -> str:
        return (f"Photon(bit={self.bit}, basis={self.preparation_basis.value}, "
                f"state={self.state.value}, transmitted={self.is_transmitted}, "
                f"intercepted={self.is_intercepted})")
