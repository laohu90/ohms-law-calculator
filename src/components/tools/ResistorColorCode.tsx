import React, { useState } from 'react';
import { TranslationSchema } from '../../i18n/translations';
import { Disc } from 'lucide-react';

interface ColorBand {
  color: string;
  labelKey: string;
  digit: number;
  multiplier: number;
  tolerance?: number;
  bgClass: string;
}

const COLOR_TABLE: ColorBand[] = [
  { color: 'black', labelKey: '0 Black', digit: 0, multiplier: 1, bgClass: 'bg-slate-900' },
  { color: 'brown', labelKey: '1 Brown', digit: 1, multiplier: 10, tolerance: 1, bgClass: 'bg-amber-800' },
  { color: 'red', labelKey: '2 Red', digit: 2, multiplier: 100, tolerance: 2, bgClass: 'bg-red-600' },
  { color: 'orange', labelKey: '3 Orange', digit: 3, multiplier: 1000, bgClass: 'bg-orange-500' },
  { color: 'yellow', labelKey: '4 Yellow', digit: 4, multiplier: 10000, bgClass: 'bg-yellow-400' },
  { color: 'green', labelKey: '5 Green', digit: 5, multiplier: 100000, tolerance: 0.5, bgClass: 'bg-emerald-600' },
  { color: 'blue', labelKey: '6 Blue', digit: 6, multiplier: 1000000, tolerance: 0.25, bgClass: 'bg-blue-600' },
  { color: 'violet', labelKey: '7 Violet', digit: 7, multiplier: 10000000, tolerance: 0.1, bgClass: 'bg-purple-600' },
  { color: 'grey', labelKey: '8 Grey', digit: 8, multiplier: 100000000, tolerance: 0.05, bgClass: 'bg-slate-500' },
  { color: 'white', labelKey: '9 White', digit: 9, multiplier: 1000000000, bgClass: 'bg-slate-100' },
];

interface ResistorColorCodeProps {
  t: TranslationSchema;
}

export const ResistorColorCode: React.FC<ResistorColorCodeProps> = ({ t }) => {
  const [bandCount, setBandCount] = useState<4 | 5>(4);
  const [band1, setBand1] = useState<number>(1);
  const [band2, setBand2] = useState<number>(0);
  const [band3, setBand3] = useState<number>(2);
  const [multiplierIdx, setMultiplierIdx] = useState<number>(2);
  const [toleranceVal, setToleranceVal] = useState<number>(5);

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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Disc className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.colorCodeTitle}
          </h3>
        </div>

        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setBandCount(4)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              bandCount === 4
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.color4Band}
          </button>
          <button
            onClick={() => setBandCount(5)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              bandCount === 5
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t.color5Band}
          </button>
        </div>
      </div>

      <div className="p-6 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-3">
        <div className="relative w-64 h-16 bg-amber-200/90 dark:bg-amber-100 rounded-full border-2 border-amber-400 flex items-center justify-evenly px-8 shadow-inner">
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-1.5 bg-slate-400" />
          <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-12 h-1.5 bg-slate-400" />

          <div className={`w-3.5 h-full ${COLOR_TABLE[band1].bgClass}`} />
          <div className={`w-3.5 h-full ${COLOR_TABLE[band2].bgClass}`} />
          {bandCount === 5 && (
            <div className={`w-3.5 h-full ${COLOR_TABLE[band3].bgClass}`} />
          )}
          <div className={`w-3.5 h-full ${COLOR_TABLE[multiplierIdx].bgClass}`} />
          <div className={`w-3.5 h-full bg-amber-400`} />
        </div>

        <div className="text-center mt-1">
          <span className="text-2xl font-bold font-mono text-amber-400">
            {formatResistance(rawResistance)}
          </span>
          <span className="text-xs text-slate-400 ml-2 font-mono">
            ±{toleranceVal}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">{t.band1Label}</label>
          <select
            value={band1}
            onChange={(e) => setBand1(parseInt(e.target.value, 10))}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold"
          >
            {COLOR_TABLE.slice(1).map((c) => (
              <option key={c.digit} value={c.digit}>{c.labelKey}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">{t.band2Label}</label>
          <select
            value={band2}
            onChange={(e) => setBand2(parseInt(e.target.value, 10))}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold"
          >
            {COLOR_TABLE.map((c) => (
              <option key={c.digit} value={c.digit}>{c.labelKey}</option>
            ))}
          </select>
        </div>

        {bandCount === 5 && (
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">{t.band3Label}</label>
            <select
              value={band3}
              onChange={(e) => setBand3(parseInt(e.target.value, 10))}
              className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold"
            >
              {COLOR_TABLE.map((c) => (
                <option key={c.digit} value={c.digit}>{c.labelKey}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">{t.multiplierLabel}</label>
          <select
            value={multiplierIdx}
            onChange={(e) => setMultiplierIdx(parseInt(e.target.value, 10))}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold"
          >
            {COLOR_TABLE.map((c, i) => (
              <option key={i} value={i}>{c.labelKey}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">{t.toleranceLabel}</label>
          <select
            value={toleranceVal}
            onChange={(e) => setToleranceVal(parseFloat(e.target.value))}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-semibold"
          >
            <option value={1}>±1%</option>
            <option value={2}>±2%</option>
            <option value={0.5}>±0.5%</option>
            <option value={0.1}>±0.1%</option>
            <option value={5}>±5% (Gold)</option>
            <option value={10}>±10% (Silver)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
