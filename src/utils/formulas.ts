/**
 * Electrical calculation utilities, unit conversion, and math derivations.
 */
import { QuantityType, UnitOption, DerivationStep } from '../types/electronics';

export const UNITS_CONFIG: Record<QuantityType, UnitOption[]> = {
  voltage: [
    { symbol: 'μV', label: '微伏 (μV)', multiplier: 1e-6 },
    { symbol: 'mV', label: '毫伏 (mV)', multiplier: 1e-3 },
    { symbol: 'V', label: '伏特 (V)', multiplier: 1 },
    { symbol: 'kV', label: '千伏 (kV)', multiplier: 1e3 },
    { symbol: 'MV', label: '兆伏 (MV)', multiplier: 1e6 },
  ],
  current: [
    { symbol: 'μA', label: '微安 (μA)', multiplier: 1e-6 },
    { symbol: 'mA', label: '毫安 (mA)', multiplier: 1e-3 },
    { symbol: 'A', label: '安培 (A)', multiplier: 1 },
    { symbol: 'kA', label: '千安 (kA)', multiplier: 1e3 },
  ],
  resistance: [
    { symbol: 'mΩ', label: '毫欧 (mΩ)', multiplier: 1e-3 },
    { symbol: 'Ω', label: '欧姆 (Ω)', multiplier: 1 },
    { symbol: 'kΩ', label: '千欧 (kΩ)', multiplier: 1e3 },
    { symbol: 'MΩ', label: '兆欧 (MΩ)', multiplier: 1e6 },
    { symbol: 'GΩ', label: '吉欧 (GΩ)', multiplier: 1e9 },
  ],
  power: [
    { symbol: 'μW', label: '微瓦 (μW)', multiplier: 1e-6 },
    { symbol: 'mW', label: '毫瓦 (mW)', multiplier: 1e-3 },
    { symbol: 'W', label: '瓦特 (W)', multiplier: 1 },
    { symbol: 'kW', label: '千瓦 (kW)', multiplier: 1e3 },
    { symbol: 'MW', label: '兆瓦 (MW)', multiplier: 1e6 },
    { symbol: 'hp', label: '马力 (hp ≈ 745.7W)', multiplier: 745.699872 },
  ],
};

/**
 * Format a number cleanly with standard precision or engineering scale.
 */
export function formatValue(val: number | null | undefined, precision: number = 4): string {
  if (val === null || val === undefined || isNaN(val) || !isFinite(val)) {
    return '--';
  }
  if (val === 0) return '0';
  const abs = Math.abs(val);
  if (abs >= 1e6 || abs < 1e-4) {
    return val.toExponential(3).replace('e+', 'e');
  }
  // Trim trailing zeros after fixed precision
  const fixed = val.toFixed(precision);
  return parseFloat(fixed).toString();
}

/**
 * Automatically format a physical value into the best human-readable engineering SI unit.
 */
export function formatAutoEngineering(valueSI: number, type: QuantityType): { value: string; unit: string } {
  if (valueSI === 0) {
    return { value: '0', unit: UNITS_CONFIG[type].find(u => u.multiplier === 1)?.symbol || '' };
  }
  const units = [...UNITS_CONFIG[type]].sort((a, b) => b.multiplier - a.multiplier);
  const abs = Math.abs(valueSI);

  // find the largest unit where value >= unit.multiplier * 0.99
  let chosen = units[units.length - 1];
  for (const u of units) {
    if (u.symbol === 'hp') continue; // skip hp for auto-scaling
    if (abs >= u.multiplier * 0.95) {
      chosen = u;
      break;
    }
  }

  const converted = valueSI / chosen.multiplier;
  return {
    value: formatValue(converted, 3),
    unit: chosen.symbol,
  };
}

/**
 * Given two known quantities, compute the other two.
 * Valid combinations:
 * - V, I -> R, P
 * - V, R -> I, P
 * - V, P -> I, R
 * - I, R -> V, P
 * - I, P -> V, R
 * - R, P -> V, I
 */
export function solveAllQuantities(
  known: {
    voltage?: number | null;
    current?: number | null;
    resistance?: number | null;
    power?: number | null;
  }
): {
  values: {
    voltage: number | null;
    current: number | null;
    resistance: number | null;
    power: number | null;
  };
  steps: DerivationStep[];
  error?: string;
} {
  const v = known.voltage ?? null;
  const i = known.current ?? null;
  const r = known.resistance ?? null;
  const p = known.power ?? null;

  const validV = v !== null && !isNaN(v) && v > 0;
  const validI = i !== null && !isNaN(i) && i > 0;
  const validR = r !== null && !isNaN(r) && r > 0;
  const validP = p !== null && !isNaN(p) && p > 0;

  const count = [validV, validI, validR, validP].filter(Boolean).length;
  if (count < 2) {
    return {
      values: { voltage: v, current: i, resistance: r, power: p },
      steps: [],
    };
  }

  const steps: DerivationStep[] = [];
  let resV = v;
  let resI = i;
  let resR = r;
  let resP = p;

  // Case 1: Voltage and Current known
  if (validV && validI) {
    resR = v! / i!;
    resP = v! * i!;

    steps.push({
      target: 'resistance',
      formulaLatex: 'R = \\frac{U}{I}',
      formulaPlain: 'R = U / I',
      explanation: '欧姆定律定义式：电阻等于导体两端的电压与通过导体电流的比值。',
      substitution: `R = ${formatValue(v!)} V / ${formatValue(i!)} A`,
      resultWithUnit: `${formatValue(resR)} Ω`,
    });

    steps.push({
      target: 'power',
      formulaLatex: 'P = U \\cdot I',
      formulaPlain: 'P = U × I',
      explanation: '电功率核心定义式：单位时间内电流所做的电功，等于电压与电流的乘积。',
      substitution: `P = ${formatValue(v!)} V × ${formatValue(i!)} A`,
      resultWithUnit: `${formatValue(resP)} W`,
      alternateVerification: `焦耳定律验算: P = I²·R = (${formatValue(i!)})² × ${formatValue(resR)} = ${formatValue(resP)} W`,
    });
  }
  // Case 2: Voltage and Resistance known
  else if (validV && validR) {
    resI = v! / r!;
    resP = (v! * v!) / r!;

    steps.push({
      target: 'current',
      formulaLatex: 'I = \\frac{U}{R}',
      formulaPlain: 'I = U / R',
      explanation: '欧姆定律标准式：通过导体的电流与导体两端电压成正比，与导体的电阻成反比。',
      substitution: `I = ${formatValue(v!)} V / ${formatValue(r!)} Ω`,
      resultWithUnit: `${formatValue(resI)} A`,
    });

    steps.push({
      target: 'power',
      formulaLatex: 'P = \\frac{U^2}{R}',
      formulaPlain: 'P = U² / R',
      explanation: '由 P = UI 与 I = U/R 联立推导得出，适用于已知恒压源两端加在已知电阻上的功率计算。',
      substitution: `P = (${formatValue(v!)})² / ${formatValue(r!)}`,
      resultWithUnit: `${formatValue(resP)} W`,
      alternateVerification: `电流复核: P = U × I = ${formatValue(v!)} × ${formatValue(resI)} = ${formatValue(resP)} W`,
    });
  }
  // Case 3: Voltage and Power known
  else if (validV && validP) {
    resI = p! / v!;
    resR = (v! * v!) / p!;

    steps.push({
      target: 'current',
      formulaLatex: 'I = \\frac{P}{U}',
      formulaPlain: 'I = P / U',
      explanation: '由电功率公式 P = UI 变形得出：额定电压下电器的额定工作电流计算。',
      substitution: `I = ${formatValue(p!)} W / ${formatValue(v!)} V`,
      resultWithUnit: `${formatValue(resI)} A`,
    });

    steps.push({
      target: 'resistance',
      formulaLatex: 'R = \\frac{U^2}{P}',
      formulaPlain: 'R = U² / P',
      explanation: '由 P = U²/R 变形得出：常用于根据电器铭牌（额定电压与额定功率）计算其内部等效电阻。',
      substitution: `R = (${formatValue(v!)})² / ${formatValue(p!)}`,
      resultWithUnit: `${formatValue(resR)} Ω`,
      alternateVerification: `阻值复核: R = U / I = ${formatValue(v!)} / ${formatValue(resI)} = ${formatValue(resR)} Ω`,
    });
  }
  // Case 4: Current and Resistance known
  else if (validI && validR) {
    resV = i! * r!;
    resP = i! * i! * r!;

    steps.push({
      target: 'voltage',
      formulaLatex: 'U = I \\cdot R',
      formulaPlain: 'U = I × R',
      explanation: '欧姆定律变形：计算已知电流通过一定电阻时在其两端产生的电压降（分压）。',
      substitution: `U = ${formatValue(i!)} A × ${formatValue(r!)} Ω`,
      resultWithUnit: `${formatValue(resV)} V`,
    });

    steps.push({
      target: 'power',
      formulaLatex: 'P = I^2 \\cdot R',
      formulaPlain: 'P = I² × R',
      explanation: '焦耳定律热功率式：常用于计算导线发热损耗或恒流电路中的热功率消耗。',
      substitution: `P = (${formatValue(i!)})² × ${formatValue(r!)}`,
      resultWithUnit: `${formatValue(resP)} W`,
      alternateVerification: `电压复核: P = U × I = ${formatValue(resV)} × ${formatValue(i!)} = ${formatValue(resP)} W`,
    });
  }
  // Case 5: Current and Power known
  else if (validI && validP) {
    resV = p! / i!;
    resR = p! / (i! * i!);

    steps.push({
      target: 'voltage',
      formulaLatex: 'U = \\frac{P}{I}',
      formulaPlain: 'U = P / I',
      explanation: '电功率变形：已知电器消耗的电功率与流过电流，求其承受的端电压。',
      substitution: `U = ${formatValue(p!)} W / ${formatValue(i!)} A`,
      resultWithUnit: `${formatValue(resV)} V`,
    });

    steps.push({
      target: 'resistance',
      formulaLatex: 'R = \\frac{P}{I^2}',
      formulaPlain: 'R = P / I²',
      explanation: '由焦耳定律 P = I²R 变形得出：用于已知工作电流及发热功率时求等效电阻。',
      substitution: `R = ${formatValue(p!)} / (${formatValue(i!)})²`,
      resultWithUnit: `${formatValue(resR)} Ω`,
      alternateVerification: `欧姆定律复核: R = U / I = ${formatValue(resV)} / ${formatValue(i!)} = ${formatValue(resR)} Ω`,
    });
  }
  // Case 6: Resistance and Power known
  else if (validR && validP) {
    resV = Math.sqrt(p! * r!);
    resI = Math.sqrt(p! / r!);

    steps.push({
      target: 'voltage',
      formulaLatex: 'U = \\sqrt{P \\cdot R}',
      formulaPlain: 'U = √(P × R)',
      explanation: '由 P = U²/R 变形求平方根得出：电阻耐压允许极限计算（耐压值 = √(标称功率 × 阻值)）。',
      substitution: `U = √(${formatValue(p!)} W × ${formatValue(r!)} Ω)`,
      resultWithUnit: `${formatValue(resV)} V`,
    });

    steps.push({
      target: 'current',
      formulaLatex: 'I = \\sqrt{\\frac{P}{R}}',
      formulaPlain: 'I = √(P / R)',
      explanation: '由 P = I²R 变形求平方根得出：电阻允许通过的最大安全电流阈值。',
      substitution: `I = √(${formatValue(p!)} / ${formatValue(r!)})`,
      resultWithUnit: `${formatValue(resI)} A`,
      alternateVerification: `功率复核: P = U × I = ${formatValue(resV)} × ${formatValue(resI)} = ${formatValue(resP)} W`,
    });
  }

  return {
    values: {
      voltage: resV,
      current: resI,
      resistance: resR,
      power: resP,
    },
    steps,
  };
}
