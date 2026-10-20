/**
 * Resistor color code decoding and reverse lookup utilities.
 */
import { ResistorColorBand } from '../types/electronics';

export const COLOR_TABLE: Record<string, ResistorColorBand> = {
  black: { name: '黑 (Black)', colorHex: '#18181b', textColor: '#ffffff', digit: 0, multiplier: 1 },
  brown: { name: '棕 (Brown)', colorHex: '#854d0e', textColor: '#ffffff', digit: 1, multiplier: 10, tolerance: 1 },
  red: { name: '红 (Red)', colorHex: '#dc2626', textColor: '#ffffff', digit: 2, multiplier: 100, tolerance: 2 },
  orange: { name: '橙 (Orange)', colorHex: '#ea580c', textColor: '#ffffff', digit: 3, multiplier: 1000 },
  yellow: { name: '黄 (Yellow)', colorHex: '#eab308', textColor: '#18181b', digit: 4, multiplier: 10000 },
  green: { name: '绿 (Green)', colorHex: '#16a34a', textColor: '#ffffff', digit: 5, multiplier: 100000, tolerance: 0.5 },
  blue: { name: '蓝 (Blue)', colorHex: '#2563eb', textColor: '#ffffff', digit: 6, multiplier: 1000000, tolerance: 0.25 },
  violet: { name: '紫 (Violet)', colorHex: '#9333ea', textColor: '#ffffff', digit: 7, multiplier: 10000000, tolerance: 0.1 },
  gray: { name: '灰 (Gray)', colorHex: '#64748b', textColor: '#ffffff', digit: 8, multiplier: 100000000, tolerance: 0.05 },
  white: { name: '白 (White)', colorHex: '#f8fafc', textColor: '#0f172a', digit: 9, multiplier: 1000000000 },
  gold: { name: '金 (Gold)', colorHex: '#d97706', textColor: '#ffffff', multiplier: 0.1, tolerance: 5 },
  silver: { name: '银 (Silver)', colorHex: '#94a3b8', textColor: '#0f172a', multiplier: 0.01, tolerance: 10 },
};

export const DIGIT_COLORS = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'];
export const MULTIPLIER_COLORS = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white', 'gold', 'silver'];
export const TOLERANCE_COLORS = ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver'];

// Standard E24 nominal series values
export const E24_SERIES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

/**
 * Decode 4-band resistor
 */
export function decode4Band(band1: string, band2: string, multiplier: string, tolerance: string) {
  const d1 = COLOR_TABLE[band1]?.digit ?? 0;
  const d2 = COLOR_TABLE[band2]?.digit ?? 0;
  const mult = COLOR_TABLE[multiplier]?.multiplier ?? 1;
  const tol = COLOR_TABLE[tolerance]?.tolerance ?? 5;

  const resistance = (d1 * 10 + d2) * mult;
  return {
    resistance,
    tolerance: tol,
  };
}

/**
 * Decode 5-band resistor
 */
export function decode5Band(band1: string, band2: string, band3: string, multiplier: string, tolerance: string) {
  const d1 = COLOR_TABLE[band1]?.digit ?? 0;
  const d2 = COLOR_TABLE[band2]?.digit ?? 0;
  const d3 = COLOR_TABLE[band3]?.digit ?? 0;
  const mult = COLOR_TABLE[multiplier]?.multiplier ?? 1;
  const tol = COLOR_TABLE[tolerance]?.tolerance ?? 1;

  const resistance = (d1 * 100 + d2 * 10 + d3) * mult;
  return {
    resistance,
    tolerance: tol,
  };
}

/**
 * Reverse lookup: Given a resistance in Ohms, find standard 4-band and 5-band colors.
 */
export function encodeResistanceToBands(ohms: number, is5Band: boolean = false, desiredTolerance: number = 5) {
  if (ohms <= 0 || isNaN(ohms) || !isFinite(ohms)) return null;

  // Find tolerance band
  const tolBand = TOLERANCE_COLORS.find(c => COLOR_TABLE[c].tolerance === desiredTolerance) || (is5Band ? 'brown' : 'gold');

  if (!is5Band) {
    // 4-band: 2 significant digits
    const exponent = Math.floor(Math.log10(ohms)) - 1;
    let base = Math.round(ohms / Math.pow(10, exponent));
    if (base >= 100) {
      base = 10;
      // adjust
    }
    const d1 = Math.floor(base / 10);
    const d2 = base % 10;

    const b1 = DIGIT_COLORS[d1] || 'brown';
    const b2 = DIGIT_COLORS[d2] || 'black';

    // multiplier
    const actualMult = Math.pow(10, exponent);
    const multBand = MULTIPLIER_COLORS.find(c => Math.abs((COLOR_TABLE[c].multiplier ?? 0) - actualMult) < 0.0001) || 'black';

    return {
      band1: b1,
      band2: b2,
      multiplier: multBand,
      tolerance: tolBand,
      standardResistance: (d1 * 10 + d2) * (COLOR_TABLE[multBand]?.multiplier || 1),
    };
  } else {
    // 5-band: 3 significant digits
    const exponent = Math.floor(Math.log10(ohms)) - 2;
    let base = Math.round(ohms / Math.pow(10, exponent));
    if (base >= 1000) {
      base = 100;
    }
    const d1 = Math.floor(base / 100);
    const d2 = Math.floor((base % 100) / 10);
    const d3 = base % 10;

    const b1 = DIGIT_COLORS[d1] || 'brown';
    const b2 = DIGIT_COLORS[d2] || 'black';
    const b3 = DIGIT_COLORS[d3] || 'black';

    const actualMult = Math.pow(10, exponent);
    const multBand = MULTIPLIER_COLORS.find(c => Math.abs((COLOR_TABLE[c].multiplier ?? 0) - actualMult) < 0.0001) || 'black';

    return {
      band1: b1,
      band2: b2,
      band3: b3,
      multiplier: multBand,
      tolerance: tolBand,
      standardResistance: (d1 * 100 + d2 * 10 + d3) * (COLOR_TABLE[multBand]?.multiplier || 1),
    };
  }
}
