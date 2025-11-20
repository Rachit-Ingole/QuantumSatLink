'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Lightbulb, Shield, Radio } from 'lucide-react';

export default function Manual() {
  return (
    <div className="min-h-screen bg-slate-900">
      
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Simulator
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                User Manual
              </h1>
              <p className="text-sm text-slate-400">
                Complete guide to the QKD Simulator
              </p>
            </div>
          </div>
        </div>
      </header>

      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">What is Quantum Key Distribution?</h2>
            </div>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong>Quantum Key Distribution (QKD)</strong> is a secure communication method that uses quantum mechanics 
                to exchange cryptographic keys between two parties. Unlike traditional encryption methods that rely on 
                mathematical complexity, QKD provides security based on the fundamental laws of physics.
              </p>
              <p>
                <strong>The Problem It Solves:</strong> Traditional key exchange methods (like RSA) could theoretically be 
                broken by quantum computers. QKD provides information-theoretic security - meaning even with unlimited 
                computing power, an eavesdropper cannot break the encryption without being detected.
              </p>
              <p>
                <strong>How It Works:</strong> QKD uses individual photons (light particles) to transmit information. 
                The key principle is that measuring a quantum system disturbs it. If an eavesdropper (Eve) tries to 
                intercept and measure the photons, this disturbance is detectable by the legitimate parties 
                (Alice and Bob), who can then discard the compromised key and try again.
              </p>
              <p>
                This simulator demonstrates satellite-based QKD using the BB84 protocol, where a satellite transmits 
                quantum-encoded photons to a ground station. The system includes realistic atmospheric effects, 
                various eavesdropping attack simulations, and shows how quantum principles guarantee secure communication.
              </p>
            </div>
          </section>

          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Getting Started</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 1: Configure Parameters</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li><strong>Distance:</strong> Set the satellite distance (200-2000 km). Higher distances increase photon loss.</li>
                  <li><strong>Photon Count:</strong> Choose how many photons to send (64-512 bits). More photons yield longer keys.</li>
                  <li><strong>Eavesdropper Toggle:</strong> Enable Eve to simulate an intercept-resend attack.</li>
                  <li><strong>Interception Rate:</strong> If Eve is active, set how many photons she intercepts (0-100%).</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 2: Generate Key</h3>
                <p className="text-slate-300">
                  Click the "Generate Quantum Key" button to start the simulation. Watch the 3D visualization 
                  as photons travel from the satellite to Earth.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 3: Analyze Results</h3>
                <p className="text-slate-300">
                  After generation completes, review the Alice/Bob panels, basis matching statistics, 
                  and QBER (Quantum Bit Error Rate) to assess key security.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Step 4: Use the Key</h3>
                <p className="text-slate-300">
                  Copy the generated quantum key and use it in the encryption demo to encrypt/decrypt 
                  messages with AES-256-CBC encryption.
                </p>
              </div>
            </div>
          </section>

          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">BB84 Protocol Explained</h2>
            </div>
            <div className="space-y-4">
              <p className="text-slate-300">
                <strong>BB84 (Bennett-Brassard 1984)</strong> is the first and most widely studied QKD protocol. 
                It uses photon polarization to encode bits and relies on two key quantum principles:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4 mb-4">
                <li><strong>Heisenberg Uncertainty Principle:</strong> You cannot measure a quantum system without disturbing it</li>
                <li><strong>No-Cloning Theorem:</strong> You cannot create an identical copy of an unknown quantum state</li>
              </ul>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">1. Alice Prepares Photons</h3>
                <p className="text-slate-300">
                  Alice randomly selects bits (0 or 1) and measurement bases for each photon. The two bases are:
                  <br/>• <strong>Rectilinear (+):</strong> Horizontal (0) or Vertical (1) polarization
                  <br/>• <strong>Diagonal (×):</strong> 45° (0) or 135° (1) polarization
                  <br/>She then sends these quantum-encoded photons through the satellite-to-ground channel.
                </p>
              </div>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">2. Atmospheric Transmission</h3>
                <p className="text-slate-300">
                  Photons travel through space with losses due to atmospheric absorption, 
                  beam divergence, and distance. Some photons may be lost naturally.
                </p>
              </div>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">3. Eve Intercepts (Optional)</h3>
                <p className="text-slate-300">
                  If Eve tries to eavesdrop, she must measure the photons to learn the bits. However, she doesn't 
                  know which basis Alice used, so she guesses randomly. When Eve measures in the wrong basis:
                  <br/>• The photon's quantum state collapses incorrectly
                  <br/>• When she resends it, the photon no longer matches Alice's original encoding
                  <br/>• This creates detectable errors (~25% error rate for intercept-resend attacks)
                  <br/>This demonstrates the security of QKD: eavesdropping is physically detectable.
                </p>
              </div>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">4. Bob Measures</h3>
                <p className="text-slate-300">
                  Bob also randomly chooses a measurement basis for each photon (+ or ×). When Bob's basis matches 
                  Alice's basis, he correctly measures the bit value. When the bases don't match, his measurement 
                  result is random (50% chance of being correct). This basis mismatch is expected and not a security concern.
                </p>
              </div>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">5. Basis Reconciliation (Sifting)</h3>
                <p className="text-slate-300">
                  Alice and Bob communicate over a public channel to compare which bases they used (but NOT the bit values).
                  They keep only the bits where both used the same basis - this is called the "sifted key". 
                  Approximately 50% of bits survive this step. This public communication is safe because the bases 
                  themselves reveal nothing about the actual bit values.
                </p>
              </div>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">6. Error Testing (QBER)</h3>
                <p className="text-slate-300">
                  Alice and Bob sacrifice a random subset of their sifted key to check for errors. They publicly 
                  compare these test bits. The <strong>Quantum Bit Error Rate (QBER)</strong> is calculated:
                  <br/>• <strong>Low QBER (0-11%):</strong> Normal channel noise - the key is secure
                  <br/>• <strong>High QBER (&gt;15%):</strong> Possible eavesdropping detected - abort and retry
                  <br/>This step is crucial: it's how QKD detects Eve's presence through quantum disturbance.
                </p>
              </div>

              <div className="border-l-4 border-slate-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-1">7. Privacy Amplification</h3>
                <p className="text-slate-300">
                  Even if Eve gained partial information during the protocol, Alice and Bob can remove it by 
                  applying a hash function to compress the key. The amount of compression depends on the QBER:
                  higher error rates require more compression. The final key is provably secure - Eve has 
                  negligible information about it, guaranteed by quantum mechanics.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Why QKD is Unbreakable</h2>
            </div>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong>1. Physics-Based Security:</strong> Unlike RSA or AES which rely on mathematical hardness 
                (that could be broken by future algorithms or quantum computers), QKD's security comes from 
                quantum mechanics itself. The laws of physics prevent perfect eavesdropping.
              </p>
              <p>
                <strong>2. Eavesdropper Detection:</strong> Traditional encryption can be broken silently - you never 
                know if someone is recording your communications. With QKD, any eavesdropping attempt creates 
                measurable disturbances that alert the legitimate parties in real-time.
              </p>
              <p>
                <strong>3. Information-Theoretic Security:</strong> Even with infinite computing power and time, 
                an eavesdropper cannot extract information from the quantum channel without being detected. 
                This is provably secure, not just computationally hard.
              </p>
              <p>
                <strong>4. Future-Proof:</strong> Quantum computers will break RSA and many current encryption schemes. 
                QKD remains secure even against quantum computers because it's already based on quantum principles.
              </p>
            </div>
          </section>

          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Radio className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Real-World QKD Applications</h2>
            </div>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong>Satellite Networks:</strong> China's Micius satellite demonstrated intercontinental QKD in 2017, 
                enabling secure communication between Beijing and Vienna over 7,600 km.
              </p>
              <p>
                <strong>Government & Military:</strong> Governments worldwide are deploying QKD networks for securing 
                classified communications. The quantum-safe keys protect data against future quantum computer attacks.
              </p>
              <p>
                <strong>Financial Sector:</strong> Banks are piloting QKD for securing high-value transactions and 
                protecting sensitive financial data against long-term security threats.
              </p>
              <p>
                <strong>Critical Infrastructure:</strong> Power grids, telecommunications, and data centers are exploring 
                QKD to protect control systems from sophisticated cyber attacks.
              </p>
            </div>
          </section>

          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Simulator Features</h2>
            </div>
            <div className="space-y-3 text-slate-300">
              <p>
                This simulator models realistic QKD conditions:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Atmospheric Effects:</strong> Distance-dependent photon loss, beam divergence, and turbulence</li>
                <li><strong>Weather Conditions:</strong> Clear sky, haze, clouds, and rain affect transmission quality</li>
                <li><strong>Time of Day:</strong> Daytime solar background noise vs optimal nighttime conditions</li>
                <li><strong>Multiple Attack Types:</strong> Intercept-resend, beam splitting, photon number splitting, detector blinding, and jamming</li>
                <li><strong>Hardware Parameters:</strong> Telescope aperture size affects photon collection efficiency</li>
                <li><strong>Complete Protocol:</strong> Full BB84 implementation with error correction and privacy amplification</li>
              </ul>
            </div>
          </section>

          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Understanding Metrics</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">QBER (Quantum Bit Error Rate)</h3>
                <p className="text-slate-300 mb-2">
                  The percentage of bits that differ between Alice and Bob in matching bases.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-300 ml-4">
                  <li><strong className="text-slate-200">0-11%:</strong> Secure - Normal channel noise only</li>
                  <li><strong className="text-slate-200">11-15%:</strong> Suspicious - Possible eavesdropping</li>
                  <li><strong className="text-slate-200">&gt;15%:</strong> Insecure - Key should be discarded</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Transmission Efficiency</h3>
                <p className="text-slate-300">
                  The percentage of photons that successfully reach Bob. Affected by distance 
                  and atmospheric conditions. Typical ranges: 30-80%.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Basis Match Rate</h3>
                <p className="text-slate-300">
                  The percentage of bits where Alice and Bob randomly chose the same measurement 
                  basis. Theoretically 50%, but varies due to randomness.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Key Efficiency</h3>
                <p className="text-slate-300">
                  The percentage of sent photons that result in final key bits. Accounts for 
                  transmission losses, basis mismatches, and error testing overhead.
                </p>
              </div>
            </div>
          </section>

          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-slate-400" />
              <h2 className="text-2xl font-bold text-white">Security Features</h2>
            </div>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong>Quantum Security:</strong> The no-cloning theorem prevents Eve from copying 
                quantum states without disturbing them, making her presence detectable.
              </p>
              <p>
                <strong>Eavesdropping Detection:</strong> When Eve measures photons, she must guess 
                the basis. Wrong guesses create errors that increase QBER, alerting Alice and Bob.
              </p>
              <p>
                <strong>Information-Theoretic Security:</strong> Even with unlimited computational 
                power, Eve cannot break the security if QBER is below the threshold.
              </p>
              <p>
                <strong>Privacy Amplification:</strong> Hashing the sifted key removes any partial 
                information Eve might have gained, ensuring the final key is secure.
              </p>
            </div>
          </section>

          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Backend Connection Error</h3>
                <p className="text-slate-300 mb-2">
                  Make sure the FastAPI backend is running on port 8000:
                </p>
                <code className="block bg-slate-800 p-3 rounded text-slate-300 text-sm">
                  cd backend && python main.py
                </code>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Key Too Short</h3>
                <p className="text-slate-300">
                  Increase photon count or reduce distance. High losses and Eve interception 
                  reduce final key length significantly.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">High QBER Warning</h3>
                <p className="text-slate-300">
                  This is expected when Eve is active with high interception rate. In real systems, 
                  the protocol would abort and try again on a different channel.
                </p>
              </div>
            </div>
          </section>

          
          <section className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Technical Implementation</h2>
            <div className="space-y-3 text-slate-300">
              <p>
                <strong>Backend:</strong> FastAPI with NumPy for quantum simulation and 
                Pycryptodome for AES-256-CBC encryption.
              </p>
              <p>
                <strong>Frontend:</strong> Next.js 15 with React Three Fiber for 3D visualization, 
                Framer Motion for animations, and Tailwind CSS for styling.
              </p>
              <p>
                <strong>Quantum Simulation:</strong> Uses probabilistic models for photon 
                transmission, basis-dependent measurement outcomes, and atmospheric effects.
              </p>
              <p>
                <strong>Encryption:</strong> The quantum key is used with AES-256-CBC to demonstrate 
                practical applications of the generated cryptographic material.
              </p>
            </div>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
