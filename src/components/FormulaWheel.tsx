import React, { useState } from 'react';
import { TargetParameter } from '../types/ohms';
import { TranslationSchema } from '../i18n/translations';
import { PieChart, ArrowRight } from 'lucide-react';

interface FormulaSector {
  id: string;
  target: TargetParameter;
  formulaTex: string;
  displayFormula: string;
  label: string;
  description: string;
  color: string;
}

const FORMULAS: FormulaSector[] = [
  // Voltage U
  { id: 'u-ir', target: 'U', formulaTex: 'U = I × R', displayFormula: 'U = I · R', label: 'U = I · R', description: 'Ohm\'s law fundamental: Voltage proportional to current and resistance.', color: '#0284c7' },
  { id: 'u-pi', target: 'U', formulaTex: 'U = P / I', displayFormula: 'U = P / I', label: 'U = P / I', description: 'Electric power derivation: Voltage is power divided by current.', color: '#0369a1' },
  { id: 'u-pr', target: 'U', formulaTex: 'U = √(P × R)', displayFormula: 'U = √(P · R)', label: 'U = √(P · R)', description: 'Power-resistance relation: Square root of power times resistance.', color: '#075985' },

  // Current I
  { id: 'i-ur', target: 'I', formulaTex: 'I = U / R', displayFormula: 'I = U / R', label: 'I = U / R', description: 'Standard Ohm\'s law: Circuit current equals voltage divided by resistance.', color: '#059669' },
  { id: 'i-pu', target: 'I', formulaTex: 'I = P / U', displayFormula: 'I = P / U', label: 'I = P / U', description: 'Load current formula: Operating current equals power divided by voltage.', color: '#047857' },
  { id: 'i-pr', target: 'I', formulaTex: 'I = √(P / R)', displayFormula: 'I = √(P / R)', label: 'I = √(P / R)', description: 'Joule heating derivation: Square root of power divided by resistance.', color: '#065f46' },

  // Resistance R
  { id: 'r-ui', target: 'R', formulaTex: 'R = U / I', displayFormula: 'R = U / I', label: 'R = U / I', description: 'Resistance definition: Voltage drop divided by current through element.', color: '#d97706' },
  { id: 'r-u2p', target: 'R', formulaTex: 'R = U² / P', displayFormula: 'R = U² / P', label: 'R = U² / P', description: 'Heater element sizing: Rated voltage squared divided by rated power.', color: '#b45309' },
  { id: 'r-pi2', target: 'R', formulaTex: 'R = P / I²', displayFormula: 'R = P / I²', label: 'R = P / I²', description: 'Equivalent resistance from dissipated power and current squared.', color: '#92400e' },

  // Power P
  { id: 'p-ui', target: 'P', formulaTex: 'P = U × I', displayFormula: 'P = U · I', label: 'P = U · I', description: 'Electric power definition: Rate of electrical energy transfer.', color: '#db2777' },
  { id: 'p-i2r', target: 'P', formulaTex: 'P = I² × R', displayFormula: 'P = I² · R', label: 'P = I² · R', description: 'Joule heat dissipation: Power loss in conductor or heating resistor.', color: '#be185d' },
  { id: 'p-u2r', target: 'P', formulaTex: 'P = U² / R', displayFormula: 'P = U² / R', label: 'P = U² / R', description: 'Constant voltage power: Power dissipated for a fixed supply voltage.', color: '#9d174d' },
];

interface FormulaWheelProps {
  onSelectTarget: (target: TargetParameter) => void;
  t: TranslationSchema;
}

export const FormulaWheel: React.FC<FormulaWheelProps> = ({ onSelectTarget, t }) => {
  const [selectedFormula, setSelectedFormula] = useState<FormulaSector>(FORMULAS[0]);

  const handleSectorClick = (item: FormulaSector) => {
    setSelectedFormula(item);
    onSelectTarget(item.target);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4 max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.formulaWheelTitle}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">{t.formulaWheelSub}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 flex justify-center items-center p-2">
          <svg viewBox="0 0 360 360" className="w-full max-w-[280px] h-auto select-none drop-shadow-md">
            <circle cx="180" cy="180" r="172" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />

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
                `A ${outerR} ${outerR} 0 0 1 ${x2Outer} ${y2Outer}`,
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

            <circle cx="180" cy="180" r="66" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
            <text x="180" y="172" fill="#f59e0b" fontSize="13" fontWeight="bold" textAnchor="middle">
              {t.wheelCenter}
            </text>
            <text x="180" y="194" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              {t.targetSelected}: {selectedFormula.target}
            </text>
          </svg>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {t.targetSelected}: {selectedFormula.target}
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
                {t.formulaWheelSub}
              </span>
              <button
                onClick={() => onSelectTarget(selectedFormula.target)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1 shrink-0"
              >
                <span>{t.applyTargetBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 text-sky-800 dark:text-sky-300">
              <span className="block font-bold">U ({t.voltage})</span>
              <span className="text-[10px] text-sky-600">IR · P/I · √(PR)</span>
            </div>
            <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 text-emerald-800 dark:text-emerald-300">
              <span className="block font-bold">I ({t.current})</span>
              <span className="text-[10px] text-emerald-600">U/R · P/U · √(P/R)</span>
            </div>
            <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 text-amber-800 dark:text-amber-300">
              <span className="block font-bold">R ({t.resistance})</span>
              <span className="text-[10px] text-amber-600">U/I · U²/P · P/I²</span>
            </div>
            <div className="p-2 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 text-pink-800 dark:text-pink-300">
              <span className="block font-bold">P ({t.power})</span>
              <span className="text-[10px] text-pink-600">UI · I²R · U²/R</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
