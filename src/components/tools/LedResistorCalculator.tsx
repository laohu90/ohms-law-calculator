import React, { useState } from 'react';
import { Lightbulb, AlertCircle } from 'lucide-react';

export const LedResistorCalculator: React.FC = () => {
  const [supplyV, setSupplyV] = useState<string>('5'); // 5V
  const [forwardV, setForwardV] = useState<string>('2.1'); // Red LED ~2.1V
  const [forwardI, setForwardI] = useState<string>('20'); // 20mA

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
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          LED 限流保护电阻计算器 (LED Resistor Tool)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            电源电压 V_s (V)
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
            LED 正向压降 V_f (V)
          </label>
          <input
            type="number"
            value={forwardV}
            onChange={(e) => setForwardV(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="例如: 红光2.1V / 蓝光3.2V"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            LED 额定工作电流 I_f (mA)
          </label>
          <input
            type="number"
            value={forwardI}
            onChange={(e) => setForwardI(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono"
            placeholder="例如 20 mA"
          />
        </div>
      </div>

      {!isValid ? (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>参数无效：电源电压 V_s 必须严格大于 LED 正向压降 V_f，且工作电流需大于 0。</span>
        </div>
      ) : (
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-3 text-center">
          <div>
            <span className="text-xs text-slate-500 font-medium block">推荐限流电阻 R</span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {rLimit.toFixed(1)} Ω
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 font-medium block">电阻额定功率要求</span>
            <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
              {(pResistorW * 1000).toFixed(1)} mW (建议 1/4W 或 1/2W)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
