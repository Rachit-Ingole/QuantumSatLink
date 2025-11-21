# Q-SatLink: Quantum-Secure Satellite Communication Simulator

Q-SatLink is an interactive simulator that demonstrates how satellites can achieve **quantum-secure communication** using **Quantum Key Distribution (QKD)**. The project implements the **BB84 protocol** to show how single photons, random polarization bases, and QBER analysis create a shared secret key that cannot be intercepted without detection.

Built with a 3D Earth–Satellite visualization, the simulator models **realistic space-channel conditions** such as atmospheric scattering, cloud cover, beam divergence, distance attenuation, and environmental noise. Users can tweak these factors and observe how they affect photon transmission, base matching, QBER, and final key generation.

The system includes an **eavesdropper (Eve) mode**, where intercepting photons causes measurable disturbances and a visible QBER spike. Once a secure key is established, Q-SatLink uses it for **AES-256 encryption and decryption**, completing a full end-to-end secure communication pipeline.

---

## Features

- **BB84 Quantum Key Distribution**
- **QBER-based eavesdropper detection**
- **AES-256 encryption with quantum-generated keys**
- **3D Earth, satellite, and ground station visualization**
- **Realistic space conditions:**
  - Cloud cover  
  - Atmospheric scattering  
  - Beam divergence  
  - Distance & photon count  
- **Live photon animation & basis matching**
- **Interactive simulation controls**

---

## Why This Project?

Classical encryption algorithms like RSA will be vulnerable to future quantum computers.  
Satellites operate for years and need encryption that remains secure long-term.  
Q-SatLink demonstrates how **quantum physics provides unbreakable security**, making it ideal for next-generation satellite communication.

---

## Tech Stack

**Frontend:** Next.js, React Three Fiber, Drei, Tailwind CSS  
**Backend:** FastAPI (Python)  
**Cryptography:** AES-256 (cryptography library)  
**Visualization:** Real-time photon & laser link simulation  

---

## Live Demo

[https://quantum-sat-link.vercel.app/](https://quantum-sat-link.vercel.app/)

---

## How It Works

1. Satellite sends photons encoded using random bases (BB84 protocol).  
2. Ground station measures using its own random bases.  
3. They publicly compare bases and keep only matching positions.  
4. A small sample of bits is revealed to compute QBER.  
5. High QBER → eavesdropper detected (key discarded).  
6. Low QBER → secure quantum key generated.  
7. Key is used for **AES-256 encryption and decryption**.

---

## Future Enhancements

- Decoy-state BB84  
- Real satellite TLE orbital data  
- Advanced eavesdropper attack models  
- Error correction & privacy amplification  
- Multi-satellite & multi-ground-station support  

---

## Credits

Developed by **Rachit Ingole - Team: PhotonPilot**  
**Made for SKYHACKS:2025**
