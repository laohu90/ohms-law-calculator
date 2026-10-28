import {
  TargetParameter,
  VoltageUnit,
  CurrentUnit,
  ResistanceUnit,
  PowerUnit,
  PrecisionConfig,
  CalculationResult,
  FormulaStep,
} from '../types/ohms';
import {
  VOLTAGE_UNITS,
  CURRENT_UNITS,
  RESISTANCE_UNITS,
  POWER_UNITS,
  toSI,
  fromSI,
  formatWithPrecision,
  getUnitSymbol,
} from './unitConverter';

export function calculateOhmsLaw(params: {
  target: TargetParameter;
  uVal: number;
  uUnit: VoltageUnit;
  iVal: number;
  iUnit: CurrentUnit;
  rVal: number;
  rUnit: ResistanceUnit;
  pVal: number;
  pUnit: PowerUnit;
  precision: PrecisionConfig;
}): CalculationResult {
  const {
    target,
    uVal,
    uUnit,
    iVal,
    iUnit,
    rVal,
    rUnit,
    pVal,
    pUnit,
    precision,
  } = params;

  // Convert all input display values to SI base units
  let u_si = toSI(uVal, VOLTAGE_UNITS[uUnit].multiplier);
  let i_si = toSI(iVal, CURRENT_UNITS[iUnit].multiplier);
  let r_si = toSI(rVal, RESISTANCE_UNITS[rUnit].multiplier);
  let p_si = toSI(pVal, POWER_UNITS[pUnit].multiplier);

  const steps: FormulaStep[] = [];

  // Validation step for input parameters depending on target calculation mode
  const validationErrors: string[] = [];

  // Helper to validate positivity
  const checkPositive = (val: number, name: string) => {
    if (isNaN(val) || !isFinite(val)) {
      validationErrors.push(`${name}数值无效`);
    } else if (val <= 0) {
      validationErrors.push(`除零 / 参数无效：${name}不能为 0 或负数（当前: ${val}）`);
    }
  };

  if (target === 'I') {
    // Current I target: calculate I from U and R (or U and P)
    checkPositive(uVal, '电压 U');
    checkPositive(rVal, '电阻 R');
  } else if (target === 'U') {
    // Voltage U target: calculate U from I and R
    checkPositive(iVal, '电流 I');
    checkPositive(rVal, '电阻 R');
  } else if (target === 'R') {
    // Resistance R target: calculate R from U and I
    checkPositive(uVal, '电压 U');
    checkPositive(iVal, '电流 I');
  } else if (target === 'P') {
    // Power P target: calculate P from U and I
    checkPositive(uVal, '电压 U');
    checkPositive(iVal, '电流 I');
  }

  if (validationErrors.length > 0) {
    return {
      isValid: false,
      errorMessage: validationErrors[0],
      u_volts: 0,
      i_amps: 0,
      r_ohms: 0,
      p_watts: 0,
      u_display: uVal,
      u_unit: uUnit,
      i_display: iVal,
      i_unit: iUnit,
      r_display: rVal,
      r_unit: rUnit,
      p_display: pVal,
      p_unit: pUnit,
      target,
      steps: [],
      verification: {
        p_from_ui: 0,
        p_from_i2r: 0,
        p_from_u2r: 0,
        u_from_ir: 0,
        maxResidual: 1,
        isConsistent: false,
      },
    };
  }

  // 1. Step 1: Known parameters & SI Unit Standardisation
  const formatValWithUnit = (val: number, unitSym: string) =>
    `${formatWithPrecision(val, precision)} ${getUnitSymbol(unitSym)}`;

  if (target === 'I') {
    steps.push({
      title: '步骤 1：单位换算与已知量提取',
      formulaStr: 'SI基准单位规整',
      substitutionStr: `电压 U = ${formatValWithUnit(uVal, uUnit)} => ${u_si} V | 电阻 R = ${formatValWithUnit(rVal, rUnit)} => ${r_si} Ω`,
      resultStr: '已知 U 与 R',
    });

    // Calculate I = U / R
    i_si = u_si / r_si;
    p_si = u_si * i_si; // Also calculate Power

    steps.push({
      title: '步骤 2：电流计算公式代入',
      formulaStr: 'I = U / R',
      substitutionStr: `I = ${u_si} V / ${r_si} Ω`,
      resultStr: `I = ${formatWithPrecision(i_si, precision)} A`,
    });

    steps.push({
      title: '步骤 3：消耗功率同步推导',
      formulaStr: 'P = U × I',
      substitutionStr: `P = ${u_si} V × ${formatWithPrecision(i_si, precision)} A`,
      resultStr: `P = ${formatWithPrecision(p_si, precision)} W`,
    });
  } else if (target === 'U') {
    steps.push({
      title: '步骤 1：单位换算与已知量提取',
      formulaStr: 'SI基准单位规整',
      substitutionStr: `电流 I = ${formatValWithUnit(iVal, iUnit)} => ${i_si} A | 电阻 R = ${formatValWithUnit(rVal, rUnit)} => ${r_si} Ω`,
      resultStr: '已知 I 与 R',
    });

    // Calculate U = I * R
    u_si = i_si * r_si;
    p_si = u_si * i_si;

    steps.push({
      title: '步骤 2：电压计算公式代入',
      formulaStr: 'U = I × R',
      substitutionStr: `U = ${i_si} A × ${r_si} Ω`,
      resultStr: `U = ${formatWithPrecision(u_si, precision)} V`,
    });

    steps.push({
      title: '步骤 3：消耗功率同步推导',
      formulaStr: 'P = U × I',
      substitutionStr: `P = ${formatWithPrecision(u_si, precision)} V × ${i_si} A`,
      resultStr: `P = ${formatWithPrecision(p_si, precision)} W`,
    });
  } else if (target === 'R') {
    steps.push({
      title: '步骤 1：单位换算与已知量提取',
      formulaStr: 'SI基准单位规整',
      substitutionStr: `电压 U = ${formatValWithUnit(uVal, uUnit)} => ${u_si} V | 电流 I = ${formatValWithUnit(iVal, iUnit)} => ${i_si} A`,
      resultStr: '已知 U 与 I',
    });

    // Calculate R = U / I
    r_si = u_si / i_si;
    p_si = u_si * i_si;

    steps.push({
      title: '步骤 2：电阻计算公式代入',
      formulaStr: 'R = U / I',
      substitutionStr: `R = ${u_si} V / ${i_si} A`,
      resultStr: `R = ${formatWithPrecision(r_si, precision)} Ω`,
    });

    steps.push({
      title: '步骤 3：消耗功率同步推导',
      formulaStr: 'P = U × I',
      substitutionStr: `P = ${u_si} V × ${i_si} A`,
      resultStr: `P = ${formatWithPrecision(p_si, precision)} W`,
    });
  } else if (target === 'P') {
    steps.push({
      title: '步骤 1：单位换算与已知量提取',
      formulaStr: 'SI基准单位规整',
      substitutionStr: `电压 U = ${formatValWithUnit(uVal, uUnit)} => ${u_si} V | 电流 I = ${formatValWithUnit(iVal, iUnit)} => ${i_si} A`,
      resultStr: '已知 U 与 I',
    });

    // Calculate P = U * I and R = U / I
    p_si = u_si * i_si;
    r_si = u_si / i_si;

    steps.push({
      title: '步骤 2：功率计算公式代入',
      formulaStr: 'P = U × I',
      substitutionStr: `P = ${u_si} V × ${i_si} A`,
      resultStr: `P = ${formatWithPrecision(p_si, precision)} W`,
    });

    steps.push({
      title: '步骤 3：等效电阻同步推导',
      formulaStr: 'R = U / I',
      substitutionStr: `R = ${u_si} V / ${i_si} A`,
      resultStr: `R = ${formatWithPrecision(r_si, precision)} Ω`,
    });
  }

  // Calculate display values in selected display units
  const u_display = fromSI(u_si, VOLTAGE_UNITS[uUnit].multiplier);
  const i_display = fromSI(i_si, CURRENT_UNITS[iUnit].multiplier);
  const r_display = fromSI(r_si, RESISTANCE_UNITS[rUnit].multiplier);
  const p_display = fromSI(p_si, POWER_UNITS[pUnit].multiplier);

  // Requirement 8: Reverse Verification / Self-consistency check
  // Compute P via 3 independent equations:
  const p_from_ui = u_si * i_si;
  const p_from_i2r = Math.pow(i_si, 2) * r_si;
  const p_from_u2r = Math.pow(u_si, 2) / r_si;
  const u_from_ir = i_si * r_si;

  const diff1 = Math.abs(p_from_ui - p_from_i2r);
  const diff2 = Math.abs(p_from_ui - p_from_u2r);
  const diff3 = Math.abs(u_si - u_from_ir);

  const maxResidual = Math.max(diff1, diff2, diff3);
  const isConsistent = maxResidual < 1e-7;

  steps.push({
    title: '步骤 4：反算自洽校验（物理定理互检）',
    formulaStr: 'P = U·I = I²·R = U²/R',
    substitutionStr: `P(UI)=${formatWithPrecision(p_from_ui, precision)}W | P(I²R)=${formatWithPrecision(p_from_i2r, precision)}W | P(U²/R)=${formatWithPrecision(p_from_u2r, precision)}W`,
    resultStr: isConsistent ? '✓ 校验通过：所有多重反算关系完全自洽！' : '⚠ 警告：数值偏差存在超限异常！',
  });

  return {
    isValid: true,
    u_volts: u_si,
    i_amps: i_si,
    r_ohms: r_si,
    p_watts: p_si,
    u_display,
    u_unit: uUnit,
    i_display,
    i_unit: iUnit,
    r_display,
    r_unit: rUnit,
    p_display,
    p_unit: pUnit,
    target,
    steps,
    verification: {
      p_from_ui,
      p_from_i2r,
      p_from_u2r,
      u_from_ir,
      maxResidual,
      isConsistent,
    },
  };
}
