import React, { useState } from 'react';
import { TranslationSchema } from '../../i18n/translations';
import { Lightbulb, AlertCircle } from 'lucide-react';

interface LedResistorCalculatorProps {
  t: TranslationSchema;
}

export const LedResistorCalculator: React.FC<LedResistorCalculatorProps> = ({ t }) => {
  const [supplyV, setSupplyV] = useState<string>('5');
  const [forwardV, setForwardV] = useState<string>('2.1');
  const [forwardI, setForwardI] = useState<string>('20');

  const vs = parseFloat(supplyV);
  const vf = parseFloat(forwardV);
  const ifMa = parseFloat(forwardI);

  const ifAmps = ifMa / 1000;
  const isValid = !isNaN(vs) && !isNaN(vf) && !isNaN(ifMa) && vs > vf && ifMa > 0;

  let rLimit = 0;
  let pResistorW = 0;

  if (isValid) {
    rLimit = (vs - vf) / ifAmps;
    pResistorW = Math.pow(ifAmps, 2) * rLimit;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t.ledResistorTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.supplyVLabel}
          </label>
          <input
            type="number"
            value={supplyV}
            onChange={(e) => setSupplyV(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.ledDropVLabel}
          </label>
          <input
            type="number"
            value={forwardV}
            onChange={(e) => setForwardV(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="2.1"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.ledCurrentLabel}
          </label>
          <input
            type="number"
            value={forwardI}
            onChange={(e) => setForwardI(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="20"
          />
        </div>
      </div>

      {!isValid ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t.invalidErrorDesc}</span>
        </div>
      ) : (
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.recommendedR}</span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {rLimit.toFixed(1)} Ω
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.resistorPowerRating}</span>
            <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {(pResistorW * 1000).toFixed(1)} mW (1/4W)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
