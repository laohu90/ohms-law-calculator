/**
 * Clean, Focused, Ultra-Smart Ohm's Law and Electric Power Calculator.
 * Styled in FormulaCalcKit signature layout (density-calculator & linear-function-calculator).
 * Features:
 * - Smart Target Solver Mode (Auto 2-quantity detection, Solve R, Solve P, Solve I, Solve U)
 * - Smart Micro-adjustment buttons (-10%, +10%, x2, /2) for instant sensitivity testing
 * - Natural Language query parser (e.g. "220V 100W", "5V 2A", "12V 4欧")
 * - Smart Electrical Safety & Engineering Diagnostics (SELV safety, wire gauge, breaker sizing, short-circuit alert, kWh/heat rate)
 * - Rigorous step-by-step mathematical derivations with SI unit alignment
 * - Interactive 12-formula wheel drawer toggle
 */
import React, { useState, useId } from 'react';
import { QuantityType, PhysicalQuantityState } from '../types/electronics';
import {
  UNITS_CONFIG,
  solveAllQuantities,
  formatValue,
} from '../utils/formulas';
import {
  recommendWireForCurrent,
  recommendBreakerRating,
  parseNaturalLanguageQuery,
} from '../utils/smartEngine';
import { OhmWheel } from './OhmWheel';
import {
  Zap,
  Activity,
  Cpu,
  Flame,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Cable,
  HelpCircle,
  X,
  Compass,
} from 'lucide-react';
import { SeoReferenceSection } from './SeoReferenceSection';

interface OhmCalculatorProps {
  lang?: 'zh' | 'en';
}

type SolveMode = 'auto' | 'resistance' | 'power' | 'current' | 'voltage';

const PRESETS = [
  { label: '5V / 2A (手机快充)', v: '5', i: '2', k1: 'voltage' as QuantityType, k2: 'current' as QuantityType },
  { label: '220V / 100W (白炽灯泡)', v: '220', p: '100', k1: 'voltage' as QuantityType, k2: 'power' as QuantityType },
  { label: '220V / 2000W (电水壶)', v: '220', p: '2000', k1: 'voltage' as QuantityType, k2: 'power' as QuantityType },
  { label: '12V / 4Ω (车载音响)', v: '12', r: '4', k1: 'voltage' as QuantityType, k2: 'resistance' as QuantityType },
  { label: '3.7V / 1.5A (锂电池)', v: '3.7', i: '1.5', k1: 'voltage' as QuantityType, k2: 'current' as QuantityType },
  { label: '12V / 10A (电脑电源)', v: '12', i: '10', k1: 'voltage' as QuantityType, k2: 'current' as QuantityType },
];

export const OhmCalculator: React.FC<OhmCalculatorProps> = ({ lang = 'zh' }) => {
  const [quantities, setQuantities] = useState<Record<QuantityType, PhysicalQuantityState>>({
    voltage: { rawInput: '220', value: 220, unit: 'V' },
    current: { rawInput: '2', value: 2, unit: 'A' },
    resistance: { rawInput: '', value: null, unit: 'Ω' },
    power: { rawInput: '', value: null, unit: 'W' },
  });

  const [activeInputKeys, setActiveInputKeys] = useState<QuantityType[]>(['voltage', 'current']);
  const [solveMode, setSolveMode] = useState<SolveMode>('auto');
  const [precision, setPrecision] = useState<number>(3);
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [stepsCopied, setStepsCopied] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);

  // Natural language query input
  const [nlQuery, setNlQuery] = useState('');
  const [nlFeedback, setNlFeedback] = useState<string | null>(null);

  const inputIdPrefix = useId();

  const getSIValue = (raw: string, type: QuantityType, unitSymbol: string): number | null => {
    const num = parseFloat(raw);
    if (isNaN(num) || num <= 0) return null;
    const unitConf = UNITS_CONFIG[type].find((u) => u.symbol === unitSymbol);
    const mult = unitConf ? unitConf.multiplier : 1;
    return num * mult;
  };

  const solution = (() => {
    const key1 = activeInputKeys[0] || 'voltage';
    const key2 = activeInputKeys[1] || 'current';
    return solveAllQuantities({
      [key1]: quantities[key1].value,
      [key2]: quantities[key2].value,
    });
  })();

  const handleInputChange = (type: QuantityType, newRaw: string) => {
    const currentUnit = quantities[type].unit;
    const newSI = getSIValue(newRaw, type, currentUnit);

    setQuantities((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        rawInput: newRaw,
        value: newSI,
      },
    }));

    if (solveMode === 'auto') {
      setActiveInputKeys((prev) => {
        const filtered = prev.filter((k) => k !== type);
        return [type, ...filtered].slice(0, 2);
      });
    } else {
      // In targeted mode, keep target locked as output
      setActiveInputKeys((prev) => {
        const otherInputs = prev.filter((k) => k !== type && k !== solveMode);
        return [type, ...otherInputs].slice(0, 2);
      });
    }
  };

  const handleClearField = (type: QuantityType) => {
    setQuantities((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        rawInput: '',
        value: null,
      },
    }));
  };

  const handleMicroAdjust = (type: QuantityType, factor: number) => {
    const currentVal = parseFloat(quantities[type].rawInput);
    if (isNaN(currentVal) || currentVal <= 0) return;
    const nextVal = currentVal * factor;
    const formatted = parseFloat(nextVal.toFixed(4)).toString();
    handleInputChange(type, formatted);
  };

  const handleUnitChange = (type: QuantityType, newUnit: string) => {
    const currentRaw = quantities[type].rawInput;
    const newSI = getSIValue(currentRaw, type, newUnit);

    setQuantities((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        unit: newUnit,
        value: newSI,
      },
    }));
  };

  const handleReset = () => {
    setQuantities({
      voltage: { rawInput: '220', value: 220, unit: 'V' },
      current: { rawInput: '2', value: 2, unit: 'A' },
      resistance: { rawInput: '', value: null, unit: 'Ω' },
      power: { rawInput: '', value: null, unit: 'W' },
    });
    setActiveInputKeys(['voltage', 'current']);
    setSolveMode('auto');
    setNlFeedback(null);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    const newQ: Record<QuantityType, PhysicalQuantityState> = {
      voltage: { rawInput: '', value: null, unit: 'V' },
      current: { rawInput: '', value: null, unit: 'A' },
      resistance: { rawInput: '', value: null, unit: 'Ω' },
      power: { rawInput: '', value: null, unit: 'W' },
    };

    if (p.v) newQ.voltage = { rawInput: p.v, value: parseFloat(p.v), unit: 'V' };
    if (p.i) newQ.current = { rawInput: p.i, value: parseFloat(p.i), unit: 'A' };
    if (p.r) newQ.resistance = { rawInput: p.r, value: parseFloat(p.r), unit: 'Ω' };
    if (p.p) newQ.power = { rawInput: p.p, value: parseFloat(p.p), unit: 'W' };

    setQuantities(newQ);
    setActiveInputKeys([p.k1, p.k2]);
    setSolveMode('auto');
    setNlFeedback(null);
  };

  const handleApplyNaturalLanguage = () => {
    if (!nlQuery.trim()) return;
    const parsed = parseNaturalLanguageQuery(nlQuery);
    const updates: Partial<Record<QuantityType, { raw: string; unit: string; si: number }>> = {};

    if (parsed.voltage !== undefined) {
      const u = parsed.voltageUnit || 'V';
      updates.voltage = { raw: parsed.voltage.toString(), unit: u, si: parsed.voltage };
    }
    if (parsed.current !== undefined) {
      const u = parsed.currentUnit || 'A';
      updates.current = { raw: parsed.current.toString(), unit: u, si: parsed.current };
    }
    if (parsed.resistance !== undefined) {
      const u = parsed.resistanceUnit || 'Ω';
      updates.resistance = { raw: parsed.resistance.toString(), unit: u, si: parsed.resistance };
    }
    if (parsed.power !== undefined) {
      const u = parsed.powerUnit || 'W';
      updates.power = { raw: parsed.power.toString(), unit: u, si: parsed.power };
    }

    const matchedKeys = Object.keys(updates) as QuantityType[];
    if (matchedKeys.length >= 2) {
      const newQ: Record<QuantityType, PhysicalQuantityState> = {
        voltage: { rawInput: '', value: null, unit: 'V' },
        current: { rawInput: '', value: null, unit: 'A' },
        resistance: { rawInput: '', value: null, unit: 'Ω' },
        power: { rawInput: '', value: null, unit: 'W' },
      };

      for (const k of matchedKeys) {
        const item = updates[k]!;
        newQ[k] = { rawInput: item.raw, value: item.si, unit: item.unit };
      }

      setQuantities(newQ);
      setActiveInputKeys(matchedKeys.slice(0, 2));
      setNlFeedback(lang === 'zh' ? `已成功识别并填入: ${matchedKeys.join(', ')}` : `Parsed & applied: ${matchedKeys.join(', ')}`);
      setNlQuery('');
    } else {
      setNlFeedback(
        lang === 'zh'
          ? '未能识别出至少 2 个有效物理量，请尝试输入例如 "220V 100W" 或 "5伏 2安"'
          : 'Could not extract 2 valid parameters. Try: "220V 100W" or "5V 2A"'
      );
    }
  };

  const handleSelectSolveMode = (mode: SolveMode) => {
    setSolveMode(mode);
    if (mode === 'auto') return;

    // The user wants to solve for `mode` (e.g. resistance).
    // Ensure `mode` is NOT one of the active input keys.
    const remainingKeys: QuantityType[] = (['voltage', 'current', 'resistance', 'power'] as QuantityType[]).filter(
      (k) => k !== mode
    );
    const newActive = activeInputKeys.filter((k) => k !== mode);
    if (newActive.length < 2) {
      for (const rk of remainingKeys) {
        if (!newActive.includes(rk)) {
          newActive.push(rk);
          if (newActive.length === 2) break;
        }
      }
    }
    setActiveInputKeys(newActive.slice(0, 2));
  };

  const getDisplayVal = (type: QuantityType) => {
    const isUserActive = activeInputKeys.includes(type);
    const solvedSI = solution.values[type];
    const unitSymbol = quantities[type].unit;
    const unitConf = UNITS_CONFIG[type].find((u) => u.symbol === unitSymbol);
    const mult = unitConf ? unitConf.multiplier : 1;

    if (isUserActive) {
      return quantities[type].rawInput;
    }
    if (solvedSI !== null && solvedSI !== undefined && !isNaN(solvedSI)) {
      if (isScientific) {
        return solvedSI.toExponential(3).replace('e+', 'e');
      }
      return formatValue(solvedSI / mult, precision);
    }
    return '';
  };

  const currentV = solution.values.voltage ?? quantities.voltage.value;
  const currentI = solution.values.current ?? quantities.current.value;
  const currentR = solution.values.resistance ?? quantities.resistance.value;
  const currentP = solution.values.power ?? quantities.power.value;

  // Smart Engineering & Diagnostics calculations
  const wireRecommendation = currentI && currentI > 0 ? recommendWireForCurrent(currentI) : null;
  const fuseRecommendation = currentI && currentI > 0 ? recommendBreakerRating(currentI) : null;
  const isSafetyVoltage = currentV !== null && currentV <= 36;
  const isDangerousCurrent = currentI !== null && currentI >= 0.03; // 30mA is lethal threshold
  const isShortCircuit = currentR !== null && currentR < 0.1 && (currentI ?? 0) > 10;
  const hourlyEnergyKwh = currentP !== null ? (currentP * 1) / 1000 : null; // kWh in 1 hour
  const hourlyHeatKj = currentP !== null ? (currentP * 3600) / 1000 : null; // kJ in 1 hour

  const handleCopySummary = async () => {
    const text = [
      `【欧姆定律与电功率计算结果】`,
      `电压 U: ${formatValue(currentV, precision)} V`,
      `电流 I: ${formatValue(currentI, precision)} A`,
      `电阻 R: ${formatValue(currentR, precision)} Ω`,
      `电功率 P: ${formatValue(currentP, precision)} W`,
      wireRecommendation ? `推荐铜导线: ${wireRecommendation.crossSectionMm2} mm² (${wireRecommendation.gaugeAWG})` : '',
      fuseRecommendation ? `推荐空开断路器: C${fuseRecommendation}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopySteps = async () => {
    if (!solution.steps || solution.steps.length === 0) return;
    const text = solution.steps
      .map(
        (st, idx) =>
          `步骤 ${idx + 1}: ${st.formulaPlain}\n说明: ${st.explanation}\n代入计算: ${st.substitution} = ${st.resultWithUnit}`
      )
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setStepsCopied(true);
      setTimeout(() => setStepsCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const fields: Array<{
    type: QuantityType;
    labelZh: string;
    labelEn: string;
    symbol: string;
    icon: React.ReactNode;
    colorText: string;
    colorBg: string;
    colorBorder: string;
  }> = [
    {
      type: 'voltage',
      labelZh: '电压',
      labelEn: 'Voltage',
      symbol: 'U',
      icon: <Zap className="w-4 h-4 text-amber-500" />,
      colorText: 'text-amber-700',
      colorBg: 'bg-amber-50',
      colorBorder: 'border-amber-200',
    },
    {
      type: 'current',
      labelZh: '电流',
      labelEn: 'Current',
      symbol: 'I',
      icon: <Activity className="w-4 h-4 text-sky-500" />,
      colorText: 'text-sky-700',
      colorBg: 'bg-sky-50',
      colorBorder: 'border-sky-200',
    },
    {
      type: 'resistance',
      labelZh: '电阻',
      labelEn: 'Resistance',
      symbol: 'R',
      icon: <Cpu className="w-4 h-4 text-emerald-500" />,
      colorText: 'text-emerald-700',
      colorBg: 'bg-emerald-50',
      colorBorder: 'border-emerald-200',
    },
    {
      type: 'power',
      labelZh: '电功率',
      labelEn: 'Power',
      symbol: 'P',
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      colorText: 'text-rose-700',
      colorBg: 'bg-rose-50',
      colorBorder: 'border-rose-200',
    },
  ];

  return (
    <section id="calculator" className="space-y-6">
      {/* FormulaCalcKit Clean Left-Aligned Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="text-[11px] font-mono font-bold tracking-wider text-blue-600 uppercase">
            PHYSICS TOOLS · SI UNIT COMPLIANT
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {lang === 'zh' ? '欧姆定律与电功率计算器' : "Ohm's Law & Electric Power Calculator"}
          </h1>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {lang === 'zh'
              ? '输入任意 2 个已知物理量，实时推导其余量、分步代数推导与电气工程规格。'
              : 'Enter any 2 known parameters to solve the other 2 with step-by-step derivations.'}
          </p>
        </div>

        {/* Clean right-side formula badge */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0 self-start sm:self-center">
          <span className="font-bold text-blue-700">U = I · R</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-bold text-blue-700">P = U · I</span>
        </div>
      </div>

      {/* Main 2-Column Split: Clean Left Input Box + Clean Right Results Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Focused Calculator Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          {/* Top Control Bar: Target Mode Selector, Presets & Reset */}
          <div className="space-y-3 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>{lang === 'zh' ? '求解目标' : 'Solve Target'}</span>
              </span>

              <div className="flex items-center gap-2">
                {/* Clean Presets Selector Dropdown */}
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const found = PRESETS.find((p) => p.label === e.target.value);
                    if (found) applyPreset(found);
                    e.target.value = '';
                  }}
                  className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 font-medium cursor-pointer focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled>
                    {lang === 'zh' ? '⚡ 常用场景预设...' : '⚡ Presets...'}
                  </option>
                  {PRESETS.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '重置' : 'Reset'}</span>
                </button>
              </div>
            </div>

            {/* Smart Solve Mode Pills */}
            <div className="grid grid-cols-5 gap-1 bg-slate-100/90 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => handleSelectSolveMode('auto')}
                className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  solveMode === 'auto'
                    ? 'bg-white text-blue-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="输入任意2个量，自动推导其余全部量"
              >
                {lang === 'zh' ? '✨ 自由推导' : 'Auto'}
              </button>
              <button
                onClick={() => handleSelectSolveMode('resistance')}
                className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  solveMode === 'resistance'
                    ? 'bg-white text-emerald-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="求电阻 R"
              >
                {lang === 'zh' ? '求电阻 R' : 'Solve R'}
              </button>
              <button
                onClick={() => handleSelectSolveMode('power')}
                className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  solveMode === 'power'
                    ? 'bg-white text-rose-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="求功率 P"
              >
                {lang === 'zh' ? '求功率 P' : 'Solve P'}
              </button>
              <button
                onClick={() => handleSelectSolveMode('current')}
                className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  solveMode === 'current'
                    ? 'bg-white text-sky-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="求电流 I"
              >
                {lang === 'zh' ? '求电流 I' : 'Solve I'}
              </button>
              <button
                onClick={() => handleSelectSolveMode('voltage')}
                className={`py-1.5 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  solveMode === 'voltage'
                    ? 'bg-white text-amber-700 font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="求电压 U"
              >
                {lang === 'zh' ? '求电压 U' : 'Solve U'}
              </button>
            </div>
          </div>

          {/* 4 Clean Input Rows with Micro-adjustments */}
          <div className="space-y-4">
            {fields.map((f) => {
              const val = getDisplayVal(f.type);
              const isActive = activeInputKeys.includes(f.type);
              const units = UNITS_CONFIG[f.type];
              const isTargetField = solveMode === f.type;

              return (
                <div key={f.type} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor={`${inputIdPrefix}-${f.type}`}
                      className="font-semibold text-slate-700 flex items-center gap-1.5"
                    >
                      {f.icon}
                      <span>
                        {lang === 'zh' ? f.labelZh : f.labelEn} ({f.symbol})
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      {/* Status indicator */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-medium ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border border-blue-100'
                            : isTargetField
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isActive
                          ? lang === 'zh'
                            ? '已知输入'
                            : 'Input'
                          : isTargetField
                          ? lang === 'zh'
                            ? '🎯 求解目标'
                            : 'Target'
                          : lang === 'zh'
                          ? '✨ 智能推导'
                          : 'Auto Solved'}
                      </span>

                      {/* Quick Clear button */}
                      {isActive && val && (
                        <button
                          onClick={() => handleClearField(f.type)}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="清空此项"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Input and Unit Selector Container */}
                  <div
                    className={`relative flex items-center rounded-xl border bg-slate-50/70 focus-within:bg-white focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all ${
                      isActive ? 'border-slate-300' : 'border-slate-200'
                    }`}
                  >
                    <input
                      id={`${inputIdPrefix}-${f.type}`}
                      type="number"
                      step="any"
                      value={val}
                      placeholder={isActive ? (lang === 'zh' ? '输入数值...' : 'Enter value...') : '--'}
                      onChange={(e) => handleInputChange(f.type, e.target.value)}
                      className={`w-full bg-transparent px-3 py-2 text-sm font-mono font-semibold text-slate-900 focus:outline-none tabular-nums ${
                        !isActive ? 'text-blue-700 font-bold' : ''
                      }`}
                    />

                    {/* Unit Dropdown */}
                    <select
                      value={quantities[f.type].unit}
                      onChange={(e) => handleUnitChange(f.type, e.target.value)}
                      className="bg-slate-100 text-xs font-mono font-semibold text-slate-700 px-2 py-1 my-1 mr-1.5 rounded-lg border border-slate-200 focus:outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      {units.map((u) => (
                        <option key={u.symbol} value={u.symbol}>
                          {u.symbol}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Smart Micro-adjustment Pills for Active Inputs */}
                  {isActive && (
                    <div className="flex items-center gap-1.5 justify-end text-[10px] text-slate-500 font-mono">
                      <span className="text-[10px] text-slate-400 mr-1 font-sans">微调:</span>
                      <button
                        onClick={() => handleMicroAdjust(f.type, 0.9)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="数值减少 10%"
                      >
                        -10%
                      </button>
                      <button
                        onClick={() => handleMicroAdjust(f.type, 1.1)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="数值增加 10%"
                      >
                        +10%
                      </button>
                      <button
                        onClick={() => handleMicroAdjust(f.type, 0.5)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="数值减半"
                      >
                        ÷2
                      </button>
                      <button
                        onClick={() => handleMicroAdjust(f.type, 2.0)}
                        className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="数值翻倍"
                      >
                        ×2
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Smart Natural Language Parser Bar */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'zh' ? '智能自然语言快速识别' : 'Natural Language Input'}</span>
              </span>
              <span className="text-[11px] text-slate-400">如: 220V 100W</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nlQuery}
                placeholder={lang === 'zh' ? '输入如 "220V 100W" 或 "5伏 2安"...' : 'e.g. 220V 100W or 5V 2A...'}
                onChange={(e) => setNlQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyNaturalLanguage();
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
              <button
                onClick={handleApplyNaturalLanguage}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
              >
                {lang === 'zh' ? '解析并填入' : 'Parse'}
              </button>
            </div>

            {nlFeedback && (
              <p className="text-[11px] text-blue-600 font-medium bg-blue-50/60 p-1.5 rounded-lg border border-blue-100">
                {nlFeedback}
              </p>
            )}
          </div>

          {/* Precision Controls */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang === 'zh' ? '计算精度' : 'Precision'}</span>
            </span>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 font-mono">
                {[2, 3, 4].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPrecision(p);
                      setIsScientific(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                      precision === p && !isScientific
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {p}位
                  </button>
                ))}
                <button
                  onClick={() => setIsScientific(!isScientific)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                    isScientific
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  科学计
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Results & Step-by-Step Derivation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hero KPI Card: 4 Core Results */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span>{lang === 'zh' ? '四量计算结果总览' : 'Calculation Result Summary'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold">
                  Solved
                </span>
              </span>

              <div className="flex items-center gap-2">
                {/* 12 Formula Wheel Modal Trigger */}
                <button
                  onClick={() => setShowWheelModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '12公式圆盘' : 'Formula Wheel'}</span>
                </button>

                {/* Copy Summary */}
                <button
                  onClick={handleCopySummary}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>复制结果</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4 Clean Big Output Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80 transition-all hover:bg-amber-50">
                <div className="text-[11px] text-amber-800 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-amber-600" />
                  <span>电压 (U)</span>
                </div>
                <div className="text-xl font-mono font-bold text-amber-700 tabular-nums">
                  {formatValue(currentV, precision)}
                </div>
                <div className="text-[11px] text-amber-600 font-mono mt-0.5">伏特 (V)</div>
              </div>

              <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-200/80 transition-all hover:bg-sky-50">
                <div className="text-[11px] text-sky-800 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Activity className="w-3 h-3 text-sky-600" />
                  <span>电流 (I)</span>
                </div>
                <div className="text-xl font-mono font-bold text-sky-700 tabular-nums">
                  {formatValue(currentI, precision)}
                </div>
                <div className="text-[11px] text-sky-600 font-mono mt-0.5">安培 (A)</div>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 transition-all hover:bg-emerald-50">
                <div className="text-[11px] text-emerald-800 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-600" />
                  <span>电阻 (R)</span>
                </div>
                <div className="text-xl font-mono font-bold text-emerald-700 tabular-nums">
                  {formatValue(currentR, precision)}
                </div>
                <div className="text-[11px] text-emerald-600 font-mono mt-0.5">欧姆 (Ω)</div>
              </div>

              <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200/80 transition-all hover:bg-rose-50">
                <div className="text-[11px] text-rose-800 font-semibold mb-1 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-rose-600" />
                  <span>电功率 (P)</span>
                </div>
                <div className="text-xl font-mono font-bold text-rose-700 tabular-nums">
                  {formatValue(currentP, precision)}
                </div>
                <div className="text-[11px] text-rose-600 font-mono mt-0.5">瓦特 (W)</div>
              </div>
            </div>
          </div>

          {/* Smart Circuit Diagnostics & Engineering Insights Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-slate-800">
                  {lang === 'zh' ? '智能工况与安全工程诊断' : 'Smart Circuit & Safety Diagnostics'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-semibold">
                AI Diagnostics
              </span>
            </div>

            {/* Diagnostics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {/* Safety Voltage Check */}
              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isSafetyVoltage
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                    : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    {isSafetyVoltage ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                    )}
                    <span>{lang === 'zh' ? '人体触电电压评估' : 'Voltage Safety Rating'}</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isSafetyVoltage ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isSafetyVoltage ? 'SELV 安全电压' : '⚠️ 触电危险高压'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {isSafetyVoltage
                    ? '当前电压 ≤ 36V，符合国家特低安全电压标准，常规干燥环境下人体接触相对安全。'
                    : '当前电压 > 36V，已超出人体安全电压阈值，严禁带电直接触摸裸露导体！'}
                </p>
              </div>

              {/* Current Hazard & Physiological Response */}
              <div
                className={`p-3.5 rounded-xl border space-y-1.5 ${
                  isDangerousCurrent
                    ? 'bg-rose-50/60 border-rose-200/80 text-rose-900'
                    : 'bg-sky-50/60 border-sky-200/80 text-sky-900'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    {isDangerousCurrent ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Activity className="w-4 h-4 text-sky-600" />
                    )}
                    <span>{lang === 'zh' ? '电流生理效应等级' : 'Current Effect Level'}</span>
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isDangerousCurrent ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {isDangerousCurrent ? '⚠️ 致命致痉阈值' : '安全微电流'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {currentI && currentI >= 0.03
                    ? `电流 ${formatValue(currentI * 1000, 1)} mA 超过 30mA 漏电保护器动作阈值，若流经人体可诱发心室颤动。`
                    : currentI && currentI >= 0.01
                    ? `电流 ${formatValue(currentI * 1000, 1)} mA 处于 10~30mA 肌肉痉挛摆脱阈值范围，人体触碰将无法自主松脱。`
                    : '电流处于毫安或微安级安全区间，对人体无致伤危害。'}
                </p>
              </div>

              {/* Wire & Breaker Sizing */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono">
                <div className="flex items-center justify-between font-sans font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Cable className="w-4 h-4 text-blue-600" />
                    <span>{lang === 'zh' ? '推荐国标铜导线' : 'Recommended Wire'}</span>
                  </span>
                  <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {wireRecommendation ? `${wireRecommendation.crossSectionMm2} mm²` : '--'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">线规标准:</span>
                    <span>{wireRecommendation?.gaugeAWG || '--'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">安全连续载流:</span>
                    <span className="text-slate-800 font-bold">
                      {wireRecommendation ? `≤ ${wireRecommendation.maxSafeCurrent} A` : '--'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans pt-0.5">
                    {wireRecommendation?.note || '依据环境温度 30°C 国标铜芯聚氯乙烯绝缘线安全载流量核算。'}
                  </p>
                </div>
              </div>

              {/* Energy Consumption & Heat Rate */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono">
                <div className="flex items-center justify-between font-sans font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span>{lang === 'zh' ? '能耗与发热折算' : 'Energy & Heating Rate'}</span>
                  </span>
                  <span className="text-[11px] text-slate-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                    每小时 (1 hr)
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">耗电量:</span>
                    <span className="text-slate-800 font-bold">
                      {hourlyEnergyKwh !== null ? `${formatValue(hourlyEnergyKwh, 3)} 度 (kWh)` : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">焦耳产热量:</span>
                    <span className="text-rose-700 font-bold">
                      {hourlyHeatKj !== null ? `${formatValue(hourlyHeatKj, 2)} kJ` : '--'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-sans">推荐空气断路器:</span>
                    <span className="text-indigo-700 font-bold">
                      {fuseRecommendation ? `C${fuseRecommendation} 极数合规` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Short Circuit Alert Banner if resistance is dangerously low */}
            {isShortCircuit && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">⚠️ 严重短路预警！</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">
                    回路电阻极小 (小于 0.1Ω)，在当前电压下电流激增至 {formatValue(currentI)} A，可能造成电源跳闸、导线过热烧蚀甚至引燃起火！
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clean Step-by-Step Mathematical Derivation Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-800">
                {lang === 'zh' ? '严密代数分步推导' : 'Step-by-Step Mathematical Derivations'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySteps}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {stepsCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">步骤已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制解题过程</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {solution.steps.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {lang === 'zh'
                  ? '在左侧输入任意两个有效数值，即可生成完整的公式代数推导与验证步骤。'
                  : 'Enter any 2 parameters on the left to generate step-by-step solutions.'}
              </div>
            ) : (
              <div className="space-y-3.5">
                {solution.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/90 space-y-2.5 transition-all hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white font-mono shadow-2xs">
                          {lang === 'zh' ? `步骤 ${idx + 1}` : `Step ${idx + 1}`}
                        </span>
                        <span className="text-xs font-bold text-slate-800 font-mono tracking-tight">
                          {st.formulaPlain}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {st.resultWithUnit}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      {st.explanation}
                    </p>

                    <div className="text-[11px] font-mono text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
                      <span>代入计算: {st.substitution}</span>
                      <span className="font-bold text-slate-900">= {st.resultWithUnit}</span>
                    </div>

                    {st.alternateVerification && (
                      <div className="text-[10px] text-slate-500 font-mono bg-blue-50/50 px-2 py-1 rounded border border-blue-100 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>交叉校验: {st.alternateVerification}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* High-Converting Bilingual SEO Reference & Engineering Sizing Matrix */}
      <SeoReferenceSection lang={lang} />

      {/* 12 Formula Wheel Modal */}
      {showWheelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {lang === 'zh' ? '经典欧姆定律与电功率 12 公式圆盘' : "Ohm's Law & Power 12-Formula Wheel"}
                </h3>
              </div>
              <button
                onClick={() => setShowWheelModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <OhmWheel lang={lang} />
          </div>
        </div>
      )}
    </section>
  );
};
