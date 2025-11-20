"""
Eve attack type simulations.
Different eavesdropping strategies with unique signatures.
"""
import random
from typing import List, Optional, Tuple

class EveAttackType:
    """Different types of Eve attacks with unique characteristics."""
    
    INTERCEPT_RESEND = "intercept_resend"
    BEAM_SPLITTING = "beam_splitting"
    PHOTON_NUMBER_SPLITTING = "photon_number_splitting"
    DETECTOR_BLINDING = "detector_blinding"
    JAMMED_LINK = "jammed_link"

def apply_intercept_resend_attack(
    photon_states: List[Optional[int]],
    bases: List[str],
    interception_rate: float
) -> Tuple[List[Optional[int]], dict]:
    """
    Classic intercept-resend: Eve measures and resends.
    High QBER (25%), moderate loss.
    """
    intercepted = 0
    errors_introduced = 0
    
    result = []
    for i, photon in enumerate(photon_states):
        if photon is None:
            result.append(None)
            continue
            
        if random.random() < interception_rate:
            intercepted += 1
            # Eve guesses basis randomly
            eve_basis = random.choice(['+', 'x'])
            
            if eve_basis != bases[i]:
                # Wrong basis = 50% chance of error when resent
                if random.random() < 0.5:
                    result.append(1 - photon)
                    errors_introduced += 1
                else:
                    result.append(photon)
            else:
                result.append(photon)
        else:
            result.append(photon)
    
    return result, {
        "attack_type": "Intercept-Resend",
        "photons_intercepted": intercepted,
        "errors_introduced": errors_introduced,
        "expected_qber": "25-30%",
        "detection_difficulty": "Easy"
    }

def apply_beam_splitting_attack(
    photon_states: List[Optional[int]],
    tap_rate: float = 0.3
) -> Tuple[List[Optional[int]], dict]:
    """
    Beam-splitting: Eve taps some photons passively.
    Lower QBER (5-10%), higher loss.
    """
    tapped = 0
    
    result = []
    for photon in photon_states:
        if photon is None:
            result.append(None)
            continue
            
        if random.random() < tap_rate:
            # Eve takes the photon, Bob doesn't receive it
            result.append(None)
            tapped += 1
        else:
            result.append(photon)
    
    return result, {
        "attack_type": "Beam-Splitting",
        "photons_tapped": tapped,
        "errors_introduced": 0,
        "expected_qber": "5-10% (normal + small increase)",
        "detection_difficulty": "Hard - looks like normal loss"
    }

def apply_pns_attack(
    photon_states: List[Optional[int]],
    bases: List[str],
    multi_photon_rate: float = 0.15
) -> Tuple[List[Optional[int]], dict]:
    """
    Photon Number Splitting: Eve exploits multi-photon pulses.
    Very low QBER (<5%), some loss.
    """
    exploited = 0
    errors = 0
    
    result = []
    for i, photon in enumerate(photon_states):
        if photon is None:
            result.append(None)
            continue
            
        # Some pulses have multiple photons
        if random.random() < multi_photon_rate:
            # Eve can split off one photon and measure it
            exploited += 1
            eve_basis = random.choice(['+', 'x'])
            
            if eve_basis != bases[i]:
                # Wrong basis, but Bob still gets his photon correctly
                # Very low error rate
                if random.random() < 0.1:
                    result.append(1 - photon)
                    errors += 1
                else:
                    result.append(photon)
            else:
                result.append(photon)
        else:
            result.append(photon)
    
    return result, {
        "attack_type": "Photon Number Splitting (PNS)",
        "multi_photon_pulses_exploited": exploited,
        "errors_introduced": errors,
        "expected_qber": "3-7% (very stealthy)",
        "detection_difficulty": "Very Hard"
    }

def apply_detector_blinding_attack(
    photon_states: List[Optional[int]],
    bases: List[str],
    blind_rate: float = 0.4
) -> Tuple[List[Optional[int]], dict]:
    """
    Detector Blinding: Eve blinds Bob's detectors with bright light.
    Then sends fake signals. Moderate QBER (15%), moderate loss.
    """
    blinded_detections = 0
    fake_signals = 0
    
    result = []
    for i, photon in enumerate(photon_states):
        if photon is None:
            result.append(None)
            continue
            
        if random.random() < blind_rate:
            # Detector is blinded, Eve sends fake signal
            blinded_detections += 1
            fake_bit = random.randint(0, 1)
            result.append(fake_bit)
            fake_signals += 1
        else:
            result.append(photon)
    
    return result, {
        "attack_type": "Detector Blinding",
        "detectors_blinded": blinded_detections,
        "fake_signals_sent": fake_signals,
        "expected_qber": "15-20%",
        "detection_difficulty": "Medium - unusual detector behavior"
    }

def apply_jammed_link_attack(
    photon_states: List[Optional[int]]
) -> Tuple[List[Optional[int]], dict]:
    """
    Jammed Link: Eve floods the channel with noise.
    Very high QBER (>40%), extreme loss.
    Denial of service attack.
    """
    noise_photons = 0
    
    result = []
    for photon in photon_states:
        if photon is None:
            result.append(None)
            continue
            
        # 60% chance photon is lost in noise
        if random.random() < 0.6:
            result.append(None)
            noise_photons += 1
        else:
            # Remaining photons have 50% error rate
            if random.random() < 0.5:
                result.append(1 - photon if photon is not None else None)
            else:
                result.append(photon)
    
    return result, {
        "attack_type": "Jammed Link (DoS)",
        "photons_lost_to_jamming": noise_photons,
        "errors_introduced": "High",
        "expected_qber": ">40% (obvious attack)",
        "detection_difficulty": "Trivial - QKD will abort"
    }

def apply_eve_attack(
    photon_states: List[Optional[int]],
    bases: List[str],
    attack_type: str,
    intensity: float = 0.5
) -> Tuple[List[Optional[int]], dict]:
    """
    Apply the specified Eve attack type.
    
    Args:
        photon_states: List of photon states
        bases: List of bases used
        attack_type: Type of attack to apply
        intensity: Attack intensity (0.0-1.0)
        
    Returns:
        Tuple of (modified photons, attack statistics)
    """
    if attack_type == EveAttackType.INTERCEPT_RESEND:
        return apply_intercept_resend_attack(photon_states, bases, intensity)
    elif attack_type == EveAttackType.BEAM_SPLITTING:
        return apply_beam_splitting_attack(photon_states, intensity * 0.6)
    elif attack_type == EveAttackType.PHOTON_NUMBER_SPLITTING:
        return apply_pns_attack(photon_states, bases, 0.15)
    elif attack_type == EveAttackType.DETECTOR_BLINDING:
        return apply_detector_blinding_attack(photon_states, bases, intensity * 0.8)
    elif attack_type == EveAttackType.JAMMED_LINK:
        return apply_jammed_link_attack(photon_states)
    else:
        # Default to intercept-resend
        return apply_intercept_resend_attack(photon_states, bases, intensity)
