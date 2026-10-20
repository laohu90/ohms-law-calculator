/**
 * Standard Material Resistivity (电阻率) and Conductivity Reference Table.
 * Measured at 20°C (293.15 K).
 */

export interface MaterialResistivity {
  name: string;
  nameEn: string;
  category: '良导体' | '高阻合金' | '半导体' | '绝缘体';
  resistivity: number; // in Ohm·m (Ω·m)
  tempCoeff: number; // in 1/°C (x 10^-3)
  description: string;
}

export const MATERIAL_RESISTIVITY_TABLE: MaterialResistivity[] = [
  {
    name: '银 (Silver, Ag)',
    nameEn: 'Silver',
    category: '良导体',
    resistivity: 1.59e-8,
    tempCoeff: 3.8,
    description: '室温下导电性能最优秀的金属，用于高端音频导线、射频镀银触点',
  },
  {
    name: '铜 (Copper, Cu)',
    nameEn: 'Copper',
    category: '良导体',
    resistivity: 1.68e-8,
    tempCoeff: 3.9,
    description: '工业电气与电网布线最广泛使用的导电材料，成本低、抗氧化性好',
  },
  {
    name: '金 (Gold, Au)',
    nameEn: 'Gold',
    category: '良导体',
    resistivity: 2.44e-8,
    tempCoeff: 3.4,
    description: '极高化学惰性与耐腐蚀性，芯片引线键合及高频镀金插头标准',
  },
  {
    name: '铝 (Aluminum, Al)',
    nameEn: 'Aluminum',
    category: '良导体',
    resistivity: 2.65e-8,
    tempCoeff: 3.9,
    description: '质量轻且导电率高，主要用于架空高压输电线（钢芯铝绞线）',
  },
  {
    name: '钨 (Tungsten, W)',
    nameEn: 'Tungsten',
    category: '良导体',
    resistivity: 5.60e-8,
    tempCoeff: 4.5,
    description: '熔点高达 3410℃，经典白炽灯泡灯丝与高温电极材料',
  },
  {
    name: '铁 (Iron, Fe)',
    nameEn: 'Iron',
    category: '良导体',
    resistivity: 9.71e-8,
    tempCoeff: 5.0,
    description: '机械强度高，常用于电磁铁铁芯与变压器硅钢片导磁导电',
  },
  {
    name: '铂 (Platinum, Pt)',
    nameEn: 'Platinum',
    category: '良导体',
    resistivity: 10.6e-8,
    tempCoeff: 3.92,
    description: '电阻随温度线性度极佳，PT100 高精度工业温度传感器标准材料',
  },
  {
    name: '康铜 (Constantan)',
    nameEn: 'Constantan (Cu-Ni)',
    category: '高阻合金',
    resistivity: 49.0e-8,
    tempCoeff: 0.005,
    description: '温度系数近乎为零，精密标准电阻箱与分流器核心材料',
  },
  {
    name: '镍铬合金 (Nichrome)',
    nameEn: 'Nichrome (Ni-Cr)',
    category: '高阻合金',
    resistivity: 110.0e-8,
    tempCoeff: 0.4,
    description: '高电阻率与抗高温氧化，电炉、电热丝、吹风机发热元件',
  },
  {
    name: '石墨 / 碳 (Carbon)',
    nameEn: 'Carbon (Graphite)',
    category: '半导体',
    resistivity: 3.5e-5,
    tempCoeff: -0.5,
    description: '具有负电阻温度系数（升温阻值下降），电动机碳刷与滑环',
  },
  {
    name: '本征硅 (Silicon, Si)',
    nameEn: 'Silicon',
    category: '半导体',
    resistivity: 6.4e2,
    tempCoeff: -75.0,
    description: '现代微电子芯片基底，受掺杂浓度和温度极度敏感',
  },
  {
    name: '纯水 (Pure H2O, 25°C)',
    nameEn: 'Deionized Water',
    category: '绝缘体',
    resistivity: 1.8e5,
    tempCoeff: -10.0,
    description: '去离子纯水自电离程度极微，但水中溶解微量矿物质电解质后导电剧增',
  },
  {
    name: '玻璃 (Glass)',
    nameEn: 'Glass',
    category: '绝缘体',
    resistivity: 1.0e12,
    tempCoeff: -20.0,
    description: '高压电网绝缘子，常温下阻抗极大',
  },
  {
    name: '特氟龙 / 橡胶 (PTFE / Rubber)',
    nameEn: 'PTFE / Rubber',
    category: '绝缘体',
    resistivity: 1.0e14,
    tempCoeff: 0,
    description: '极高介电强度，高压电力电缆与绝缘工具保护护套',
  },
];
