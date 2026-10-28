import {
  VoltageUnit,
  CurrentUnit,
  ResistanceUnit,
  PowerUnit,
  UnitDefinition,
  PrecisionConfig,
} from '../types/ohms';

export const VOLTAGE_UNITS: Record<VoltageUnit, UnitDefinition<VoltageUnit>> = {
  uV: { symbol: 'uV', label: 'μV (微伏)', multiplier: 1e-6 },
  mV: { symbol: 'mV', label: 'mV (毫伏)', multiplier: 1e-3 },
  V: { symbol: 'V', label: 'V (伏特)', multiplier: 1 },
  kV: { symbol: 'kV', label: 'kV (千伏)', multiplier: 1e3 },
  MV: { symbol: 'MV', label: 'MV (兆伏)', multiplier: 1e6 },
};

export const CURRENT_UNITS: Record<CurrentUnit, UnitDefinition<CurrentUnit>> = {
  uA: { symbol: 'uA', label: 'μA (微安)', multiplier: 1e-6 },
  mA: { symbol: 'mA', label: 'mA (毫安)', multiplier: 1e-3 },
  A: { symbol: 'A', label: 'A (安培)', multiplier: 1 },
  kA: { symbol: 'kA', label: 'kA (千安)', multiplier: 1e3 },
};

export const RESISTANCE_UNITS: Record<ResistanceUnit, UnitDefinition<ResistanceUnit>> = {
  mOhm: { symbol: 'mOhm', label: 'mΩ (毫欧)', multiplier: 1e-3 },
  ohm: { symbol: 'ohm', label: 'Ω (欧姆)', multiplier: 1 },
  kOhm: { symbol: 'kOhm', label: 'kΩ (千欧)', multiplier: 1e3 },
  MOhm: { symbol: 'MOhm', label: 'MΩ (兆欧)', multiplier: 1e6 },
  GOhm: { symbol: 'GOhm', label: 'GΩ (吉欧)', multiplier: 1e9 },
};

export const POWER_UNITS: Record<PowerUnit, UnitDefinition<PowerUnit>> = {
  uW: { symbol: 'uW', label: 'μW (微瓦)', multiplier: 1e-6 },
  mW: { symbol: 'mW', label: 'mW (毫瓦)', multiplier: 1e-3 },
  W: { symbol: 'W', label: 'W (瓦特)', multiplier: 1 },
  kW: { symbol: 'kW', label: 'kW (千瓦)', multiplier: 1e3 },
  MW: { symbol: 'MW', label: 'MW (兆瓦)', multiplier: 1e6 },
};

// Converts display value with unit to standard SI unit value
export function toSI(value: number, unitMultiplier: number): number {
  return value * unitMultiplier;
}

// Converts standard SI unit value to display value for a unit
export function fromSI(siValue: number, unitMultiplier: number): number {
  return siValue / unitMultiplier;
}

// Format a number according to PrecisionConfig
export function formatWithPrecision(num: number, config: PrecisionConfig): string {
  if (isNaN(num) || !isFinite(num)) {
    return '除零/无效';
  }

  if (num === 0) return '0';

  const absNum = Math.abs(num);

  // If force scientific notation or extremely large/small numbers
  if (config.useScientific || absNum >= 1e9 || (absNum < 1e-4 && absNum > 0)) {
    return num.toExponential(
      config.mode === 'sigfig' ? config.significantFigures - 1 : config.decimalPlaces
    );
  }

  let formatted: string;

  if (config.mode === 'sigfig') {
    formatted = num.toPrecision(config.significantFigures);
    // If toPrecision converted to exponential notation unexpectedly, format cleanly
    if (formatted.includes('e')) {
      formatted = parseFloat(formatted).toString();
    }
  } else {
    formatted = num.toFixed(config.decimalPlaces);
  }

  // Remove trailing zeros if clean float, but preserve fixed decimals if specified
  if (config.mode === 'decimal') {
    // Keep as fixed
  } else {
    // Strip trailing zeros for sigfig if appropriate
    if (formatted.includes('.')) {
      formatted = formatted.replace(/\.?0+$/, '');
    }
  }

  // Handle thousands separator
  if (config.useThousandsSeparator) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }

  return formatted;
}

// Validates positive physical numbers
export function validatePositiveInput(
  rawVal: string | number,
  paramName: string
): { isValid: boolean; value: number; message?: string } {
  const parsed = typeof rawVal === 'number' ? rawVal : parseFloat(rawVal);

  if (isNaN(parsed)) {
    return { isValid: false, value: 0, message: `${paramName}请输入有效数值` };
  }

  if (parsed <= 0) {
    return {
      isValid: false,
      value: parsed,
      message: `除零 / 参数无效：${paramName}必须大于0（当前值为 ${parsed}）`,
    };
  }

  return { isValid: true, value: parsed };
}

// Human readable symbol label for UI
export function getUnitSymbol(unit: string): string {
  switch (unit) {
    case 'uV': return 'μV';
    case 'mV': return 'mV';
    case 'V': return 'V';
    case 'kV': return 'kV';
    case 'MV': return 'MV';
    case 'uA': return 'μA';
    case 'mA': return 'mA';
    case 'A': return 'A';
    case 'kA': return 'kA';
    case 'mOhm': return 'mΩ';
    case 'ohm': return 'Ω';
    case 'kOhm': return 'kΩ';
    case 'MOhm': return 'MΩ';
    case 'GOhm': return 'GΩ';
    case 'uW': return 'μW';
    case 'mW': return 'mW';
    case 'W': return 'W';
    case 'kW': return 'kW';
    case 'MW': return 'MW';
    default: return unit;
  }
}
