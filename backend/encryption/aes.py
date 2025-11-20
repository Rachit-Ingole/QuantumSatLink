"""
AES Encryption using Quantum Key
Demonstrates secure message encryption with BB84-generated key
"""

from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad, unpad
import hashlib
import base64
from typing import Tuple


def derive_aes_key(quantum_bits: list[int], key_size: int = 32) -> bytes:
    """
    Derive AES key from quantum bit sequence
    
    Args:
        quantum_bits: List of bits from QKD protocol
        key_size: AES key size in bytes (16=AES-128, 24=AES-192, 32=AES-256)
    
    Returns:
        AES key as bytes
    """
    # Convert bits to bytes
    bit_string = ''.join(str(bit) for bit in quantum_bits)
    
    # If we don't have enough bits, pad with zeros
    if len(bit_string) < key_size * 8:
        bit_string = bit_string.ljust(key_size * 8, '0')
    
    # Convert to bytes
    byte_array = bytearray()
    for i in range(0, len(bit_string), 8):
        byte = bit_string[i:i+8]
        byte_array.append(int(byte, 2))
    
    # Use SHA-256 to derive a fixed-size key
    key_bytes = bytes(byte_array[:key_size])
    derived_key = hashlib.sha256(key_bytes).digest()[:key_size]
    
    return derived_key


def encrypt_message(message: str, quantum_key: list[int]) -> Tuple[str, str, str]:
    """
    Encrypt a message using AES with quantum-generated key
    
    Args:
        message: Plaintext message to encrypt
        quantum_key: Bit sequence from QKD protocol
    
    Returns:
        (ciphertext_b64, iv_b64, key_hex):
        - ciphertext_b64: Encrypted message (base64)
        - iv_b64: Initialization vector (base64)
        - key_hex: AES key used (hex, for display)
    """
    # Derive AES key from quantum bits
    aes_key = derive_aes_key(quantum_key, key_size=32)  # AES-256
    
    # Generate random IV
    iv = get_random_bytes(16)
    
    # Create cipher
    cipher = AES.new(aes_key, AES.MODE_CBC, iv)
    
    # Encrypt message
    plaintext_bytes = message.encode('utf-8')
    padded_plaintext = pad(plaintext_bytes, AES.block_size)
    ciphertext = cipher.encrypt(padded_plaintext)
    
    # Convert to base64 for transport
    ciphertext_b64 = base64.b64encode(ciphertext).decode('utf-8')
    iv_b64 = base64.b64encode(iv).decode('utf-8')
    key_hex = aes_key.hex()
    
    return ciphertext_b64, iv_b64, key_hex


def decrypt_message(ciphertext_b64: str, iv_b64: str, quantum_key: list[int]) -> str:
    """
    Decrypt a message using AES with quantum-generated key
    
    Args:
        ciphertext_b64: Encrypted message (base64)
        iv_b64: Initialization vector (base64)
        quantum_key: Bit sequence from QKD protocol
    
    Returns:
        Decrypted plaintext message
    """
    # Derive same AES key from quantum bits
    aes_key = derive_aes_key(quantum_key, key_size=32)
    
    # Decode base64
    ciphertext = base64.b64decode(ciphertext_b64)
    iv = base64.b64decode(iv_b64)
    
    # Create cipher
    cipher = AES.new(aes_key, AES.MODE_CBC, iv)
    
    # Decrypt
    padded_plaintext = cipher.decrypt(ciphertext)
    plaintext_bytes = unpad(padded_plaintext, AES.block_size)
    plaintext = plaintext_bytes.decode('utf-8')
    
    return plaintext


def get_encryption_info(quantum_key: list[int]) -> dict:
    """
    Get information about the encryption setup
    
    Returns:
        Dictionary with encryption parameters
    """
    aes_key = derive_aes_key(quantum_key, key_size=32)
    
    return {
        "algorithm": "AES-256-CBC",
        "key_size_bits": 256,
        "key_size_bytes": 32,
        "block_size": 16,
        "mode": "CBC",
        "key_hex": aes_key.hex(),
        "key_source": "BB84 QKD Protocol",
        "quantum_bits_used": len(quantum_key)
    }
