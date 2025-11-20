/**
 * Utility functions for the QKD Simulator
 */

/**
 * Format a number array as binary string
 */
export function formatBits(bits: number[]): string {
  return bits.join('');
}

/**
 * Format a number array as hex string
 */
export function bitsToHex(bits: number[]): string {
  if (!bits || bits.length === 0) return '';
  
  // Pad to multiple of 4
  const padded = [...bits];
  while (padded.length % 4 !== 0) {
    padded.push(0);
  }
  
  let hex = '';
  for (let i = 0; i < padded.length; i += 4) {
    const nibble = padded.slice(i, i + 4);
    const value = nibble.reduce((acc, bit, idx) => acc + (bit << (3 - idx)), 0);
    hex += value.toString(16);
  }
  
  return hex;
}

/**
 * Get color based on QBER security level
 */
export function getQBERColor(qber: number): string {
  if (qber < 5) return '#10b981'; // green-500
  if (qber < 11) return '#f59e0b'; // amber-500
  if (qber < 15) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

/**
 * Get security level color
 */
export function getSecurityColor(level: string): string {
  switch (level) {
    case 'SECURE':
      return '#10b981'; // green
    case 'ACCEPTABLE':
      return '#f59e0b'; // amber
    case 'SUSPICIOUS':
      return '#f97316'; // orange
    case 'ABORT':
      return '#ef4444'; // red
    default:
      return '#6b7280'; // gray
  }
}

/**
 * Get basis color for visualization
 */
export function getBasisColor(basis: string): string {
  return basis === '+' ? '#3b82f6' : '#8b5cf6'; // blue : purple
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Download text as file
 */
export function downloadAsFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Calculate satellite position in orbit
 */
export function calculateSatellitePosition(
  time: number,
  radius: number = 8,
  speed: number = 1
): [number, number, number] {
  const angle = time * speed;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * 0.5;
  const z = Math.sin(angle) * radius;
  return [x, y, z];
}

/**
 * Interpolate between two colors
 */
export function interpolateColor(
  color1: string,
  color2: string,
  factor: number
): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate random color
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}
