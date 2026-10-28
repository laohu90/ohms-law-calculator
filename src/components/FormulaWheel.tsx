import React, { useState } from 'react';
import { TargetParameter } from '../types/ohms';
import { PieChart, Sparkles, ArrowRight } from 'lucide-react';

interface FormulaSector {
  id: string;
  target: TargetParameter;
  formulaTex: string;
  displayFormula: string;
  label: string;
  description: string;
  color: string;
  hoverColor: string;
}

const FORMULAS: FormulaSector[] = [
  // Voltage U
  {
    id: 'u-ir',
    target: 'U',
    formulaTex: 'U = I × R',
    displayFormula: 'U = I · R',
    label: '已知电流与电阻',
    description: '基本欧姆定律：通过导体的电流与电阻成正比',
    color: '#0284c7',
    hoverColor: '#38bdf8',
  },
  {
    id: 'u-pi',
    target: 'U',
    formulaTex: 'U = P / I',
    displayFormula: 'U = P / I',
    label: '已知功率与电流',
    description: '电功率定义推导：电压等于单位电流消耗的电功率',
    color: '#0369a1',
    hoverColor: '#0ea5e9',
  },
  {
    id: 'u-pr',
    target: 'U',
    formulaTex: 'U = √(P × R)',
    displayFormula: 'U = √(P · R)',
    label: '已知功率与电阻',
    description: '结合 P = U²/R 变形，求电阻两端的降压',
    color: '#075985',
    hoverColor: '#0284c7',
  },

  // Current I
  {
    id: 'i-ur',
    target: 'I',
    formulaTex: 'I = U / R',
    displayFormula: 'I = U / R',
    label: '已知电压与电阻',
    description: '标准欧姆定律：回路电流等于电源电压除以总电阻',
    color: '#059669',
    hoverColor: '#34d399',
  },
  {
    id: 'i-pu',
    target: 'I',
    formulaTex: 'I = P / U',
    displayFormula: 'I = P / U',
    label: '已知功率与电压',
    description: '电用设备负载电流推导：工作电流等于功率除以电压',
    color: '#047857',
    hoverColor: '#10b981',
  },
  {
    id: 'i-pr',
    target: 'I',
    formulaTex: 'I = √(P / R)',
    displayFormula: 'I = √(P / R)',
    label: '已知功率与电阻',
    description: '焦耳热公式 P = I²R 变形，求通过电阻的稳态电流',
    color: '#065f46',
    hoverColor: '#059669',
  },

  // Resistance R
  {
    id: 'r-ui',
    target: 'R',
    formulaTex: 'R = U / I',
    displayFormula: 'R = U / I',
    label: '已知电压与电流',
    description: '电阻测量基准：导体的电阻等于两端电压与电流之比',
    color: '#d97706',
    hoverColor: '#fbbf24',
  },
  {
    id: 'r-u2p',
    target: 'R',
    formulaTex: 'R = U² / P',
    displayFormula: 'R = U² / P',
    label: '已知电压与功率',
    description: '发热丝/电器阻值计算：电极额定阻值计算通用公式',
    color: '#b45309',
    hoverColor: '#f59e0b',
  },
  {
    id: 'r-pi2',
    target: 'R',
    formulaTex: 'R = P / I²',
    displayFormula: 'R = P / I²',
    label: '已知功率与电流',
    description: '高频/发热元件等效电阻推导公式',
    color: '#92400e',
    hoverColor: '#d97706',
  },

  // Power P
  {
    id: 'p-ui',
    target: 'P',
    formulaTex: 'P = U × I',
    displayFormula: 'P = U · I',
    label: '已知电压与电流',
    description: '电功率基本公式：单位时间内做功的速率',
    color: '#db2777',
    hoverColor: '#f472b6',
  },
  {
    id: 'p-i2r',
    target: 'P',
    formulaTex: 'P = I² × R',
    displayFormula: 'P = I² · R',
    label: '已知电流与电阻',
    description: '焦耳热功率公式：用于导线热损耗与电阻发热计算',
    color: '#be185d',
    hoverColor: '#ec4899',
  },
  {
    id: 'p-u2r',
    target: 'P',
    formulaTex: 'P = U² / R',
    displayFormula: 'P = U² / R',
    label: '已知电压与电阻',
    description: '恒压供电回路功耗推导公式',
    color: '#9d174d',
    hoverColor: '#db2777',
  },
];

interface FormulaWheelProps {
  onSelectTarget: (target: TargetParameter) => void;
}

export const FormulaWheel: React.FC<FormulaWheelProps> = ({ onSelectTarget }) => {
  const [selectedFormula, setSelectedFormula] = useState<FormulaSector>(FORMULAS[0]);

  const handleSectorClick = (item: FormulaSector) => {
    setSelectedFormula(item);
    onSelectTarget(item.target);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            欧姆定律经典公式轮盘 (Ohm's Law Formula Wheel)
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">点击轮盘扇区可快速定相推导</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Interactive Formula Wheel Canvas (5 cols) */}
        <div className="md:col-span-5 flex justify-center items-center p-2">
          <svg viewBox="0 0 360 360" className="w-full max-w-[280px] h-auto select-none drop-shadow-md">
            {/* Outer Decorative Ring */}
            <circle cx="180" cy="180" r="172" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />

            {/* 4 Major Quadrants Background Arc Separators */}
            {/* Quadrant 1: U (Top Left - 180° to 270°) */}
            {/* Quadrant 2: I (Top Right - 270° to 360°) */}
            {/* Quadrant 3: R (Bottom Right - 0° to 90°) */}
            {/* Quadrant 4: P (Bottom Left - 90° to 180°) */}

            {/* 12 Formula Sectors */}
            {FORMULAS.map((f, i) => {
              const startAngle = (i * 30 - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
              const midAngle = ((i + 0.5) * 30 - 90) * (Math.PI / 180);

              const innerR = 70;
              const outerR = 165;

              const x1Inner = 180 + innerR * Math.cos(startAngle);
              const y1Inner = 180 + innerR * Math.sin(startAngle);
              const x1Outer = 180 + outerR * Math.cos(startAngle);
              const y1Outer = 180 + outerR * Math.sin(startAngle);

              const x2Outer = 180 + outerR * Math.cos(endAngle);
              const y2Outer = 180 + outerR * Math.sin(endAngle);
              const x2Inner = 180 + innerR * Math.cos(endAngle);
              const y2Inner = 180 + innerR * Math.sin(endAngle);

              const textX = 180 + 118 * Math.cos(midAngle);
              const textY = 180 + 118 * Math.sin(midAngle);

              const isSelected = selectedFormula.id === f.id;

              const pathData = [
                `M ${x1Inner} ${y1Inner}`,
                `L ${x1Outer} ${y1Outer}`,
                `A ${outerR} ${outerR} 0 0 1 ${x2Outer} ${x2Outer ? y2Outer : 0}`,
                `L ${x2Inner} ${y2Inner}`,
                `A ${innerR} ${innerR} 0 0 0 ${x1Inner} ${y1Inner}`,
                'Z',
              ].join(' ');

              return (
                <g
                  key={f.id}
                  onClick={() => handleSectorClick(f)}
                  className="cursor-pointer transition-transform duration-200 hover:scale-105 transform-origin-center"
                >
                  <path
                    d={pathData}
                    fill={isSelected ? '#f59e0b' : f.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-150 hover:opacity-90"
                  />
                  <text
                    x={textX}
                    y={textY + 4}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono pointer-events-none"
                  >
                    {f.displayFormula.split('=')[1]?.trim() || f.displayFormula}
                  </text>
                </g>
              );
            })}

            {/* Center Core Hub (Ohm's Law Center) */}
            <circle cx="180" cy="180" r="66" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
            <text x="180" y="172" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
              欧姆定律
            </text>
            <text x="180" y="194" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              {selectedFormula.target} 目标
            </text>
          </svg>
        </div>

        {/* Formula Detail Breakdown Card (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                求解目标: {selectedFormula.target}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {selectedFormula.label}
              </span>
            </div>

            <div className="text-xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">
              {selectedFormula.formulaTex}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedFormula.description}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 mt-1">
              <span className="text-[11px] text-slate-500">
                点击上方扇区将自动选中该目标参量并同步计算。
              </span>
              <button
                onClick={() => onSelectTarget(selectedFormula.target)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1"
              >
                <span>应用此目标</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick formula reference grid */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 text-sky-800 dark:text-sky-300">
              <span className="block font-bold">U 伏特</span>
              <span className="text-[10px] text-sky-600">IR · P/I · √(PR)</span>
            </div>
            <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 text-emerald-800 dark:text-emerald-300">
              <span className="block font-bold">I 安培</span>
              <span className="text-[10px] text-emerald-600">U/R · P/U · √(P/R)</span>
            </div>
            <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-amber-800 dark:text-amber-300">
              <span className="block font-bold">R 欧姆</span>
              <span className="text-[10px] text-amber-600">U/I · U²/P · P/I²</span>
            </div>
            <div className="p-2 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 text-pink-800 dark:text-pink-300">
              <span className="block font-bold">P 瓦特</span>
              <span className="text-[10px] text-pink-600">UI · I²R · U²/R</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
