"""
Quantum Bit Error Rate (QBER) Calculation
Analyzes errors in the quantum channel
"""

from typing import List, Tuple


def calculate_qber(
    alice_bits: List[int],
    bob_bits: List[int],
    matching_indices: List[int],
    test_sample_size: int = None
) -> Tuple[float, List[int], int, int]:
    """
    Calculate Quantum Bit Error Rate (QBER)
    
    In BB84, after basis reconciliation:
    1. Alice and Bob compare a random sample of bits
    2. They count how many bits differ
    3. QBER = (errors / total_tested) × 100%
    
    QBER Thresholds:
    - < 5%: Very secure, normal atmospheric noise
    - 5-11%: Acceptable, slight eavesdropping or noise
    - 11-15%: Suspicious, possible attack
    - > 15%: Abort protocol, definite eavesdropping
    
    Args:
        alice_bits: Alice's bit sequence
        bob_bits: Bob's bit sequence (after measurement)
        matching_indices: Indices where Alice and Bob used same basis
        test_sample_size: Number of bits to test (if None, use 30% of matching bits)
    
    Returns:
        (qber, tested_indices, errors, total_tested):
        - qber: Error rate as percentage
        - tested_indices: Which bits were tested
        - errors: Number of mismatched bits
        - total_tested: Total bits tested
    """
    import random
    
    if not matching_indices:
        return 0.0, [], 0, 0
    
    # Determine sample size (use 50% to get better error statistics)
    if test_sample_size is None:
        test_sample_size = max(10, len(matching_indices) // 2)  # At least 10 bits, or 50%
    
    test_sample_size = min(test_sample_size, len(matching_indices))
    
    # Randomly select bits for testing
    tested_indices = random.sample(matching_indices, test_sample_size)
    
    # Count errors
    errors = 0
    for idx in tested_indices:
        if alice_bits[idx] != bob_bits[idx]:
            errors += 1
    
    # Calculate QBER - ensure it's never exactly 0 in real systems
    # Even perfect systems have ~0.1% dark counts
    if errors == 0 and test_sample_size > 0:
        # Minimum realistic QBER from detector dark counts
        qber = 100.0 / test_sample_size  # At least 1 error equivalent
        if qber < 0.5:
            qber = 0.5  # Minimum 0.5% QBER
    else:
        qber = (errors / test_sample_size) * 100.0 if test_sample_size > 0 else 0.0
    
    return qber, tested_indices, errors, test_sample_size


def analyze_errors(
    alice_bits: List[int],
    bob_bits: List[int],
    alice_bases: List[str],
    bob_bases: List[str],
    eve_active: bool = False
) -> dict:
    """
    Comprehensive error analysis of the QKD session
    
    Returns:
        Detailed error statistics and security assessment
    """
    total_bits = len(alice_bits)
    
    # Find matching bases where Bob actually received the photon
    matching_indices = [
        i for i in range(total_bits)
        if alice_bases[i] == bob_bases[i] and bob_bits[i] not in (None, -1)
    ]
    
    # Calculate QBER only on successfully received, basis-matched bits
    qber, tested_indices, errors, total_tested = calculate_qber(
        alice_bits,
        bob_bits,
        matching_indices
    )
    
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
    
    # Calculate efficiency
    basis_match_rate = (len(matching_indices) / total_bits * 100) if total_bits > 0 else 0
    
    return {
        "qber_percentage": round(qber, 2),
        "errors_detected": errors,
        "bits_tested": total_tested,
        "tested_indices": tested_indices,
        "matching_bases_count": len(matching_indices),
        "basis_match_rate": round(basis_match_rate, 2),
        "security_level": security_level,
        "assessment": assessment,
        "eve_active": eve_active,
        "safe_to_use_key": qber < 11.0  # Standard BB84 threshold
    }


def apply_privacy_amplification(
    raw_key: List[int],
    qber: float
) -> List[int]:
    """
    Apply privacy amplification to reduce Eve's information
    
    In a real system, this uses universal hash functions.
    Here we simulate by shortening the key based on QBER.
    
    Args:
        raw_key: The sifted key after basis reconciliation
        qber: Quantum bit error rate
    
    Returns:
        Amplified key (shorter but more secure)
    """
    if qber < 5.0:
        # Low QBER: keep 90% of key
        shrink_factor = 0.9
    elif qber < 11.0:
        # Medium QBER: keep 70% of key
        shrink_factor = 0.7
    elif qber < 15.0:
        # High QBER: keep 50% of key
        shrink_factor = 0.5
    else:
        # Too high: abort (return empty)
        return []
    
    new_length = max(1, int(len(raw_key) * shrink_factor))
    return raw_key[:new_length]
