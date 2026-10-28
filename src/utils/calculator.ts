/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VariableType = 'voltage' | 'current' | 'resistance' | 'power';

export type PrecisionMode = 'sigfigs' | 'decimals' | 'scientific' | 'engineering';

export interface UnitDefinition {
  label: string;
  symbol: string;
  multiplier: number;
}

export const VOLTAGE_UNITS: UnitDefinition[] = [
  { label: 'Microvolts (μV)', symbol: 'μV', multiplier: 1e-6 },
  { label: 'Millivolts (mV)', symbol: 'mV', multiplier: 1e-3 },
  { label: 'Volts (V)', symbol: 'V', multiplier: 1 },
  { label: 'Kilovolts (kV)', symbol: 'kV', multiplier: 1e3 },
  { label: 'Megavolts (MV)', symbol: 'MV', multiplier: 1e6 },
];

export const CURRENT_UNITS: UnitDefinition[] = [
  { label: 'Picoamperes (pA)', symbol: 'pA', multiplier: 1e-12 },
  { label: 'Nanoamperes (nA)', symbol: 'nA', multiplier: 1e-9 },
  { label: 'Microamperes (μA)', symbol: 'μA', multiplier: 1e-6 },
  { label: 'Milliamperes (mA)', symbol: 'mA', multiplier: 1e-3 },
  { label: 'Amperes (A)', symbol: 'A', multiplier: 1 },
  { label: 'Kiloamperes (kA)', symbol: 'kA', multiplier: 1e3 },
];

export const RESISTANCE_UNITS: UnitDefinition[] = [
  { label: 'Milliohms (mΩ)', symbol: 'mΩ', multiplier: 1e-3 },
  { label: 'Ohms (Ω)', symbol: 'Ω', multiplier: 1 },
  { label: 'Kilohms (kΩ)', symbol: 'kΩ', multiplier: 1e3 },
  { label: 'Megaohms (MΩ)', symbol: 'MΩ', multiplier: 1e6 },
  { label: 'Gigaohms (GΩ)', symbol: 'GΩ', multiplier: 1e9 },
];

export const POWER_UNITS: UnitDefinition[] = [
  { label: 'Picowatts (pW)', symbol: 'pW', multiplier: 1e-12 },
  { label: 'Nanowatts (nW)', symbol: 'nW', multiplier: 1e-9 },
  { label: 'Microwatts (μW)', symbol: 'μW', multiplier: 1e-6 },
  { label: 'Milliwatts (mW)', symbol: 'mW', multiplier: 1e-3 },
  { label: 'Watts (W)', symbol: 'W', multiplier: 1 },
  { label: 'Kilowatts (kW)', symbol: 'kW', multiplier: 1e3 },
  { label: 'Megawatts (MW)', symbol: 'MW', multiplier: 1e6 },
];

export interface CircuitState {
  voltage: number | null; // in Volts
  current: number | null; // in Amperes
  resistance: number | null; // in Ohms
  power: number | null; // in Watts
}

export interface DerivationStep {
  target: VariableType;
  formulaTex: string;
  formulaPlain: string;
  substitution: string;
  resultPlain: string;
  explanation: string;
}

/**
 * High-precision formatter adhering to user-configured significant figures or decimal places.
 */
export function formatValueWithPrecision(
  val: number | null,
  mode: PrecisionMode = 'sigfigs',
  precision: number = 4
): string {
  if (val === null || isNaN(val) || !isFinite(val)) return '—';
  if (val === 0) return '0';

  const abs = Math.abs(val);

  switch (mode) {
    case 'sigfigs': {
      // Significant figures: e.g. 1 to 10
      const p = Math.max(1, Math.min(10, precision));
      return val.toPrecision(p);
    }
    case 'decimals': {
      // Fixed decimal places: e.g. 0 to 10
      const d = Math.max(0, Math.min(10, precision));
      return val.toFixed(d);
    }
    case 'scientific': {
      // Standard scientific notation: e.g. 1.234e-3
      const p = Math.max(1, Math.min(10, precision));
      return val.toExponential(p - 1);
    }
    case 'engineering': {
      // Engineering notation with SI prefix
      const prefixes = [
        { exp: 12, symbol: 'T' },
        { exp: 9, symbol: 'G' },
        { exp: 6, symbol: 'M' },
        { exp: 3, symbol: 'k' },
        { exp: 0, symbol: '' },
        { exp: -3, symbol: 'm' },
        { exp: -6, symbol: 'μ' },
        { exp: -9, symbol: 'n' },
        { exp: -12, symbol: 'p' },
      ];
      
      const exponent = Math.floor(Math.log10(abs) / 3) * 3;
      const matched = prefixes.find((p) => p.exp === exponent) || (exponent > 12 ? prefixes[0] : prefixes[prefixes.length - 1]);
      const scaled = val / Math.pow(10, matched.exp);
      const p = Math.max(1, Math.min(10, precision));
      return `${scaled.toPrecision(p)} ${matched.symbol}`.trim();
    }
    default:
      return val.toPrecision(4);
  }
}

/**
 * Calculates the remaining 2 variables from any 2 known variables.
 */
export function solveOhmsLaw(
  v: number | null,
  i: number | null,
  r: number | null,
  p: number | null
): {
  solved: CircuitState;
  activeFormulas: {
    voltageFormula?: string;
    currentFormula?: string;
    resistanceFormula?: string;
    powerFormula?: string;
  };
  derivations: DerivationStep[];
} {
  const result: CircuitState = { voltage: v, current: i, resistance: r, power: p };
  const formulas: {
    voltageFormula?: string;
    currentFormula?: string;
    resistanceFormula?: string;
    powerFormula?: string;
  } = {};
  const derivations: DerivationStep[] = [];

  // Count known values
  const knowns: VariableType[] = [];
  if (v !== null && v > 0) knowns.push('voltage');
  if (i !== null && i > 0) knowns.push('current');
  if (r !== null && r > 0) knowns.push('resistance');
  if (p !== null && p > 0) knowns.push('power');

  // Case 1: V and I known -> solve R, P
  if (v !== null && i !== null) {
    result.resistance = v / i;
    result.power = v * i;

    formulas.resistanceFormula = 'R = V / I';
    formulas.powerFormula = 'P = V × I';

    derivations.push({
      target: 'resistance',
      formulaTex: 'R = \\frac{V}{I}',
      formulaPlain: 'R = V / I',
      substitution: `R = ${v} V / ${i} A`,
      resultPlain: `${result.resistance} Ω`,
      explanation: "Ohm's Law: Resistance is the ratio of potential difference across a conductor to the current flowing through it.",
    });

    derivations.push({
      target: 'power',
      formulaTex: 'P = V \\times I',
      formulaPlain: 'P = V × I',
      substitution: `P = ${v} V × ${i} A`,
      resultPlain: `${result.power} W`,
      explanation: "Joule's Law: Electrical power converted to heat and other forms equals potential difference multiplied by current.",
    });
  }
  // Case 2: V and R known -> solve I, P
  else if (v !== null && r !== null) {
    result.current = v / r;
    result.power = (v * v) / r;

    formulas.currentFormula = 'I = V / R';
    formulas.powerFormula = 'P = V² / R';

    derivations.push({
      target: 'current',
      formulaTex: 'I = \\frac{V}{R}',
      formulaPlain: 'I = V / R',
      substitution: `I = ${v} V / ${r} Ω`,
      resultPlain: `${result.current} A`,
      explanation: 'Current is directly proportional to voltage and inversely proportional to resistance.',
    });

    derivations.push({
      target: 'power',
      formulaTex: 'P = \\frac{V^2}{R}',
      formulaPlain: 'P = V² / R',
      substitution: `P = (${v} V)² / ${r} Ω`,
      resultPlain: `${result.power} W`,
      explanation: 'Power dissipated across resistance proportional to the square of voltage.',
    });
  }
  // Case 3: V and P known -> solve I, R
  else if (v !== null && p !== null) {
    result.current = p / v;
    result.resistance = (v * v) / p;

    formulas.currentFormula = 'I = P / V';
    formulas.resistanceFormula = 'R = V² / P';

    derivations.push({
      target: 'current',
      formulaTex: 'I = \\frac{P}{V}',
      formulaPlain: 'I = P / V',
      substitution: `I = ${p} W / ${v} V`,
      resultPlain: `${result.current} A`,
      explanation: 'Derived from P = V × I rearranged to isolate current.',
    });

    derivations.push({
      target: 'resistance',
      formulaTex: 'R = \\frac{V^2}{P}',
      formulaPlain: 'R = V² / P',
      substitution: `R = (${v} V)² / ${p} W`,
      resultPlain: `${result.resistance} Ω`,
      explanation: 'Calculated equivalent resistance required to dissipate power P under voltage V.',
    });
  }
  // Case 4: I and R known -> solve V, P
  else if (i !== null && r !== null) {
    result.voltage = i * r;
    result.power = i * i * r;

    formulas.voltageFormula = 'V = I × R';
    formulas.powerFormula = 'P = I² × R';

    derivations.push({
      target: 'voltage',
      formulaTex: 'V = I \\times R',
      formulaPlain: 'V = I × R',
      substitution: `V = ${i} A × ${r} Ω`,
      resultPlain: `${result.voltage} V`,
      explanation: "Fundamental Ohm's Law relationship: Voltage drop equals current times resistance.",
    });

    derivations.push({
      target: 'power',
      formulaTex: 'P = I^2 \\times R',
      formulaPlain: 'P = I² × R',
      substitution: `P = (${i} A)² × ${r} Ω`,
      resultPlain: `${result.power} W`,
      explanation: "Joule heating dissipation: Power proportional to square of current through resistor.",
    });
  }
  // Case 5: I and P known -> solve V, R
  else if (i !== null && p !== null) {
    result.voltage = p / i;
    result.resistance = p / (i * i);

    formulas.voltageFormula = 'V = P / I';
    formulas.resistanceFormula = 'R = P / I²';

    derivations.push({
      target: 'voltage',
      formulaTex: 'V = \\frac{P}{I}',
      formulaPlain: 'V = P / I',
      substitution: `V = ${p} W / ${i} A`,
      resultPlain: `${result.voltage} V`,
      explanation: 'Voltage required to deliver power P with current I.',
    });

    derivations.push({
      target: 'resistance',
      formulaTex: 'R = \\frac{P}{I^2}',
      formulaPlain: 'R = P / I²',
      substitution: `R = ${p} W / (${i} A)²`,
      resultPlain: `${result.resistance} Ω`,
      explanation: 'Resistance derived by dividing power by the square of current.',
    });
  }
  // Case 6: R and P known -> solve V, I
  else if (r !== null && p !== null) {
    result.voltage = Math.sqrt(p * r);
    result.current = Math.sqrt(p / r);

    formulas.voltageFormula = 'V = √(P × R)';
    formulas.currentFormula = 'I = √(P / R)';

    derivations.push({
      target: 'voltage',
      formulaTex: 'V = \\sqrt{P \\times R}',
      formulaPlain: 'V = √(P × R)',
      substitution: `V = √(${p} W × ${r} Ω)`,
      resultPlain: `${result.voltage} V`,
      explanation: 'Square root of power-resistance product yields terminal voltage.',
    });

    derivations.push({
      target: 'current',
      formulaTex: 'I = \\sqrt{\\frac{P}{R}}',
      formulaPlain: 'I = √(P / R)',
      substitution: `I = √(${p} W / ${r} Ω)`,
      resultPlain: `${result.current} A`,
      explanation: 'Square root of power divided by resistance gives branch current.',
    });
  }

  return { solved: result, activeFormulas: formulas, derivations };
}

/**
 * Standard resistor power rating evaluation
 */
export function evaluatePowerSafety(powerWatts: number | null): {
  rating: string;
  safe: boolean;
  warning?: string;
  recommendedPackage: string;
} {
  if (powerWatts === null || powerWatts <= 0) {
    return { rating: 'N/A', safe: true, recommendedPackage: 'Standard 0805 SMD or 1/4W Through-Hole' };
  }

  if (powerWatts <= 0.125) {
    return { rating: '1/8 W (0.125W)', safe: true, recommendedPackage: '0805 / 0603 SMD or 1/8W Axial' };
  } else if (powerWatts <= 0.25) {
    return { rating: '1/4 W (0.25W)', safe: true, recommendedPackage: '1206 SMD or 1/4W Carbon/Metal Film' };
  } else if (powerWatts <= 0.5) {
    return { rating: '1/2 W (0.5W)', safe: true, recommendedPackage: '1/2W Metal Film or 2010 SMD' };
  } else if (powerWatts <= 1.0) {
    return { rating: '1 W', safe: true, recommendedPackage: '1W Metal Oxide or Power Wirewound' };
  } else if (powerWatts <= 2.0) {
    return {
      rating: '2 W',
      safe: false,
      warning: 'High heat dissipation. Ensure adequate PCB copper spacing or ventilation.',
      recommendedPackage: '2W Wirewound Resistor',
    };
  } else if (powerWatts <= 5.0) {
    return {
      rating: '5 W',
      safe: false,
      warning: 'Very high thermal dissipation. Ceramic cement package required with thermal standoff.',
      recommendedPackage: '5W Ceramic Cement / Wirewound',
    };
  } else {
    return {
      rating: '> 5 W',
      safe: false,
      warning: `Critical power dissipation (${powerWatts.toFixed(2)}W). Active cooling or chassis heatsink chassis mount required!`,
      recommendedPackage: 'Chassis Mount Aluminum Housed Resistor (TO-220 / Dale NH series)',
    };
  }
}
