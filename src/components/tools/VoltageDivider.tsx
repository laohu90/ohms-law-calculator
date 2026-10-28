import React, { useState } from 'react';
import { TranslationSchema } from '../../i18n/translations';
import { GitFork, AlertCircle } from 'lucide-react';

interface VoltageDividerProps {
  t: TranslationSchema;
}

export const VoltageDivider: React.FC<VoltageDividerProps> = ({ t }) => {
  const [vIn, setVIn] = useState<string>('12');
  const [r1, setR1] = useState<string>('10000');
  const [r2, setR2] = useState<string>('10000');

  const vInNum = parseFloat(vIn);
  const r1Num = parseFloat(r1);
  const r2Num = parseFloat(r2);

  const isValid =
    !isNaN(vInNum) &&
    !isNaN(r1Num) &&
    !isNaN(r2Num) &&
    vInNum > 0 &&
    r1Num > 0 &&
    r2Num > 0 &&
    r1Num + r2Num > 0;

  let vOut = 0;
  let currentAmps = 0;
  let powerW = 0;

  if (isValid) {
    vOut = vInNum * (r2Num / (r1Num + r2Num));
    currentAmps = vInNum / (r1Num + r2Num);
    powerW = vInNum * currentAmps;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <GitFork className="w-5 h-5 text-indigo-500 shrink-0" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t.voltageDividerTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.vInLabel}
          </label>
          <input
            type="number"
            value={vIn}
            onChange={(e) => setVIn(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="12"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.r1Label}
          </label>
          <input
            type="number"
            value={r1}
            onChange={(e) => setR1(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="10000"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.r2Label}
          </label>
          <input
            type="number"
            value={r2}
            onChange={(e) => setR2(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="10000"
          />
        </div>
      </div>

      {!isValid ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t.invalidErrorDesc}</span>
        </div>
      ) : (
        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.vOutResult}</span>
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {vOut.toFixed(4)} V
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.throughCurrentResult}</span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {(currentAmps * 1000).toFixed(3)} mA
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.totalPowerResult}</span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {(powerW * 1000).toFixed(2)} mW
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
