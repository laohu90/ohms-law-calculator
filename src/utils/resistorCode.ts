/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorBand {
  name: string;
  colorHex: string;
  textColorHex: string;
  value: number;
  multiplier: number;
  tolerance?: number;
}

export const COLOR_BANDS: Record<string, ColorBand> = {
  black: { name: 'Black', colorHex: '#18181b', textColorHex: '#ffffff', value: 0, multiplier: 1 },
  brown: { name: 'Brown', colorHex: '#854d0e', textColorHex: '#ffffff', value: 1, multiplier: 10, tolerance: 1 },
  red: { name: 'Red', colorHex: '#dc2626', textColorHex: '#ffffff', value: 2, multiplier: 100, tolerance: 2 },
  orange: { name: 'Orange', colorHex: '#ea580c', textColorHex: '#ffffff', value: 3, multiplier: 1000 },
  yellow: { name: 'Yellow', colorHex: '#eab308', textColorHex: '#18181b', value: 4, multiplier: 10000 },
  green: { name: 'Green', colorHex: '#16a34a', textColorHex: '#ffffff', value: 5, multiplier: 100000, tolerance: 0.5 },
  blue: { name: 'Blue', colorHex: '#2563eb', textColorHex: '#ffffff', value: 6, multiplier: 1000000, tolerance: 0.25 },
  violet: { name: 'Violet', colorHex: '#9333ea', textColorHex: '#ffffff', value: 7, multiplier: 10000000, tolerance: 0.1 },
  gray: { name: 'Gray', colorHex: '#64748b', textColorHex: '#ffffff', value: 8, multiplier: 100000000, tolerance: 0.05 },
  white: { name: 'White', colorHex: '#f8fafc', textColorHex: '#18181b', value: 9, multiplier: 1000000000 },
  gold: { name: 'Gold', colorHex: '#d97706', textColorHex: '#ffffff', value: -1, multiplier: 0.1, tolerance: 5 },
  silver: { name: 'Silver', colorHex: '#94a3b8', textColorHex: '#18181b', value: -2, multiplier: 0.01, tolerance: 10 },
};

// EIA E12 standard multiplier decade values
export const E12_VALUES = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

// EIA E24 standard multiplier decade values
export const E24_VALUES = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
  3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
];

/**
 * Converts resistance to 4-band EIA color bands
 */
export function get4BandResistorColors(resistanceOhms: number): {
  band1: ColorBand;
  band2: ColorBand;
  multiplierBand: ColorBand;
  toleranceBand: ColorBand;
} {
  if (resistanceOhms <= 0) {
    return {
      band1: COLOR_BANDS.black,
      band2: COLOR_BANDS.black,
      multiplierBand: COLOR_BANDS.black,
      toleranceBand: COLOR_BANDS.gold,
    };
  }

  // Find 2 significant digits
  const scientific = resistanceOhms.toExponential(1); // e.g. "4.7e+3"
  const [mantissaStr, expStr] = scientific.split('e');
  const mantissa = parseFloat(mantissaStr);
  const exponent = parseInt(expStr, 10);

  // Mantissa is e.g. 4.7 -> d1 = 4, d2 = 7, multiplier = 10^(exponent - 1)
  const digits = Math.round(mantissa * 10);
  const d1 = Math.floor(digits / 10);
  const d2 = digits % 10;
  const multExp = exponent - 1;

  const band1 = Object.values(COLOR_BANDS).find((b) => b.value === d1) || COLOR_BANDS.black;
  const band2 = Object.values(COLOR_BANDS).find((b) => b.value === d2) || COLOR_BANDS.black;

  let multiplierBand = COLOR_BANDS.black;
  if (multExp === -2) multiplierBand = COLOR_BANDS.silver;
  else if (multExp === -1) multiplierBand = COLOR_BANDS.gold;
  else {
    multiplierBand = Object.values(COLOR_BANDS).find((b) => b.value === multExp) || COLOR_BANDS.black;
  }

  return {
    band1,
    band2,
    multiplierBand,
    toleranceBand: COLOR_BANDS.gold, // 5% standard
  };
}

/**
 * Finds the nearest standard EIA E12 and E24 standard resistor value
 */
export function findNearestStandardEValues(resistanceOhms: number): {
  nearestE12: number;
  e12DiffPercent: number;
  nearestE24: number;
  e24DiffPercent: number;
} {
  if (resistanceOhms <= 0) {
    return { nearestE12: 1, e12DiffPercent: 0, nearestE24: 1, e24DiffPercent: 0 };
  }

  const exponent = Math.floor(Math.log10(resistanceOhms));
  const decade = Math.pow(10, exponent);
  const normalized = resistanceOhms / decade;

  // Search E12
  let closestE12 = E12_VALUES[0];
  let minDiffE12 = Infinity;
  for (const v of E12_VALUES) {
    const diff = Math.abs(v - normalized);
    if (diff < minDiffE12) {
      minDiffE12 = diff;
      closestE12 = v;
    }
  }
  const e12Val = closestE12 * decade;
  const e12DiffPercent = ((e12Val - resistanceOhms) / resistanceOhms) * 100;

  // Search E24
  let closestE24 = E24_VALUES[0];
  let minDiffE24 = Infinity;
  for (const v of E24_VALUES) {
    const diff = Math.abs(v - normalized);
    if (diff < minDiffE24) {
      minDiffE24 = diff;
      closestE24 = v;
    }
  }
  const e24Val = closestE24 * decade;
  const e24DiffPercent = ((e24Val - resistanceOhms) / resistanceOhms) * 100;

  return {
    nearestE12: e12Val,
    e12DiffPercent,
    nearestE24: e24Val,
    e24DiffPercent,
  };
}
