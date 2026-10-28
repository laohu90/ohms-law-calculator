import React, { useState } from 'react';
import { TranslationSchema } from '../../i18n/translations';
import { DollarSign, AlertCircle } from 'lucide-react';

interface PowerCostCalculatorProps {
  t: TranslationSchema;
}

export const PowerCostCalculator: React.FC<PowerCostCalculatorProps> = ({ t }) => {
  const [powerInput, setPowerInput] = useState<string>('1000');
  const [powerUnit, setPowerUnit] = useState<'W' | 'kW'>('W');
  const [hoursPerDay, setHoursPerDay] = useState<string>('8');
  const [costPerKwh, setCostPerKwh] = useState<string>('0.6');

  const powerNum = parseFloat(powerInput);
  const hoursNum = parseFloat(hoursPerDay);
  const costNum = parseFloat(costPerKwh);

  const isValid =
    !isNaN(powerNum) &&
    !isNaN(hoursNum) &&
    !isNaN(costNum) &&
    powerNum > 0 &&
    hoursNum > 0 &&
    hoursNum <= 24 &&
    costNum >= 0;

  let kw = 0;
  let dailyKwh = 0;
  let monthlyKwh = 0;
  let dailyCost = 0;
  let monthlyCost = 0;

  if (isValid) {
    kw = powerUnit === 'W' ? powerNum / 1000 : powerNum;
    dailyKwh = kw * hoursNum;
    monthlyKwh = dailyKwh * 30;
    dailyCost = dailyKwh * costNum;
    monthlyCost = monthlyKwh * costNum;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <DollarSign className="w-5 h-5 text-emerald-500 shrink-0" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          {t.powerCostTitle}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.appliancePowerLabel}
          </label>
          <div className="flex gap-1">
            <input
              type="number"
              value={powerInput}
              onChange={(e) => setPowerInput(e.target.value)}
              className="flex-1 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            />
            <select
              value={powerUnit}
              onChange={(e) => setPowerUnit(e.target.value as 'W' | 'kW')}
              className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
            >
              <option value="W">W</option>
              <option value="kW">kW</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.dailyHoursLabel}
          </label>
          <input
            type="number"
            min="0.1"
            max="24"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.tariffLabel}
          </label>
          <input
            type="number"
            value={costPerKwh}
            onChange={(e) => setCostPerKwh(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
          />
        </div>
      </div>

      {!isValid ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t.invalidErrorDesc}</span>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.dailyKwh}</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {dailyKwh.toFixed(2)} kWh
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.monthlyKwh}</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {monthlyKwh.toFixed(1)} kWh
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.dailyCost}</span>
            <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              ${dailyCost.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-semibold block">{t.monthlyCost}</span>
            <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              ${monthlyCost.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
