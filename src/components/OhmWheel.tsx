/**
 * Interactive Ohm's Law and Power Wheel (经典欧姆定律电功率圆盘).
 * Styled in FormulaCalcKit signature aesthetic with 12 clickable interactive formulas.
 */
import React, { useState } from 'react';
import { Info, Check } from 'lucide-react';
import { formatValue } from '../utils/formulas';

export interface FormulaSector {
  id: string;
  quadrant: 'U' | 'R' | 'P' | 'I';
  targetSymbol: string;
  targetNameZh: string;
  targetNameEn: string;
  formulaDisplay: string;
  latex: string;
  inputs: [string, string];
  inputNamesZh: [string, string];
  inputNamesEn: [string, string];
  inputUnits: [string, string];
  calculate: (val1: number, val2: number) => number;
  explanationZh: string;
  explanationEn: string;
  applicationZh: string;
  applicationEn: string;
  startAngle: number;
  endAngle: number;
  fillColor: string;
  hoverColor: string;
}

export const FORMULA_SECTORS: FormulaSector[] = [
  // Voltage (Top-Left quadrant: 180° to 270°)
  {
    id: 'V_IR',
    quadrant: 'U',
    targetSymbol: 'U',
    targetNameZh: '电压 (Voltage)',
    targetNameEn: 'Voltage (U)',
    formulaDisplay: 'U = I × R',
    latex: 'U = I \\cdot R',
    inputs: ['I', 'R'],
    inputNamesZh: ['电流 I', '电阻 R'],
    inputNamesEn: ['Current I', 'Resistance R'],
    inputUnits: ['A', 'Ω'],
    calculate: (i, r) => i * r,
    explanationZh: '欧姆定律基本变形：电流流过导体时产生的电位降，与电流和电阻成正比。',
    explanationEn: 'Basic Ohm’s Law: Voltage drop across a conductor is proportional to current and resistance.',
    applicationZh: '用于计算电阻两端分压、导线压降损失或晶体管偏置电路。',
    applicationEn: 'Used for voltage divider drops, trace wire losses, and transistor biasing.',
    startAngle: 180,
    endAngle: 210,
    fillColor: '#fef3c7',
    hoverColor: '#fde68a',
  },
  {
    id: 'V_PI',
    quadrant: 'U',
    targetSymbol: 'U',
    targetNameZh: '电压 (Voltage)',
    targetNameEn: 'Voltage (U)',
    formulaDisplay: 'U = P / I',
    latex: 'U = \\frac{P}{I}',
    inputs: ['P', 'I'],
    inputNamesZh: ['功率 P', '电流 I'],
    inputNamesEn: ['Power P', 'Current I'],
    inputUnits: ['W', 'A'],
    calculate: (p, i) => (i > 0 ? p / i : 0),
    explanationZh: '功率定义式变形：已知负载电功率和电流，推导其两端所需维持的供电电压。',
    explanationEn: 'Power rearranged: Given power and operating current, determines the required supply voltage.',
    applicationZh: '电池放电监测、工业电机输入电压核查。',
    applicationEn: 'Battery discharge monitoring and industrial motor voltage verification.',
    startAngle: 210,
    endAngle: 240,
    fillColor: '#fde68a',
    hoverColor: '#fcd34d',
  },
  {
    id: 'V_sqrtPR',
    quadrant: 'U',
    targetSymbol: 'U',
    targetNameZh: '电压 (Voltage)',
    targetNameEn: 'Voltage (U)',
    formulaDisplay: 'U = √(P × R)',
    latex: 'U = \\sqrt{P \\cdot R}',
    inputs: ['P', 'R'],
    inputNamesZh: ['功率 P', '电阻 R'],
    inputNamesEn: ['Power P', 'Resistance R'],
    inputUnits: ['W', 'Ω'],
    calculate: (p, r) => Math.sqrt(p * r),
    explanationZh: '耐压极限公式：计算指定阻值电阻在额定功率下所能承受的最大安全工作电压。',
    applicationEn: 'Maximum safe voltage allowed across a resistor before exceeding rated wattage.',
    applicationZh: '高压分压电阻选型、电阻元件耐压与额定功率验算。',
    explanationEn: 'Resistor withstand limit derived by combining P = U²/R with square root.',
    startAngle: 240,
    endAngle: 270,
    fillColor: '#fcd34d',
    hoverColor: '#fbbf24',
  },

  // Resistance (Top-Right quadrant: 270° to 360°)
  {
    id: 'R_VI',
    quadrant: 'R',
    targetSymbol: 'R',
    targetNameZh: '电阻 (Resistance)',
    targetNameEn: 'Resistance (R)',
    formulaDisplay: 'R = U / I',
    latex: 'R = \\frac{U}{I}',
    inputs: ['U', 'I'],
    inputNamesZh: ['电压 U', '电流 I'],
    inputNamesEn: ['Voltage U', 'Current I'],
    inputUnits: ['V', 'A'],
    calculate: (u, i) => (i > 0 ? u / i : 0),
    explanationZh: '电阻欧姆定义式：伏安法测电阻核心公式，通过测定电压与电流比值求阻抗。',
    explanationEn: 'Core volt-ampere method definition: resistance equals voltage divided by current.',
    applicationZh: '电桥测量、直流电阻标定、万用表电阻档测量原理。',
    applicationEn: 'Bridge measurement, DC resistor calibration, multimeter ohm range principle.',
    startAngle: 270,
    endAngle: 300,
    fillColor: '#d1fae5',
    hoverColor: '#a7f3d0',
  },
  {
    id: 'R_V2P',
    quadrant: 'R',
    targetSymbol: 'R',
    targetNameZh: '电阻 (Resistance)',
    targetNameEn: 'Resistance (R)',
    formulaDisplay: 'R = U² / P',
    latex: 'R = \\frac{U^2}{P}',
    inputs: ['U', 'P'],
    inputNamesZh: ['电压 U', '功率 P'],
    inputNamesEn: ['Voltage U', 'Power P'],
    inputUnits: ['V', 'W'],
    calculate: (u, p) => (p > 0 ? (u * u) / p : 0),
    explanationZh: '恒压特性公式：从用电器铭牌标称电压和额定功率，反求电器工作时的等效阻抗。',
    explanationEn: 'Nameplate impedance: Calculates equivalent resistance from rated voltage and power.',
    applicationZh: '家用电器（电饭煲、电暖器）热阻计算，电网固定电压负荷估算。',
    applicationEn: 'Household appliances (heaters, irons) equivalent hot resistance.',
    startAngle: 300,
    endAngle: 330,
    fillColor: '#a7f3d0',
    hoverColor: '#6ee7b7',
  },
  {
    id: 'R_PI2',
    quadrant: 'R',
    targetSymbol: 'R',
    targetNameZh: '电阻 (Resistance)',
    targetNameEn: 'Resistance (R)',
    formulaDisplay: 'R = P / I²',
    latex: 'R = \\frac{P}{I^2}',
    inputs: ['P', 'I'],
    inputNamesZh: ['功率 P', '电流 I'],
    inputNamesEn: ['Power P', 'Current I'],
    inputUnits: ['W', 'A'],
    calculate: (p, i) => (i > 0 ? p / (i * i) : 0),
    explanationZh: '发热阻抗公式：由发热损耗功率和通过电流，计算产生焦耳热的导体内部电阻。',
    explanationEn: 'Joule dissipation formula: resistance deduced from thermal power and current squared.',
    applicationZh: '高频集肤效应等效交流电阻推算、变压器绕组铜损分析。',
    applicationEn: 'High-frequency skin effect AC resistance and transformer winding copper loss.',
    startAngle: 330,
    endAngle: 360,
    fillColor: '#6ee7b7',
    hoverColor: '#34d399',
  },

  // Power (Bottom-Right quadrant: 0° to 90°)
  {
    id: 'P_VI',
    quadrant: 'P',
    targetSymbol: 'P',
    targetNameZh: '电功率 (Power)',
    targetNameEn: 'Electric Power (P)',
    formulaDisplay: 'P = U × I',
    latex: 'P = U \\cdot I',
    inputs: ['U', 'I'],
    inputNamesZh: ['电压 U', '电流 I'],
    inputNamesEn: ['Voltage U', 'Current I'],
    inputUnits: ['V', 'A'],
    calculate: (u, i) => u * i,
    explanationZh: '电功率普适定义：电流所做的总功与时间的比值，等于电压与电流的乘积。',
    explanationEn: 'Universal power definition: work done per unit time, product of voltage and current.',
    applicationZh: '直流供电总功率、电能表计量核心算法、功率放大器电源设计。',
    applicationEn: 'DC power metering, smart energy meter algorithms, amplifier power supplies.',
    startAngle: 0,
    endAngle: 30,
    fillColor: '#ffe4e6',
    hoverColor: '#fecdd3',
  },
  {
    id: 'P_I2R',
    quadrant: 'P',
    targetSymbol: 'P',
    targetNameZh: '电功率 (Power)',
    targetNameEn: 'Electric Power (P)',
    formulaDisplay: 'P = I² × R',
    latex: 'P = I^2 \\cdot R',
    inputs: ['I', 'R'],
    inputNamesZh: ['电流 I', '电阻 R'],
    inputNamesEn: ['Current I', 'Resistance R'],
    inputUnits: ['A', 'Ω'],
    calculate: (i, r) => i * i * r,
    explanationZh: '焦耳热功率公式：说明电流发热功率与电流的平方成正比。',
    explanationEn: 'Joule heat formula: thermal dissipation is proportional to the square of current.',
    applicationZh: '特高压输电线路高压低流减损原则的理论基础、保险丝熔断计算。',
    applicationEn: 'Grid ultra-high-voltage transmission loss reduction theory and fuse melting.',
    startAngle: 30,
    endAngle: 60,
    fillColor: '#fecdd3',
    hoverColor: '#fda4af',
  },
  {
    id: 'P_V2R',
    quadrant: 'P',
    targetSymbol: 'P',
    targetNameZh: '电功率 (Power)',
    targetNameEn: 'Electric Power (P)',
    formulaDisplay: 'P = U² / R',
    latex: 'P = \\frac{U^2}{R}',
    inputs: ['U', 'R'],
    inputNamesZh: ['电压 U', '电阻 R'],
    inputNamesEn: ['Voltage U', 'Resistance R'],
    inputUnits: ['V', 'Ω'],
    calculate: (u, r) => (r > 0 ? (u * u) / r : 0),
    explanationZh: '恒压功率公式：恒定电压下负载消耗的电功率与负载电阻成反比。',
    explanationEn: 'Constant voltage power: Power dissipated is inversely proportional to resistance.',
    applicationZh: '电热丝分档调节（并联减小总电阻增加功率）、灯泡调光分析。',
    applicationEn: 'Multi-stage heating gear switching and bulb dimmer calculations.',
    startAngle: 60,
    endAngle: 90,
    fillColor: '#fda4af',
    hoverColor: '#fb7185',
  },

  // Current (Bottom-Left quadrant: 90° to 180°)
  {
    id: 'I_VR',
    quadrant: 'I',
    targetSymbol: 'I',
    targetNameZh: '电流 (Current)',
    targetNameEn: 'Current (I)',
    formulaDisplay: 'I = U / R',
    latex: 'I = \\frac{U}{R}',
    inputs: ['U', 'R'],
    inputNamesZh: ['电压 U', '电阻 R'],
    inputNamesEn: ['Voltage U', 'Resistance R'],
    inputUnits: ['V', 'Ω'],
    calculate: (u, r) => (r > 0 ? u / r : 0),
    explanationZh: '欧姆定律基本式：导体中电流与施加电压成正比，与阻力电阻成反比。',
    explanationEn: 'Ohm’s fundamental law: current is proportional to voltage and inversely to resistance.',
    applicationZh: '限流电阻计算、LED驱动限流阻值匹配、电路过载保护阈值设定。',
    applicationEn: 'Current limiting resistors, LED bias design, and overload thresholds.',
    startAngle: 90,
    endAngle: 120,
    fillColor: '#e0f2fe',
    hoverColor: '#bae6fd',
  },
  {
    id: 'I_PU',
    quadrant: 'I',
    targetSymbol: 'I',
    targetNameZh: '电流 (Current)',
    targetNameEn: 'Current (I)',
    formulaDisplay: 'I = P / U',
    latex: 'I = \\frac{P}{U}',
    inputs: ['P', 'U'],
    inputNamesZh: ['功率 P', '电压 U'],
    inputNamesEn: ['Power P', 'Current I'],
    inputUnits: ['W', 'V'],
    calculate: (p, u) => (u > 0 ? p / u : 0),
    explanationZh: '电负荷电流公式：在已知供电电压下，由总功率计算主干线路所需承载的电流。',
    explanationEn: 'Circuit load current: determines line current based on total watts at specified voltage.',
    applicationZh: '空气开关容量选取（如3000W热水器 / 220V ≈ 13.6A，选16A空开）。',
    applicationEn: 'Breaker ampacity sizing (e.g., 3000W heater / 220V ≈ 13.6A, choose 16A breaker).',
    startAngle: 120,
    endAngle: 150,
    fillColor: '#bae6fd',
    hoverColor: '#7dd3fc',
  },
  {
    id: 'I_sqrtPR',
    quadrant: 'I',
    targetSymbol: 'I',
    targetNameZh: '电流 (Current)',
    targetNameEn: 'Current (I)',
    formulaDisplay: 'I = √(P / R)',
    latex: 'I = \\sqrt{\\frac{P}{R}}',
    inputs: ['P', 'R'],
    inputNamesZh: ['功率 P', '电阻 R'],
    inputNamesEn: ['Power P', 'Resistance R'],
    inputUnits: ['W', 'Ω'],
    calculate: (p, r) => (r > 0 ? Math.sqrt(p / r) : 0),
    explanationZh: '电阻安全电流极限：电阻器在达到标称允许额定功率前所允许通过的最大电流。',
    explanationEn: 'Max current rating for a resistor before dissipating more than its power rating.',
    applicationZh: '大功率贴片电阻与水泥电阻安全工作区 (SOA) 边界校验。',
    applicationEn: 'Safe operating area (SOA) boundary check for SMD and cement power resistors.',
    startAngle: 150,
    endAngle: 180,
    fillColor: '#7dd3fc',
    hoverColor: '#38bdf8',
  },
];

function describeArc(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;

  const x1 = x + outerRadius * Math.cos(startRad);
  const y1 = y + outerRadius * Math.sin(startRad);
  const x2 = x + outerRadius * Math.cos(endRad);
  const y2 = y + outerRadius * Math.sin(endRad);

  const x3 = x + innerRadius * Math.cos(endRad);
  const y3 = y + innerRadius * Math.sin(endRad);
  const x4 = x + innerRadius * Math.cos(startRad);
  const y4 = y + innerRadius * Math.sin(startRad);

  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${x1} ${y1}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L ${x3} ${y3}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
    'Z',
  ].join(' ');
}

export const OhmWheel: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [selectedId, setSelectedId] = useState<string>('V_IR');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeSector =
    FORMULA_SECTORS.find((s) => s.id === (hoveredId || selectedId)) || FORMULA_SECTORS[0];

  const [val1, setVal1] = useState<string>('2');
  const [val2, setVal2] = useState<string>('110');

  const num1 = parseFloat(val1) || 0;
  const num2 = parseFloat(val2) || 0;
  const calculatedResult = activeSector.calculate(num1, num2);

  const cx = 250;
  const cy = 250;
  const outerR = 230;
  const innerR = 100;

  return (
    <section id="wheel" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          <span>{lang === 'zh' ? '经典电学圆盘 · 12 大公式全景' : "OHM'S LAW WHEEL · 12 CORE FORMULAS"}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {lang === 'zh' ? '欧姆定律与电功率交互式推导圆盘' : "Interactive Ohm's Law & Power Wheel"}
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {lang === 'zh'
            ? '圆盘将电学四大核心物理量划分为四个象限，每个象限包含 3 个推导公式，共 12 种计算组合。点击任意扇区，即时查看物理本质、工程应用及数值试算。'
            : 'The Ohm’s wheel organizes the 4 fundamental electrical variables into 4 quadrants with 12 classic formula slices. Click any sector to view derivations and test numbers.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Wheel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center">
          <div className="w-full max-w-[480px] aspect-square relative select-none">
            <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-sm overflow-visible">
              {/* Slices */}
              {FORMULA_SECTORS.map((sector) => {
                const isSelected = selectedId === sector.id;
                const isHovered = hoveredId === sector.id;
                const pathData = describeArc(cx, cy, innerR, outerR, sector.startAngle, sector.endAngle);

                const midAngle = ((sector.startAngle + sector.endAngle) / 2 - 90) * (Math.PI / 180);
                const textR = (innerR + outerR) / 2;
                const textX = cx + textR * Math.cos(midAngle);
                const textY = cy + textR * Math.sin(midAngle);

                return (
                  <g
                    key={sector.id}
                    onClick={() => setSelectedId(sector.id)}
                    onMouseEnter={() => setHoveredId(sector.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="cursor-pointer transition-all duration-150"
                  >
                    <path
                      d={pathData}
                      fill={isHovered || isSelected ? sector.hoverColor : sector.fillColor}
                      stroke={isSelected ? '#4f46e5' : '#e2e8f0'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-colors duration-150"
                    />

                    {/* Formula text inside slice */}
                    <text
                      x={textX}
                      y={textY}
                      fill="#0f172a"
                      fontSize="13"
                      fontWeight="700"
                      fontFamily="JetBrains Mono, monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${
                        (sector.startAngle + sector.endAngle) / 2 > 90 &&
                        (sector.startAngle + sector.endAngle) / 2 < 270
                          ? ((sector.startAngle + sector.endAngle) / 2) + 180
                          : (sector.startAngle + sector.endAngle) / 2
                      }, ${textX}, ${textY})`}
                      className="pointer-events-none select-none font-mono"
                    >
                      {sector.formulaDisplay.split('=')[1]?.trim() || sector.formulaDisplay}
                    </text>
                  </g>
                );
              })}

              {/* Central Hub */}
              <circle cx={cx} cy={cy} r={innerR} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
              <line x1={cx - innerR} y1={cy} x2={cx + innerR} y2={cy} stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1={cx} y1={cy - innerR} x2={cx} y2={cy + innerR} stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Quadrant Big Labels */}
              <text
                x={cx - 45}
                y={cy - 45}
                fill="#b45309"
                fontSize="22"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                U (V)
              </text>
              <text
                x={cx + 45}
                y={cy - 45}
                fill="#059669"
                fontSize="22"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                R (Ω)
              </text>
              <text
                x={cx + 45}
                y={cy + 45}
                fill="#e11d48"
                fontSize="22"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                P (W)
              </text>
              <text
                x={cx - 45}
                y={cy + 45}
                fill="#0284c7"
                fontSize="22"
                fontWeight="800"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                I (A)
              </text>

              {/* Center Icon badge */}
              <circle cx={cx} cy={cy} r={26} fill="#4f46e5" stroke="#ffffff" strokeWidth="3" />
              <text
                x={cx}
                y={cy + 1}
                fill="#ffffff"
                fontSize="18"
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                Ω
              </text>
            </svg>
          </div>

          <div className="mt-4 text-xs text-slate-500 text-center flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>
              {lang === 'zh'
                ? '点击圆盘任意扇区，右侧面板即刻调取物理推导与即时试算'
                : 'Click any sector slice to examine formulas and calculate live.'}
            </span>
          </div>
        </div>

        {/* Selected Formula Breakdown Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold">
                {lang === 'zh' ? '当前选中公式' : 'Selected Formula'}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {lang === 'zh' ? activeSector.targetNameZh : activeSector.targetNameEn}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Quadrant [{activeSector.quadrant}]
            </span>
          </div>

          {/* Big Formula Display Box */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-center space-y-1">
            <div className="text-xs text-slate-500 font-mono">
              {lang === 'zh' ? '数学代数关系式' : 'Algebraic Expression'}
            </div>
            <div className="text-3xl font-extrabold text-indigo-700 font-mono tracking-wider">
              {activeSector.formulaDisplay}
            </div>
            <div className="text-xs text-slate-600 pt-1 font-medium">
              {lang === 'zh' ? `求解目标: ${activeSector.targetNameZh}` : `Target: ${activeSector.targetNameEn}`}
            </div>
          </div>

          {/* Explanation & Application */}
          <div className="space-y-3 text-xs">
            <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'zh' ? '物理本质与推导逻辑' : 'Physics Derivation & Mechanism'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'zh' ? activeSector.explanationZh : activeSector.explanationEn}
              </p>
            </div>

            <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'zh' ? '典型工程与实验场景' : 'Typical Engineering Applications'}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {lang === 'zh' ? activeSector.applicationZh : activeSector.applicationEn}
              </p>
            </div>
          </div>

          {/* Mini Interactive Calculator for this selected formula */}
          <div className="bg-indigo-50/40 rounded-xl p-4 border border-indigo-100 space-y-3">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>{lang === 'zh' ? '该公式独立试算台' : 'Live Formula Sandbox'}</span>
              <span className="text-[11px] font-mono text-indigo-700 font-semibold">
                {lang === 'zh' ? '实时即算' : 'Instant'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-mono">
                  {lang === 'zh' ? activeSector.inputNamesZh[0] : activeSector.inputNamesEn[0]} ({activeSector.inputUnits[0]})
                </label>
                <input
                  type="number"
                  value={val1}
                  onChange={(e) => setVal1(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-mono">
                  {lang === 'zh' ? activeSector.inputNamesZh[1] : activeSector.inputNamesEn[1]} ({activeSector.inputUnits[1]})
                </label>
                <input
                  type="number"
                  value={val2}
                  onChange={(e) => setVal2(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-indigo-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                {lang === 'zh' ? '计算结果' : 'Result'} ({activeSector.targetSymbol}):
              </span>
              <span className="text-base font-mono font-bold text-indigo-700">
                {formatValue(calculatedResult)} {activeSector.quadrant === 'U' ? 'V' : activeSector.quadrant === 'R' ? 'Ω' : activeSector.quadrant === 'P' ? 'W' : 'A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
