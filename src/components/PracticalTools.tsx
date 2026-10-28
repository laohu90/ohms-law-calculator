/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lightbulb, DollarSign, AlertCircle, ShieldCheck, Zap } from 'lucide-react';

interface PracticalToolsProps {
  lang: 'zh' | 'en';
}

export const PracticalTools: React.FC<PracticalToolsProps> = ({ lang }) => {
  // LED Resistor states
  const [supplyV, setSupplyV] = useState<number>(5);
  const [ledVf, setLedVf] = useState<number>(2.0); // 2.0V red LED
  const [ledIfMa, setLedIfMa] = useState<number>(20); // 20mA

  // Power Cost states
  const [powerWatts, setPowerWatts] = useState<number>(1000);
  const [dailyHours, setDailyHours] = useState<number>(8);
  const [costPerKwh, setCostPerKwh] = useState<number>(0.6); // 0.6元/度 or $0.6/kWh

  // LED Math
  const ledIfAmps = ledIfMa / 1000;
  const isLedValid = supplyV > ledVf && ledIfMa > 0;
  const ledResistorR = isLedValid ? (supplyV - ledVf) / ledIfAmps : 0;
  const ledResistorPowerW = isLedValid ? Math.pow(ledIfAmps, 2) * ledResistorR : 0;

  // Power Cost Math
  const isCostValid = powerWatts > 0 && dailyHours > 0 && dailyHours <= 24 && costPerKwh >= 0;
  const dailyKwh = (powerWatts / 1000) * dailyHours;
  const monthlyKwh = dailyKwh * 30;
  const dailyCost = dailyKwh * costPerKwh;
  const monthlyCost = monthlyKwh * costPerKwh;
  const yearlyCost = dailyCost * 365;

  return (
    <div className="space-y-6">
      {/* Tool 1: LED Resistor Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {lang === 'zh' ? 'LED 限流电阻计算器' : 'LED Series Current-Limiting Resistor'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'zh'
                ? '计算发光二极管串联分压电阻阻值与所需额定功率，防止二极管击穿烧毁'
                : 'Determine ballast resistor value and power rating to safely drive LEDs from DC supply'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              {lang === 'zh' ? '电源供电电压 (V_supply)' : 'Supply Voltage (V_supply)'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="any"
                min="0.1"
                value={supplyV}
                onChange={(e) => setSupplyV(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-slate-400 font-mono">V</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              {lang === 'zh' ? 'LED 正向导通压降 (V_f)' : 'LED Forward Voltage (V_f)'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="any"
                min="0.1"
                value={ledVf}
                onChange={(e) => setLedVf(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-slate-400 font-mono">V</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              {lang === 'zh' ? '常见：红/黄 1.8~2.2V；蓝/白/绿 3.0~3.4V' : 'Typical: Red 2.0V, White/Blue 3.2V'}
            </span>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              {lang === 'zh' ? 'LED 额定工作电流 (I_f)' : 'Desired LED Current (I_f)'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="any"
                min="1"
                value={ledIfMa}
                onChange={(e) => setLedIfMa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-slate-400 font-mono">mA</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              {lang === 'zh' ? '常规指示灯 10~20mA；高亮 30~50mA' : 'Standard indicators: 10~20 mA'}
            </span>
          </div>
        </div>

        {!isLedValid ? (
          <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>
              {lang === 'zh'
                ? '电源电压必须大于 LED 正向压降，且工作电流必须大于 0'
                : 'Supply voltage must be strictly greater than LED forward drop, and current > 0.'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {lang === 'zh' ? '建议限流电阻阻值 (R)' : 'Recommended Ballast Resistor (R)'}
              </span>
              <span className="text-2xl font-bold font-mono text-amber-400 block mt-1">
                {ledResistorR.toFixed(1)} Ω
              </span>
              <span className="text-[11px] text-slate-500 font-mono block mt-1">
                R = (V_supply − V_f) / I_f = ({supplyV} − {ledVf}) / {ledIfAmps}A
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {lang === 'zh' ? '电阻功耗与建议规格' : 'Resistor Dissipation & Package'}
              </span>
              <span className="text-2xl font-bold font-mono text-emerald-400 block mt-1">
                {(ledResistorPowerW * 1000).toFixed(1)} mW
              </span>
              <span className="text-[11px] text-slate-400 font-mono block mt-1">
                {ledResistorPowerW <= 0.125
                  ? lang === 'zh' ? '可选 1/8W (0.125W) 或 0805 贴片' : 'Use 1/8W or 0805 SMD'
                  : ledResistorPowerW <= 0.25
                  ? lang === 'zh' ? '建议 1/4W (0.25W) 常用金属膜' : 'Use standard 1/4W metal film'
                  : lang === 'zh' ? '建议 1/2W 以上高功率封装' : 'Use 1/2W+ package'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tool 2: Electricity Consumption & Cost Estimator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              {lang === 'zh' ? '用电功率与电费消耗估算器' : 'Appliance Power Consumption & Electricity Cost'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'zh'
                ? '根据电器额定瓦数、运行时间与电价阶梯，估算日/月/年电能消耗量与电费支出'
                : 'Calculate energy kWh consumption and recurring utility billing costs over time'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              {lang === 'zh' ? '电器功耗 (Watts)' : 'Appliance Wattage (Watts)'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="any"
                min="1"
                value={powerWatts}
                onChange={(e) => setPowerWatts(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-400 font-mono">W</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              {lang === 'zh' ? '每日开机时长 (小时)' : 'Daily Operation (Hours/Day)'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.5"
                min="0.1"
                max="24"
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-400 font-mono">h</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">
              {lang === 'zh' ? '电价费率 (元 / kWh 度)' : 'Electricity Rate ($/kWh)'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                step="0.05"
                min="0"
                value={costPerKwh}
                onChange={(e) => setCostPerKwh(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 font-mono text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <span className="text-slate-400 font-mono">{lang === 'zh' ? '元/度' : '$/kWh'}</span>
            </div>
          </div>
        </div>

        {isCostValid && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {lang === 'zh' ? '日用电量' : 'Daily Energy'}
              </span>
              <span className="text-lg font-bold font-mono text-cyan-400 mt-1 block">
                {dailyKwh.toFixed(2)} kWh
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {lang === 'zh' ? '月用电量 (30天)' : 'Monthly Energy'}
              </span>
              <span className="text-lg font-bold font-mono text-cyan-400 mt-1 block">
                {monthlyKwh.toFixed(1)} kWh
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {lang === 'zh' ? '预估月电费' : 'Monthly Bill'}
              </span>
              <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
                {lang === 'zh' ? `¥ ${monthlyCost.toFixed(2)}` : `$ ${monthlyCost.toFixed(2)}`}
              </span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-xs text-slate-400 block font-medium">
                {lang === 'zh' ? '预估年电费' : 'Annual Bill'}
              </span>
              <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                {lang === 'zh' ? `¥ ${yearlyCost.toFixed(2)}` : `$ ${yearlyCost.toFixed(2)}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
