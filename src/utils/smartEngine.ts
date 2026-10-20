/**
 * Smart Electrical Engineering and Physics Intelligence Engine.
 * Provides natural language parsing, wire gauge sizing, fuse recommendations,
 * battery runtime estimation, LED current-limiting resistor design, and circuit diagnosis.
 */

export interface SmartWireRecommendation {
  gaugeAWG: string;
  crossSectionMm2: number;
  maxSafeCurrent: number;
  note: string;
}

export interface SmartDiagnosticsResult {
  healthScore: number; // 0 - 100
  riskLevel: 'safe' | 'warning' | 'danger';
  title: string;
  diagnoses: Array<{
    type: 'wire' | 'fuse' | 'resistor' | 'battery' | 'safety' | 'temperature';
    level: 'info' | 'warning' | 'alert';
    title: string;
    detail: string;
    actionableAdvice: string;
  }>;
  recommendedWire: SmartWireRecommendation;
  recommendedFuseRating: number; // in Amperes
  recommendedResistorWattage: number; // in Watts
  batteryRuntimeEstimate?: {
    capacityMah: number;
    hours: number;
    days: number;
  };
}

export interface ParsedQuery {
  voltage?: number;
  voltageUnit?: string;
  current?: number;
  currentUnit?: string;
  resistance?: number;
  resistanceUnit?: string;
  power?: number;
  powerUnit?: string;
  recognizedScenario?: string;
  confidence: number;
}

/**
 * Intelligent wire sizing table according to national copper cable ampacity standards (ambient 30°C).
 */
export const WIRE_STANDARD_TABLE: SmartWireRecommendation[] = [
  { gaugeAWG: 'AWG 24', crossSectionMm2: 0.2, maxSafeCurrent: 2.0, note: '适合微电流信号线、传感器接口' },
  { gaugeAWG: 'AWG 20', crossSectionMm2: 0.5, maxSafeCurrent: 5.0, note: '适合弱电控制箱、LED灯带供电' },
  { gaugeAWG: 'AWG 18', crossSectionMm2: 0.75, maxSafeCurrent: 8.0, note: '适合小型台灯、手机充电器线缆' },
  { gaugeAWG: 'AWG 17', crossSectionMm2: 1.0, maxSafeCurrent: 12.0, note: '普通照明支路、微型用电设备' },
  { gaugeAWG: 'AWG 15', crossSectionMm2: 1.5, maxSafeCurrent: 16.0, note: '家庭 10A 普通插座与照明回路标准铜线' },
  { gaugeAWG: 'AWG 13', crossSectionMm2: 2.5, maxSafeCurrent: 25.0, note: '家庭 16A 空调插座、微波炉、电热水器回路标准铜线' },
  { gaugeAWG: 'AWG 11', crossSectionMm2: 4.0, maxSafeCurrent: 35.0, note: '大功率即热电热水器、中央空调主机' },
  { gaugeAWG: 'AWG 9', crossSectionMm2: 6.0, maxSafeCurrent: 48.0, note: '入户总进线、商业厨房重载设备' },
  { gaugeAWG: 'AWG 7', crossSectionMm2: 10.0, maxSafeCurrent: 65.0, note: '别墅主干进线、电动汽车充电桩 (7kW/11kW)' },
];

/**
 * Recommend the safest copper wire gauge for a given current.
 */
export function recommendWireForCurrent(currentA: number): SmartWireRecommendation {
  const safeTarget = currentA * 1.25; // 125% continuous load safety margin
  for (const wire of WIRE_STANDARD_TABLE) {
    if (wire.maxSafeCurrent >= safeTarget) {
      return wire;
    }
  }
  return WIRE_STANDARD_TABLE[WIRE_STANDARD_TABLE.length - 1];
}

/**
 * Standard MCB (Miniature Circuit Breaker) ratings: 6A, 10A, 16A, 20A, 25A, 32A, 40A, 50A, 63A.
 */
export function recommendBreakerRating(currentA: number): number {
  const standardRatings = [6, 10, 16, 20, 25, 32, 40, 50, 63];
  const target = currentA * 1.25;
  for (const r of standardRatings) {
    if (r >= target) {
      return r;
    }
  }
  return 63;
}

/**
 * Recommend standard power rating for resistors (50% derating rule).
 */
export function recommendResistorWattage(dissipatedWatts: number): number {
  const standardRatings = [0.125, 0.25, 0.5, 1, 2, 3, 5, 10, 25, 50];
  const target = dissipatedWatts * 2; // 50% derating for thermal longevity
  for (const w of standardRatings) {
    if (w >= target) {
      return w;
    }
  }
  return Math.ceil(target);
}

/**
 * Full Circuit Diagnostics: inspects voltage, current, resistance, power
 * and outputs intelligent advice, safety score, wire recommendation, breaker size, etc.
 */
export function diagnoseCircuit(
  v: number | null,
  i: number | null,
  r: number | null,
  p: number | null,
  batteryMah: number = 2600
): SmartDiagnosticsResult {
  const diagnoses: SmartDiagnosticsResult['diagnoses'] = [];
  let score = 100;

  const currentA = i ?? (v && r ? v / r : null) ?? (p && v ? p / v : 0);
  const voltageV = v ?? (i && r ? i * r : null) ?? (p && i ? p / i : 0);
  const resistanceOhm = r ?? (v && i ? v / i : null) ?? (p && i ? p / (i * i) : 0);
  const powerW = p ?? (v && i ? v * i : null) ?? (i && r ? i * i * r : 0);

  // 1. Safety Extra-Low Voltage (SELV) check
  if (voltageV > 36) {
    score -= 15;
    diagnoses.push({
      type: 'safety',
      level: voltageV > 120 ? 'alert' : 'warning',
      title: voltageV > 120 ? '高压触电严重隐患 (SELV Exceeded)' : '超过安全特低电压 (SELV > 36V)',
      detail: `当前端电压为 ${voltageV.toFixed(1)}V。我国国家标准 GB/T 3805-2008 规定干燥环境中人体持续接触安全电压为 ≤36V，潮湿环境中 ≤24V。`,
      actionableAdvice: '请配置绝缘隔离手套、防护外壳或加装漏电保护器 (RCD 30mA)。严禁带电检修！',
    });
  } else {
    diagnoses.push({
      type: 'safety',
      level: 'info',
      title: '电压处于人体安全低压范围',
      detail: `当前电压 ${voltageV.toFixed(1)}V 严格处于安全特低电压 (SELV ≤ 36V) 内，无直接触电生命危险。`,
      actionableAdvice: '常规电子元器件实验与教学可放心安全测试。',
    });
  }

  // 2. Short Circuit / Ultra-Low Resistance Alert
  if (resistanceOhm > 0 && resistanceOhm < 0.1 && voltageV > 1) {
    score -= 30;
    diagnoses.push({
      type: 'resistor',
      level: 'alert',
      title: '死区短路危险 (Dead Short Risk)',
      detail: `回路阻抗极低 (${resistanceOhm.toFixed(3)} Ω)，极易导致电源过载跳闸、电池短路起火或主控芯片击穿。`,
      actionableAdvice: '必须在主回路中串联限流电阻或自恢复保险丝 (PTC)，严禁直接短接正负极。',
    });
  }

  // 3. Open Circuit / Gigantic Resistance Check
  if (resistanceOhm >= 1e6) {
    diagnoses.push({
      type: 'resistor',
      level: 'info',
      title: '高阻抗微电流工作区 (High-Z State)',
      detail: `电阻阻值达到兆欧级 (${(resistanceOhm / 1e6).toFixed(2)} MΩ)，回路电流极其微弱 (微安级)。`,
      actionableAdvice: '适合作为 CMOS 极高输入阻抗偏置、弱信号放大或绝缘监测回路，但抗工频干扰能力较弱。',
    });
  }

  // 4. Overload and High Thermal Dissipation
  if (powerW > 2000) {
    score -= 20;
    diagnoses.push({
      type: 'wire',
      level: 'warning',
      title: '大功率重负荷发热预警 (High Power Dissipation)',
      detail: `总电能转换速率达到 ${powerW.toFixed(0)} W (≥ 2kW)，焦耳热 Q = I²Rt 发散量巨大。`,
      actionableAdvice: '需配置铝合金散热片或强制风冷，插头必须选用 16A 专线插座，杜绝使用老旧排插串接。',
    });
  }

  // 5. Wire sizing recommendation
  const wireRec = recommendWireForCurrent(currentA);
  diagnoses.push({
    type: 'wire',
    level: 'info',
    title: `推荐铜芯导线: ${wireRec.crossSectionMm2} mm² (${wireRec.gaugeAWG})`,
    detail: `在持续工作电流 ${currentA.toFixed(2)} A 下，按 125% 裕量核算，该导线最大安全载流可达 ${wireRec.maxSafeCurrent} A。`,
    actionableAdvice: `${wireRec.note}，压降小且温升远低于 PVC 护套绝缘老化极限 (70°C)。`,
  });

  // 6. Fuse / Breaker sizing
  const fuseAmp = recommendBreakerRating(currentA);
  diagnoses.push({
    type: 'fuse',
    level: 'info',
    title: `推荐保护空开/保险丝: ${fuseAmp} A`,
    detail: `根据电器启动浪涌与短路分断规范，选用标准 ${fuseAmp}A 空开 (如 C${fuseAmp})，兼顾正常运转与过载保护。`,
    actionableAdvice: '电机与感性负载建议选用 D 型脱扣特性空开；纯电阻加热负载选用 C 型即可。',
  });

  // 7. Resistor wattage recommendation
  const recWatt = recommendResistorWattage(powerW);

  // 8. Battery Runtime Estimation
  let batteryEstimate;
  if (currentA > 0 && batteryMah > 0) {
    const hours = (batteryMah / 1000) / currentA;
    batteryEstimate = {
      capacityMah: batteryMah,
      hours: parseFloat(hours.toFixed(2)),
      days: parseFloat((hours / 24).toFixed(2)),
    };

    diagnoses.push({
      type: 'battery',
      level: 'info',
      title: `标称 ${batteryMah} mAh 电池续航预估: ≈ ${hours < 1 ? (hours * 60).toFixed(1) + ' 分钟' : hours.toFixed(1) + ' 小时'}`,
      detail: `在恒定放电电流 ${(currentA * 1000).toFixed(1)} mA 下，该电池约可持续供电 ${(hours / 24).toFixed(1)} 天。`,
      actionableAdvice: '锂电池放电截止电压通常为 3.0V，建议搭配带欠压保护 (UVLO) 的电源管理芯片。',
    });
  }

  const riskLevel = score < 60 ? 'danger' : score < 85 ? 'warning' : 'safe';
  const title =
    riskLevel === 'safe'
      ? '电路健康度优良 · 各项电气参数处于安全标称范围'
      : riskLevel === 'warning'
      ? '电路存在中度工程风险 · 需关注发热选型与电压警戒'
      : '电路存在高危触电/短路隐患 · 必须立即优化整改！';

  return {
    healthScore: Math.max(score, 10),
    riskLevel,
    title,
    diagnoses,
    recommendedWire: wireRec,
    recommendedFuseRating: fuseAmp,
    recommendedResistorWattage: recWatt,
    batteryRuntimeEstimate: batteryEstimate,
  };
}

/**
 * Intelligent Natural Language Parser for Electrical Queries.
 * Examples:
 * - "220V 1000W 电水壶"
 * - "5V 2A 输出"
 * - "12V 4欧姆求电流和功率"
 * - "LED 2V 20mA"
 * - "3.7V 500mA 锂电池"
 */
export function parseNaturalLanguageQuery(text: string): ParsedQuery {
  const clean = text.trim();
  const result: ParsedQuery = { confidence: 0 };

  // Match Voltage: e.g. 220V, 5v, 3.3伏, 12伏特, 100mV, 10kV
  const vMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(v|伏特|伏|kv|mv|μv)/i);
  if (vMatch) {
    const rawVal = parseFloat(vMatch[1]);
    const rawUnit = vMatch[2].toLowerCase();
    let mult = 1;
    let unit = 'V';
    if (rawUnit.includes('k')) {
      mult = 1e3;
      unit = 'kV';
    } else if (rawUnit.includes('m') && !rawUnit.includes('mv')) {
      mult = 1;
    } else if (rawUnit.startsWith('m')) {
      mult = 1e-3;
      unit = 'mV';
    } else if (rawUnit.startsWith('μ') || rawUnit.startsWith('u')) {
      mult = 1e-6;
      unit = 'μV';
    }
    result.voltage = rawVal * mult;
    result.voltageUnit = unit;
    result.confidence += 0.35;
  }

  // Match Current: e.g. 2A, 500mA, 20毫安, 10安培, 50uA
  const iMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(a|安培|安|ma|毫安|ka|μa|ua)/i);
  if (iMatch) {
    const rawVal = parseFloat(iMatch[1]);
    const rawUnit = iMatch[2].toLowerCase();
    let mult = 1;
    let unit = 'A';
    if (rawUnit.includes('m') || rawUnit.includes('毫')) {
      mult = 1e-3;
      unit = 'mA';
    } else if (rawUnit.includes('k')) {
      mult = 1e3;
      unit = 'kA';
    } else if (rawUnit.includes('μ') || rawUnit.includes('u')) {
      mult = 1e-6;
      unit = 'μA';
    }
    result.current = rawVal * mult;
    result.currentUnit = unit;
    result.confidence += 0.35;
  }

  // Match Resistance: e.g. 100欧, 4.7k, 10kΩ, 500欧姆, 100Ω, 1MΩ
  const rMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(kΩ|mΩ|gΩ|Ω|欧姆|欧|k|m|兆欧|千欧)/i);
  if (rMatch) {
    const rawVal = parseFloat(rMatch[1]);
    const rawUnit = rMatch[2].toLowerCase();
    let mult = 1;
    let unit = 'Ω';
    if (rawUnit.includes('k') || rawUnit.includes('千')) {
      mult = 1e3;
      unit = 'kΩ';
    } else if (rawUnit.includes('m') || rawUnit.includes('兆')) {
      mult = 1e6;
      unit = 'MΩ';
    } else if (rawUnit.includes('g') || rawUnit.includes('吉')) {
      mult = 1e9;
      unit = 'GΩ';
    }
    result.resistance = rawVal * mult;
    result.resistanceUnit = unit;
    result.confidence += 0.35;
  }

  // Match Power: e.g. 1000W, 2000瓦, 65w, 3000瓦特, 2kW, 1.5马力
  const pMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(w|瓦特|瓦|kw|千瓦|mw|兆瓦|hp|马力)/i);
  if (pMatch) {
    const rawVal = parseFloat(pMatch[1]);
    const rawUnit = pMatch[2].toLowerCase();
    let mult = 1;
    let unit = 'W';
    if (rawUnit.includes('k') || rawUnit.includes('千')) {
      mult = 1e3;
      unit = 'kW';
    } else if (rawUnit.includes('m') || rawUnit.includes('兆')) {
      mult = 1e6;
      unit = 'MW';
    } else if (rawUnit.includes('hp') || rawUnit.includes('马力')) {
      mult = 745.7;
      unit = 'hp';
    }
    result.power = rawVal * mult;
    result.powerUnit = unit;
    result.confidence += 0.35;
  }

  // Common keywords recognition
  if (clean.includes('电水壶') || clean.includes('烧水')) {
    result.recognizedScenario = '大功率电热水壶';
  } else if (clean.includes('手机') || clean.includes('充电器') || clean.includes('usb')) {
    result.recognizedScenario = '手机快充电源';
  } else if (clean.includes('led') || clean.includes('发光二极管')) {
    result.recognizedScenario = 'LED指示灯限流回路';
  } else if (clean.includes('车载') || clean.includes('汽车') || clean.includes('点烟器')) {
    result.recognizedScenario = '12V 车载供电系统';
  } else if (clean.includes('空调')) {
    result.recognizedScenario = '变频冷暖空调';
  }

  return result;
}

/**
 * Smart LED / MCU Current-Limiting Resistor Calculator.
 * Input: Source Voltage Vin, Forward Voltage Vf (e.g. 2.0V), Target Current If (e.g. 20mA).
 * Output: Required Resistance R, nearest E24 resistor, dissipated wattage.
 */
export function calculateSmartLimiter(vin: number, vf: number, ifMa: number) {
  if (vin <= vf || ifMa <= 0) {
    return {
      rExact: 0,
      rE24Nearest: 0,
      powerWatt: 0,
      recommendedResistorWatt: 0.25,
      isFeasible: false,
    };
  }

  const ifAmps = ifMa / 1000;
  const vDrop = vin - vf;
  const rExact = vDrop / ifAmps;

  // Find nearest E24 series value
  const E24_BASE = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
    3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1, 10.0
  ];
  const exponent = Math.floor(Math.log10(rExact));
  const normalized = rExact / Math.pow(10, exponent);

  let bestE24 = E24_BASE[0];
  let minDiff = 999;
  for (const val of E24_BASE) {
    const diff = Math.abs(val - normalized);
    if (diff < minDiff) {
      minDiff = diff;
      bestE24 = val;
    }
  }
  const rE24Nearest = Math.round(bestE24 * Math.pow(10, exponent));
  const powerWatt = vDrop * ifAmps;
  const recommendedResistorWatt = recommendResistorWattage(powerWatt);

  return {
    rExact: parseFloat(rExact.toFixed(1)),
    rE24Nearest,
    powerWatt: parseFloat(powerWatt.toFixed(3)),
    recommendedResistorWatt,
    isFeasible: true,
  };
}
