/**
 * Smart Circuit Diagnostics, Natural Language NLP Query Assistant,
 * Wire Sizing, Fuse Recommendation, and LED Limiting Resistor Wizard.
 * Styled in FormulaCalcKit signature layout.
 */
import React, { useState } from 'react';
import {
  diagnoseCircuit,
  parseNaturalLanguageQuery,
  calculateSmartLimiter,
  SmartDiagnosticsResult,
} from '../utils/smartEngine';
import { formatValue } from '../utils/formulas';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Battery,
  Cable,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface SmartDiagnosticsProps {
  currentV: number | null;
  currentI: number | null;
  currentR: number | null;
  currentP: number | null;
  onApplyParsedParams: (params: {
    voltage?: number;
    voltageUnit?: string;
    current?: number;
    currentUnit?: string;
    resistance?: number;
    resistanceUnit?: string;
    power?: number;
    powerUnit?: string;
  }) => void;
  lang?: 'zh' | 'en';
}

export const SmartDiagnostics: React.FC<SmartDiagnosticsProps> = ({
  currentV,
  currentI,
  currentR,
  currentP,
  onApplyParsedParams,
  lang = 'zh',
}) => {
  // Natural language query input
  const [nlQuery, setNlQuery] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState<number>(2600);

  // LED Wizard state
  const [ledVin, setLedVin] = useState<number>(12);
  const [ledVf, setLedVf] = useState<number>(2.0); // Red LED 2.0V
  const [ledIfMa, setLedIfMa] = useState<number>(20); // 20mA

  // Parse query on the fly
  const parsed = nlQuery.trim() ? parseNaturalLanguageQuery(nlQuery) : null;

  // Run full circuit diagnosis
  const diag: SmartDiagnosticsResult = diagnoseCircuit(
    currentV,
    currentI,
    currentR,
    currentP,
    batteryCapacity
  );

  // LED wizard result
  const limiterResult = calculateSmartLimiter(ledVin, ledVf, ledIfMa);

  const handleApplyNL = () => {
    if (!parsed) return;
    onApplyParsedParams({
      voltage: parsed.voltage,
      voltageUnit: parsed.voltageUnit,
      current: parsed.current,
      currentUnit: parsed.currentUnit,
      resistance: parsed.resistance,
      resistanceUnit: parsed.resistanceUnit,
      power: parsed.power,
      powerUnit: parsed.powerUnit,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Smart Natural Language Query Assistant */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {lang === 'zh' ? '智能物理意图与自然语言提取' : 'Smart Natural Language Physics Parser'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'zh'
                  ? '输入日常用电描述（如“220V 1500W 电水壶求电阻”），智能提取物理量并一键代入计算'
                  : 'Type natural engineering queries to automatically extract quantities and units.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            NLP Engine
          </span>
        </div>

        {/* Input Bar */}
        <div className="space-y-2">
          <div className="relative flex rounded-xl border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-2xs">
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder={
                lang === 'zh'
                  ? '试试输入：220V 1500W 电水壶、5V 2A 输出、或 12V 4欧姆求功率...'
                  : 'Try: 220V 1500W heater, 5V 2A USB charger, or 12V 4 ohms...'
              }
              className="w-full bg-transparent px-3.5 py-2.5 text-sm font-sans text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {parsed && (parsed.voltage || parsed.current || parsed.resistance || parsed.power) && (
              <button
                onClick={handleApplyNL}
                className="my-1 mr-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
              >
                {lang === 'zh' ? '一键代入计算' : 'Auto Fill'}
              </button>
            )}
          </div>

          {/* Quick NLP Samples */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px]">快捷试算样本:</span>
            {[
              '220V 1800W 热水器',
              '5V 2.4A iPad充电器',
              '12V 60W 车载冰箱',
              '3.7V 800mA 航模电芯',
              '24V 240W 工业开关电源',
            ].map((sample) => (
              <button
                key={sample}
                onClick={() => setNlQuery(sample)}
                className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-mono hover:text-blue-600 hover:border-blue-200 cursor-pointer transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Parsed Preview Card */}
          {parsed && (parsed.voltage || parsed.current || parsed.resistance || parsed.power) && (
            <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-blue-900">识别到的物理量:</span>
                {parsed.voltage && (
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-amber-700 font-bold">
                    U = {parsed.voltage} V
                  </span>
                )}
                {parsed.current && (
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-sky-700 font-bold">
                    I = {parsed.current} A
                  </span>
                )}
                {parsed.resistance && (
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-emerald-700 font-bold">
                    R = {parsed.resistance} Ω
                  </span>
                )}
                {parsed.power && (
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-rose-700 font-bold">
                    P = {parsed.power} W
                  </span>
                )}
                {parsed.recognizedScenario && (
                  <span className="text-slate-500 font-medium">({parsed.recognizedScenario})</span>
                )}
              </div>

              <button
                onClick={handleApplyNL}
                className="font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer text-xs"
              >
                确认导入并推导 →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Real-Time Smart Circuit Health & Engineering Diagnostics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {lang === 'zh' ? '智能电气安全与元器件工程选型诊断' : 'Smart Engineering & Safety Diagnostics'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'zh'
                  ? '根据当前实际电压、电流与功率，自动给出电线粗细规格、空开额定值与降额建议'
                  : 'Real-time wire gauge sizing, circuit breaker rating, and power derating analysis.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">健康度:</span>
            <span
              className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border ${
                diag.riskLevel === 'safe'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : diag.riskLevel === 'warning'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {diag.healthScore} / 100
            </span>
          </div>
        </div>

        {/* 4 Smart Engineering Recommendation Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Wire Recommendation */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Cable className="w-4 h-4 text-blue-600" />
              <span>推荐铜芯电线规格</span>
            </div>
            <div className="text-lg font-mono font-bold text-blue-700">
              {diag.recommendedWire.crossSectionMm2} mm²
            </div>
            <div className="text-[11px] text-slate-500">
              {diag.recommendedWire.gaugeAWG} · 最大安全载流 {diag.recommendedWire.maxSafeCurrent}A
            </div>
          </div>

          {/* Fuse / Breaker Recommendation */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>推荐空开/保险丝</span>
            </div>
            <div className="text-lg font-mono font-bold text-amber-700">
              {diag.recommendedFuseRating} A
            </div>
            <div className="text-[11px] text-slate-500">
              按连续负荷 125% 裕量标配防跳闸
            </div>
          </div>

          {/* Resistor Power Rating Recommendation (50% derating rule) */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>电阻建议标称瓦数</span>
            </div>
            <div className="text-lg font-mono font-bold text-emerald-700">
              ≥ {diag.recommendedResistorWattage} W
            </div>
            <div className="text-[11px] text-slate-500">
              实行 50% 功率降额，避免热疲劳
            </div>
          </div>

          {/* Battery Runtime Tile */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-sky-600" />
                <span>电池放电续航</span>
              </span>
              <select
                value={batteryCapacity}
                onChange={(e) => setBatteryCapacity(parseInt(e.target.value) || 2600)}
                className="bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-700"
              >
                <option value="1200">1200mAh (小电池)</option>
                <option value="2600">2600mAh (18650)</option>
                <option value="5000">5000mAh (手机)</option>
                <option value="10000">10000mAh (充电宝)</option>
              </select>
            </div>
            <div className="text-lg font-mono font-bold text-sky-700">
              {diag.batteryRuntimeEstimate?.hours
                ? diag.batteryRuntimeEstimate.hours < 1
                  ? `${(diag.batteryRuntimeEstimate.hours * 60).toFixed(0)} 分钟`
                  : `${diag.batteryRuntimeEstimate.hours} 小时`
                : '--'}
            </div>
            <div className="text-[11px] text-slate-500">
              在当前工作电流下放电预估
            </div>
          </div>
        </div>

        {/* Diagnosis Items List */}
        <div className="space-y-2 pt-2">
          {diag.diagnoses.map((d, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                d.level === 'alert'
                  ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                  : d.level === 'warning'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  {d.level === 'alert' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : d.level === 'warning' ? (
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{d.title}</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/80 border border-slate-200">
                  {d.type}
                </span>
              </div>
              <p className="text-slate-600 font-sans leading-relaxed">{d.detail}</p>
              <div className="text-[11px] font-medium text-blue-700 pt-0.5">
                💡 建议方案: {d.actionableAdvice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Smart LED / MCU Current-Limiting Resistor Wizard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {lang === 'zh' ? '智能发光二极管 (LED) 限流电阻计算向导' : 'Smart LED Current Limiting Resistor Wizard'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'zh'
                  ? '给定电源输入电压与 LED 压降、工作电流，自动匹配标准 E24 市场阻值与发热功率'
                  : 'Calculates exact resistance and nearest E24 standard value for LED protection.'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500">R = (Vin - Vf) / If</span>
        </div>

        {/* Input Parameters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs text-slate-600 font-semibold block">电源电压 Vin (V)</label>
            <input
              type="number"
              step="any"
              value={ledVin}
              onChange={(e) => setLedVin(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600"
            />
            <div className="flex gap-1 text-[10px] text-slate-500 pt-1">
              {[5, 9, 12, 24].map((v) => (
                <button
                  key={v}
                  onClick={() => setLedVin(v)}
                  className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:text-blue-600 cursor-pointer"
                >
                  {v}V
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs text-slate-600 font-semibold block">LED导通压降 Vf (V)</label>
            <input
              type="number"
              step="any"
              value={ledVf}
              onChange={(e) => setLedVf(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600"
            />
            <div className="flex gap-1 text-[10px] text-slate-500 pt-1">
              {[
                { label: '红/黄 2.0V', val: 2.0 },
                { label: '绿/蓝 3.0V', val: 3.0 },
                { label: '白光 3.3V', val: 3.3 },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={() => setLedVf(c.val)}
                  className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:text-blue-600 cursor-pointer"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <label className="text-xs text-slate-600 font-semibold block">目标工作电流 If (mA)</label>
            <input
              type="number"
              step="any"
              value={ledIfMa}
              onChange={(e) => setLedIfMa(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600"
            />
            <div className="flex gap-1 text-[10px] text-slate-500 pt-1">
              {[5, 10, 20, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => setLedIfMa(m)}
                  className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:text-blue-600 cursor-pointer"
                >
                  {m}mA
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Solution */}
        {limiterResult.isFeasible ? (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <div className="text-slate-500">计算理论阻值:</div>
              <div className="text-lg font-bold text-slate-800">{limiterResult.rExact} Ω</div>
            </div>
            <div>
              <div className="text-slate-500">推荐市售 E24 标称电阻:</div>
              <div className="text-xl font-bold text-blue-700">
                {limiterResult.rE24Nearest >= 1000
                  ? `${(limiterResult.rE24Nearest / 1000).toFixed(2)} kΩ`
                  : `${limiterResult.rE24Nearest} Ω`}
              </div>
            </div>
            <div>
              <div className="text-slate-500">电阻耗散功率及选型:</div>
              <div className="text-base font-bold text-amber-700">
                {limiterResult.powerWatt} W (选用 ≥{limiterResult.recommendedResistorWatt}W)
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
            提示: 电源电压 Vin ({ledVin}V) 必须大于 LED 正向导通压降 Vf ({ledVf}V)，否则二极管无法导通发光。
          </div>
        )}
      </div>
    </div>
  );
};
