/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResistorItem {
  id: string;
  label: string;
  resistance: number; // in Ohms
  voltageDrop: number; // in Volts
  current: number; // in Amperes
  power: number; // in Watts
}

export type NetworkType = 'series' | 'parallel' | 'voltage_divider';

export interface NetworkSolution {
  networkType: NetworkType;
  totalResistance: number;
  totalCurrent: number;
  totalVoltage: number;
  totalPower: number;
  resistors: ResistorItem[];
  derivationSteps: string[];
}

/**
 * Solves series circuit network:
 * R_total = sum(R_i)
 * I_total = V_source / R_total
 * V_i = I_total * R_i
 * P_i = I_total^2 * R_i
 */
export function solveSeriesNetwork(
  sourceVoltage: number,
  resistorValues: { id: string; label: string; resistance: number }[]
): NetworkSolution {
  const totalR = resistorValues.reduce((sum, r) => sum + r.resistance, 0);
  const totalI = totalR > 0 ? sourceVoltage / totalR : 0;
  const totalP = sourceVoltage * totalI;

  const solvedResistors: ResistorItem[] = resistorValues.map((r) => {
    const vDrop = totalI * r.resistance;
    const p = totalI * totalI * r.resistance;
    return {
      id: r.id,
      label: r.label,
      resistance: r.resistance,
      voltageDrop: vDrop,
      current: totalI,
      power: p,
    };
  });

  const steps = [
    `1. Equivalent Resistance: R_total = ${resistorValues.map((r) => r.label).join(' + ')} = ${resistorValues.map((r) => `${r.resistance}Ω`).join(' + ')} = ${totalR} Ω`,
    `2. Circuit Current: I = V_total / R_total = ${sourceVoltage} V / ${totalR} Ω = ${totalI.toPrecision(6)} A`,
    `3. Individual Resistor Voltages (KVL): ${solvedResistors.map((r) => `V_${r.label} = ${r.voltageDrop.toPrecision(5)}V`).join(', ')}`,
    `4. Total Circuit Dissipation: P_total = ${totalP.toPrecision(6)} W`,
  ];

  return {
    networkType: 'series',
    totalResistance: totalR,
    totalCurrent: totalI,
    totalVoltage: sourceVoltage,
    totalPower: totalP,
    resistors: solvedResistors,
    derivationSteps: steps,
  };
}

/**
 * Solves parallel circuit network:
 * 1 / R_total = sum(1 / R_i)
 * V_i = V_source
 * I_i = V_source / R_i
 * I_total = sum(I_i)
 */
export function solveParallelNetwork(
  sourceVoltage: number,
  resistorValues: { id: string; label: string; resistance: number }[]
): NetworkSolution {
  const reciprocalSum = resistorValues.reduce((sum, r) => sum + (r.resistance > 0 ? 1 / r.resistance : 0), 0);
  const totalR = reciprocalSum > 0 ? 1 / reciprocalSum : 0;
  const totalI = totalR > 0 ? sourceVoltage / totalR : 0;
  const totalP = sourceVoltage * totalI;

  const solvedResistors: ResistorItem[] = resistorValues.map((r) => {
    const branchI = r.resistance > 0 ? sourceVoltage / r.resistance : 0;
    const p = sourceVoltage * branchI;
    return {
      id: r.id,
      label: r.label,
      resistance: r.resistance,
      voltageDrop: sourceVoltage,
      current: branchI,
      power: p,
    };
  });

  const steps = [
    `1. Equivalent Resistance: 1/R_total = ${resistorValues.map((r) => `(1/${r.resistance}Ω)`).join(' + ')} => R_total = ${totalR.toPrecision(6)} Ω`,
    `2. Total Source Current (KCL): I_total = sum(I_branches) = ${totalI.toPrecision(6)} A`,
    `3. Branch Currents: ${solvedResistors.map((r) => `I_${r.label} = ${r.current.toPrecision(5)}A`).join(', ')}`,
    `4. Total Circuit Dissipation: P_total = ${totalP.toPrecision(6)} W`,
  ];

  return {
    networkType: 'parallel',
    totalResistance: totalR,
    totalCurrent: totalI,
    totalVoltage: sourceVoltage,
    totalPower: totalP,
    resistors: solvedResistors,
    derivationSteps: steps,
  };
}

/**
 * Solves voltage divider network with optional load resistor:
 * V_out = V_in * (R2_parallel_RL / (R1 + R2_parallel_RL))
 */
export function solveVoltageDivider(
  vIn: number,
  r1: number,
  r2: number,
  rLoad: number | null
): {
  vOut: number;
  effectiveR2: number;
  totalCurrent: number;
  iR1: number;
  iR2: number;
  iLoad: number;
  derivation: string[];
} {
  let effectiveR2 = r2;
  if (rLoad !== null && rLoad > 0) {
    effectiveR2 = (r2 * rLoad) / (r2 + rLoad);
  }

  const rTotal = r1 + effectiveR2;
  const totalI = rTotal > 0 ? vIn / rTotal : 0;
  const vOut = totalI * effectiveR2;
  const iR1 = totalI;
  const iR2 = r2 > 0 ? vOut / r2 : 0;
  const iLoad = rLoad !== null && rLoad > 0 ? vOut / rLoad : 0;

  const derivation = [
    rLoad !== null
      ? `1. Loaded R2 equivalent: R2 || RL = (${r2} × ${rLoad}) / (${r2} + ${rLoad}) = ${effectiveR2.toPrecision(6)} Ω`
      : `1. Unloaded configuration: Effective lower leg resistance = ${r2} Ω`,
    `2. Total Divider Resistance: R_total = R1 + R2_eff = ${r1} + ${effectiveR2.toPrecision(5)} = ${rTotal.toPrecision(6)} Ω`,
    `3. Output Voltage: V_out = V_in × (R2_eff / R_total) = ${vIn} × (${effectiveR2.toPrecision(5)} / ${rTotal.toPrecision(5)}) = ${vOut.toPrecision(6)} V`,
    `4. Divider Current: I_div = ${iR2.toPrecision(5)} A ${rLoad ? `, Load Current: I_load = ${iLoad.toPrecision(5)} A` : ''}`,
  ];

  return {
    vOut,
    effectiveR2,
    totalCurrent: totalI,
    iR1,
    iR2,
    iLoad,
    derivation,
  };
}
