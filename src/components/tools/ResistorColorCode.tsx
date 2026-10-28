import React, { useState } from 'react';
import { Disc, Info } from 'lucide-react';

interface ColorBand {
  color: string;
  label: string;
  digit: number;
  multiplier: number;
  tolerance?: number;
  bgClass: string;
  textClass: string;
}

const COLOR_TABLE: ColorBand[] = [
  { color: 'black', label: '黑 (0)', digit: 0, multiplier: 1, bgClass: 'bg-slate-900', textClass: 'text-white' },
  { color: 'brown', label: '棕 (1)', digit: 1, multiplier: 10, tolerance: 1, bgClass: 'bg-amber-800', textClass: 'text-white' },
  { color: 'red', label: '红 (2)', digit: 2, multiplier: 100, tolerance: 2, bgClass: 'bg-red-600', textClass: 'text-white' },
  { color: 'orange', label: '橙 (3)', digit: 3, multiplier: 1000, bgClass: 'bg-orange-500', textClass: 'text-white' },
  { color: 'yellow', label: '黄 (4)', digit: 4, multiplier: 10000, bgClass: 'bg-yellow-400', textClass: 'text-slate-900' },
  { color: 'green', label: '绿 (5)', digit: 5, multiplier: 100000, tolerance: 0.5, bgClass: 'bg-emerald-600', textClass: 'text-white' },
  { color: 'blue', label: '蓝 (6)', digit: 6, multiplier: 1000000, tolerance: 0.25, bgClass: 'bg-blue-600', textClass: 'text-white' },
  { color: 'violet', label: '紫 (7)', digit: 7, multiplier: 10000000, tolerance: 0.1, bgClass: 'bg-purple-600', textClass: 'text-white' },
  { color: 'grey', label: '灰 (8)', digit: 8, multiplier: 100000000, tolerance: 0.05, bgClass: 'bg-slate-500', textClass: 'text-white' },
  { color: 'white', label: '白 (9)', digit: 9, multiplier: 1000000000, bgClass: 'bg-slate-100', textClass: 'text-slate-900' },
];

const SPECIAL_MULTIPLIERS = [
  { color: 'gold', label: '金 (x0.1)', multiplier: 0.1, tolerance: 5, bgClass: 'bg-amber-400', textClass: 'text-slate-900' },
  { color: 'silver', label: '银 (x0.01)', multiplier: 0.01, tolerance: 10, bgClass: 'bg-slate-300', textClass: 'text-slate-900' },
];

export const ResistorColorCode: React.FC = () => {
  const [bandCount, setBandCount] = useState<4 | 5>(4);
  const [band1, setBand1] = useState<number>(1); // Brown
  const [band2, setBand2] = useState<number>(0); // Black
  const [band3, setBand3] = useState<number>(2); // Red (3rd digit for 5-band or multiplier for 4-band)
  const [multiplierIdx, setMultiplierIdx] = useState<number>(2); // Red (x100)
  const [toleranceVal, setToleranceVal] = useState<number>(5); // Gold (5%)

  // Calculation
  let rawResistance = 0;
  let mult = COLOR_TABLE[multiplierIdx]?.multiplier || 1;

  if (bandCount === 4) {
    const digits = band1 * 10 + band2;
    rawResistance = digits * mult;
  } else {
    const digits = band1 * 100 + band2 * 10 + band3;
    rawResistance = digits * mult;
  }

  const formatResistance = (val: number) => {
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)} MΩ`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(2)} kΩ`;
    return `${val.toFixed(2)} Ω`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            色环电阻算查识别器 (Resistor Color Code Tool)
          </h3>
        </div>

        {/* 4 vs 5 band toggle */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setBandCount(4)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              bandCount === 4
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            4 色环电阻
          </button>
          <button
            onClick={() => setBandCount(5)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              bandCount === 5
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            5 色环精密电阻
          </button>
        </div>
      </div>

      {/* Visual Resistor Display */}
      <div className="p-6 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-3">
        <div className="relative w-64 h-16 bg-amber-200/90 dark:bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-evenly px-8 shadow-inner">
          {/* Wire left */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-1.5 bg-slate-400" />
          {/* Wire right */}
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-1.5 bg-slate-400" />

          {/* Band 1 */}
          <div className={`w-3.5 h-full ${COLOR_TABLE[band1].bgClass}`} title={`第一色环: ${COLOR_TABLE[band1].label}`} />
          {/* Band 2 */}
          <div className={`w-3.5 h-full ${COLOR_TABLE[band2].bgClass}`} title={`第二色环: ${COLOR_TABLE[band2].label}`} />
          
          {/* Band 3 (if 5 band) */}
          {bandCount === 5 && (
            <div className={`w-3.5 h-full ${COLOR_TABLE[band3].bgClass}`} title={`第三色环: ${COLOR_TABLE[band3].label}`} />
          )}

          {/* Multiplier */}
          <div className={`w-3.5 h-full ${COLOR_TABLE[multiplierIdx].bgClass}`} title={`倍率色环: ${COLOR_TABLE[multiplierIdx].label}`} />

          {/* Tolerance Gold/Silver */}
          <div className={`w-3.5 h-full bg-amber-400`} title={`容差色环: ±${toleranceVal}%`} />
        </div>

        <div className="text-center mt-1">
          <span className="text-2xl font-bold font-mono text-amber-400">
            {formatResistance(rawResistance)}
          </span>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            ±{toleranceVal}% 误差
          </span>
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">环 1 (第一有效数字)</label>
          <select
            value={band1}
            onChange={(e) => setBand1(parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
          >
            {COLOR_TABLE.slice(1).map((c) => (
              <option key={c.digit} value={c.digit}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">环 2 (第二有效数字)</label>
          <select
            value={band2}
            onChange={(e) => setBand2(parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
          >
            {COLOR_TABLE.map((c) => (
              <option key={c.digit} value={c.digit}>{c.label}</option>
            ))}
          </select>
        </div>

        {bandCount === 5 && (
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">环 3 (第三有效数字)</label>
            <select
              value={band3}
              onChange={(e) => setBand3(parseInt(e.target.value, 10))}
              className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
            >
              {COLOR_TABLE.map((c) => (
                <option key={c.digit} value={c.digit}>{c.label}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">倍率乘数 (Multiplier)</label>
          <select
            value={multiplierIdx}
            onChange={(e) => setMultiplierIdx(parseInt(e.target.value, 10))}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
          >
            {COLOR_TABLE.map((c, i) => (
              <option key={i} value={i}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">容差 (Tolerance)</label>
          <select
            value={toleranceVal}
            onChange={(e) => setToleranceVal(parseFloat(e.target.value))}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
          >
            <option value={1}>棕色 (±1%)</option>
            <option value={2}>红色 (±2%)</option>
            <option value={0.5}>绿色 (±0.5%)</option>
            <option value={0.1}>紫色 (±0.1%)</option>
            <option value={5}>金色 (±5%)</option>
            <option value={10}>银色 (±10%)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
