"""
Quantum Key Distribution (QKD) Core Module
BB84 Protocol Implementation
"""

from .bb84 import BB84Protocol
from .photon import Photon, PhotonState
from .basis import QuantumBasis, BasisType
from .eve import EveAttack
from .atmosphere import AtmosphericChannel
from .qber import calculate_qber, analyze_errors

__all__ = [
    'BB84Protocol',
    'Photon',
    'PhotonState',
    'QuantumBasis',
    'BasisType',
    'EveAttack',
    'AtmosphericChannel',
    'calculate_qber',
    'analyze_errors'
]
