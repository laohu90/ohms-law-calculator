import React, { useState, useEffect, useMemo } from 'react';
import {
  TargetParameter,
  VoltageUnit,
  CurrentUnit,
  ResistanceUnit,
  PowerUnit,
  PrecisionConfig,
  HistoryItem,
  RelatedToolId,
} from './types/ohms';
import {
  VOLTAGE_UNITS,
  CURRENT_UNITS,
  RESISTANCE_UNITS,
  POWER_UNITS,
  formatWithPrecision,
  getUnitSymbol,
  toSI,
} from './utils/unitConverter';
import { calculateOhmsLaw } from './utils/ohmsEngine';
import { CircuitDiagram } from './components/CircuitDiagram';
import { SolutionSteps } from './components/SolutionSteps';
import { ReverseVerification } from './components/ReverseVerification';
import { HistoryPanel } from './components/HistoryPanel';
import { PrecisionSettingsModal } from './components/PrecisionSettingsModal';
import { ShareModal } from './components/ShareModal';
import { FormulaWheel } from './components/FormulaWheel';
import { FormulaExpressionParser } from './components/FormulaExpressionParser';

// Related tools
import { ResistorColorCode } from './components/tools/ResistorColorCode';
import { VoltageDivider } from './components/tools/VoltageDivider';
import { PowerCostCalculator } from './components/tools/PowerCostCalculator';
import { LedResistorCalculator } from './components/tools/LedResistorCalculator';

import {
  Zap,
  Sliders,
  Share2,
  Moon,
  Sun,
  AlertTriangle,
  RotateCcw,
  Disc,
  GitFork,
  DollarSign,
  Lightbulb,
  Check,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'ohms_calculator_history_v2';
const STORAGE_KEY_THEME = 'ohms_calculator_theme_v2';

export default function App() {
  // --- STATE MANAGEMENT ---
  const [target, setTarget] = useState<TargetParameter>('I');

  // Input string states to allow typing decimals smoothly
  const [uValStr, setUValStr] = useState<string>('12');
  const [uUnit, setUUnit] = useState<VoltageUnit>('V');

  const [iValStr, setIValStr] = useState<string>('3');
  const [iUnit, setIUnit] = useState<CurrentUnit>('A');

  const [rValStr, setRValStr] = useState<string>('4');
  const [rUnit, setRUnit] = useState<ResistanceUnit>('ohm');

  const [pValStr, setPValStr] = useState<string>('36');
  const [pUnit, setPUnit] = useState<PowerUnit>('W');

  // Precision config
  const [precision, setPrecision] = useState<PrecisionConfig>({
    mode: 'decimal',
    decimalPlaces: 4,
    significantFigures: 4,
    useScientific: false,
    useThousandsSeparator: false,
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [isPrecisionModalOpen, setIsPrecisionModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeRelatedTool, setActiveRelatedTool] = useState<RelatedToolId | 'none'>('none');

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- DARK MODE SYNC ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

  // --- URL PARAMETER DESERIALIZATION (Requirement 9) ---
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlTarget = params.get('target') as TargetParameter;
      if (urlTarget && ['I', 'U', 'R', 'P'].includes(urlTarget)) {
        setTarget(urlTarget);
      }

      if (params.get('u')) setUValStr(params.get('u')!);
      if (params.get('uu')) setUUnit(params.get('uu') as VoltageUnit);

      if (params.get('i')) setIValStr(params.get('i')!);
      if (params.get('iu')) setIUnit(params.get('iu') as CurrentUnit);

      if (params.get('r')) setRValStr(params.get('r')!);
      if (params.get('ru')) setRUnit(params.get('ru') as ResistanceUnit);

      if (params.get('p')) setPValStr(params.get('p')!);
      if (params.get('pu')) setPUnit(params.get('pu') as PowerUnit);

      if (params.get('dec')) {
        setPrecision((prev) => ({
          ...prev,
          decimalPlaces: parseInt(params.get('dec')!, 10),
        }));
      }
    } catch {
      // Ignore invalid url params
    }
  }, []);

  // --- SAVE HISTORY TO LOCALSTORAGE ---
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // localStorage full or restricted
    }
  }, [history]);

  // --- PARSE NUMERIC INPUTS ---
  const uNum = parseFloat(uValStr);
  const iNum = parseFloat(iValStr);
  const rNum = parseFloat(rValStr);
  const pNum = parseFloat(pValStr);

  // --- CORE CALCULATION RESULT ---
  const calcResult = useMemo(() => {
    return calculateOhmsLaw({
      target,
      uVal: isNaN(uNum) ? 0 : uNum,
      uUnit,
      iVal: isNaN(iNum) ? 0 : iNum,
      iUnit,
      rVal: isNaN(rNum) ? 0 : rNum,
      rUnit,
      pVal: isNaN(pNum) ? 0 : pNum,
      pUnit,
      precision,
    });
  }, [target, uNum, uUnit, iNum, iUnit, rNum, rUnit, pNum, pUnit, precision]);

  // --- AUTO RECORD VALID CALCULATIONS TO HISTORY ---
  useEffect(() => {
    if (!calcResult.isValid) return;

    const timer = setTimeout(() => {
      const inputsStr =
        target === 'I'
          ? `U=${calcResult.u_display} ${getUnitSymbol(uUnit)}, R=${calcResult.r_display} ${getUnitSymbol(rUnit)}`
          : target === 'U'
          ? `I=${calcResult.i_display} ${getUnitSymbol(iUnit)}, R=${calcResult.r_display} ${getUnitSymbol(rUnit)}`
          : target === 'R'
          ? `U=${calcResult.u_display} ${getUnitSymbol(uUnit)}, I=${calcResult.i_display} ${getUnitSymbol(iUnit)}`
          : `U=${calcResult.u_display} ${getUnitSymbol(uUnit)}, I=${calcResult.i_display} ${getUnitSymbol(iUnit)}`;

      const outputsStr =
        target === 'I'
          ? `I = ${formatWithPrecision(calcResult.i_display, precision)} ${getUnitSymbol(iUnit)}, P = ${formatWithPrecision(calcResult.p_display, precision)} ${getUnitSymbol(pUnit)}`
          : target === 'U'
          ? `U = ${formatWithPrecision(calcResult.u_display, precision)} ${getUnitSymbol(uUnit)}, P = ${formatWithPrecision(calcResult.p_display, precision)} ${getUnitSymbol(pUnit)}`
          : target === 'R'
          ? `R = ${formatWithPrecision(calcResult.r_display, precision)} ${getUnitSymbol(rUnit)}, P = ${formatWithPrecision(calcResult.p_display, precision)} ${getUnitSymbol(pUnit)}`
          : `P = ${formatWithPrecision(calcResult.p_display, precision)} ${getUnitSymbol(pUnit)}, R = ${formatWithPrecision(calcResult.r_display, precision)} ${getUnitSymbol(rUnit)}`;

      setHistory((prev) => {
        // Prevent duplicate consecutive entries
        if (prev.length > 0 && prev[0].inputsStr === inputsStr && prev[0].target === target) {
          return prev;
        }

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          target,
          inputsStr,
          outputsStr,
          u_val: calcResult.u_display,
          u_unit: uUnit,
          i_val: calcResult.i_display,
          i_unit: iUnit,
          r_val: calcResult.r_display,
          r_unit: rUnit,
          p_val: calcResult.p_display,
          p_unit: pUnit,
        };

        return [newItem, ...prev.slice(0, 49)]; // Max 50 items
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [calcResult, target, uUnit, iUnit, rUnit, pUnit, precision]);

  // --- SHARE URL GENERATOR (Requirement 9) ---
  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('target', target);
    url.searchParams.set('u', uValStr);
    url.searchParams.set('uu', uUnit);
    url.searchParams.set('i', iValStr);
    url.searchParams.set('iu', iUnit);
    url.searchParams.set('r', rValStr);
    url.searchParams.set('ru', rUnit);
    url.searchParams.set('p', pValStr);
    url.searchParams.set('pu', pUnit);
    url.searchParams.set('dec', precision.decimalPlaces.toString());
    return url.toString();
  }, [target, uValStr, uUnit, iValStr, iUnit, rValStr, rUnit, pValStr, pUnit, precision]);

  // Handle reload item from history
  const handleLoadHistoryItem = (item: HistoryItem) => {
    setTarget(item.target);
    setUValStr(item.u_val.toString());
    setUUnit(item.u_unit);
    setIValStr(item.i_val.toString());
    setIUnit(item.i_unit);
    setRValStr(item.r_val.toString());
    setRUnit(item.r_unit);
    setPValStr(item.p_val.toString());
    setPUnit(item.p_unit);
    showToast('已成功恢复历史记录参数到计算器！');
  };

  const handleReset = () => {
    setTarget('I');
    setUValStr('12');
    setUUnit('V');
    setIValStr('3');
    setIUnit('A');
    setRValStr('4');
    setRUnit('ohm');
    setPValStr('36');
    setPUnit('W');
    showToast('已重置为标准基准参数');
  };

  // Helper to validate input field status
  const isInputInvalid = (valStr: string) => {
    const n = parseFloat(valStr);
    return isNaN(n) || n <= 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR CONTRACT (Strict 3-zone contract) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-3.5 flex items-center justify-between gap-3 md:gap-8 max-w-full overflow-hidden">
        {/* Zone 1: Single element brand wordmark */}
        <a href="/" className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="truncate max-w-[150px] sm:max-w-none">欧姆定律全能计算器</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveRelatedTool('none')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'none' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            主欧姆计算器
          </button>
          <button
            onClick={() => setActiveRelatedTool('color-code')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'color-code' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            色环电阻算查
          </button>
          <button
            onClick={() => setActiveRelatedTool('voltage-divider')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'voltage-divider' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            电阻分压计算
          </button>
          <button
            onClick={() => setActiveRelatedTool('power-cost')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'power-cost' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
            }`}
          >
            用电功率与电费
          </button>
        </nav>

        {/* Zone 3: Primary actions (Precision, Share, Theme toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsPrecisionModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 focus:ring-2 focus:ring-amber-500"
            title="自定义有效数字/小数精度"
            tabIndex={0}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">精度设置</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1 shadow-xs focus:ring-2 focus:ring-amber-500"
            title="分享带参数链接给同事"
            tabIndex={0}
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>分享</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-amber-500"
            title={isDarkMode ? '切换亮色模式' : '切换暗色模式'}
            tabIndex={0}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 flex flex-col gap-6 max-w-full overflow-x-hidden">
        {/* If a related tool is selected in mobile/top nav, render its full view */}
        {activeRelatedTool !== 'none' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-3.5 rounded-xl">
              <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                当前正在使用扩展电学小工具，随时可切换回主欧姆计算器。
              </span>
              <button
                onClick={() => setActiveRelatedTool('none')}
                className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                返回主欧姆计算器
              </button>
            </div>

            {activeRelatedTool === 'color-code' && <ResistorColorCode />}
            {activeRelatedTool === 'voltage-divider' && <VoltageDivider />}
            {activeRelatedTool === 'power-cost' && <PowerCostCalculator />}
            {activeRelatedTool === 'led-resistor' && <LedResistorCalculator />}
          </div>
        )}

        {/* MAIN CALCULATOR DASHBOARD */}
        {activeRelatedTool === 'none' && (
          <div className="flex flex-col gap-6 max-w-full overflow-x-hidden">
            {/* Target Calculation Segmented Control */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  选择待求解的未知参数 (Target Parameter)
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  根据已知两个变量，自动求解其余电学物理量
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto">
                <button
                  onClick={() => setTarget('I')}
                  className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-amber-500 ${
                    target === 'I'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  tabIndex={0}
                >
                  <span className="font-mono">I (电流)</span>
                </button>

                <button
                  onClick={() => setTarget('U')}
                  className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-amber-500 ${
                    target === 'U'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  tabIndex={0}
                >
                  <span className="font-mono">U (电压)</span>
                </button>

                <button
                  onClick={() => setTarget('R')}
                  className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-amber-500 ${
                    target === 'R'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  tabIndex={0}
                >
                  <span className="font-mono">R (电阻)</span>
                </button>

                <button
                  onClick={() => setTarget('P')}
                  className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-amber-500 ${
                    target === 'P'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  tabIndex={0}
                >
                  <span className="font-mono">P (功率)</span>
                </button>
              </div>
            </div>

            {/* Error Banner when non-positive input occurs (Requirement 1) */}
            {!calcResult.isValid && (
              <div className="bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-800 rounded-xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    {calcResult.errorMessage}
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    在标准直流电学计算中，电压(U)、电流(I)、电阻(R)和功率(P)均为正数物理量。请输入大于 0 的有效数值，避免除零或无效逻辑。
                  </p>
                </div>
              </div>
            )}

            {/* FREE-TEXT FORMULA / EXPRESSION PARSER INPUT */}
            <FormulaExpressionParser
              onApplyParsedValues={(p) => {
                if (p.target) setTarget(p.target);
                if (p.uVal !== undefined) setUValStr(p.uVal.toString());
                if (p.uUnit) setUUnit(p.uUnit);
                if (p.iVal !== undefined) setIValStr(p.iVal.toString());
                if (p.iUnit) setIUnit(p.iUnit);
                if (p.rVal !== undefined) setRValStr(p.rVal.toString());
                if (p.rUnit) setRUnit(p.rUnit);
                showToast('已从解析表达式同步更新物理参数！');
              }}
            />

            {/* 2-COLUMN SPLIT: Left Input Parameters, Right Interactive Circuit Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* INPUT PANEL (5 Columns) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col gap-5 max-w-full">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>参数输入与单位规范</span>
                  </h3>

                  <button
                    onClick={handleReset}
                    className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                    title="重置为默认值"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置</span>
                  </button>
                </div>

                {/* Voltage Input (U) */}
                <div className={`flex flex-col gap-1.5 p-3 rounded-lg transition-colors ${
                  target === 'U' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span>电压 U (Voltage)</span>
                      {target === 'U' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-mono">
                          求解目标
                        </span>
                      )}
                    </label>

                    <span className="text-[11px] text-slate-500 font-mono">
                      SI: {toSI(uNum || 0, VOLTAGE_UNITS[uUnit].multiplier)} V
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'U'}
                      value={target === 'U' && calcResult.isValid ? formatWithPrecision(calcResult.u_display, precision) : uValStr}
                      onChange={(e) => setUValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm font-mono transition-colors min-w-0 ${
                        target === 'U'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : isInputInvalid(uValStr)
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500'
                      }`}
                      placeholder="例如 12"
                      tabIndex={0}
                    />

                    {/* Unit Selector */}
                    <select
                      value={uUnit}
                      onChange={(e) => setUUnit(e.target.value as VoltageUnit)}
                      className="p-2.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                      tabIndex={0}
                    >
                      {Object.values(VOLTAGE_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Input (I) */}
                <div className={`flex flex-col gap-1.5 p-3 rounded-lg transition-colors ${
                  target === 'I' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>电流 I (Current)</span>
                      {target === 'I' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-mono">
                          求解目标
                        </span>
                      )}
                    </label>

                    <span className="text-[11px] text-slate-500 font-mono">
                      SI: {toSI(iNum || 0, CURRENT_UNITS[iUnit].multiplier)} A
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'I'}
                      value={target === 'I' && calcResult.isValid ? formatWithPrecision(calcResult.i_display, precision) : iValStr}
                      onChange={(e) => setIValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm font-mono transition-colors min-w-0 ${
                        target === 'I'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : isInputInvalid(iValStr)
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500'
                      }`}
                      placeholder="例如 3"
                      tabIndex={0}
                    />

                    <select
                      value={iUnit}
                      onChange={(e) => setIUnit(e.target.value as CurrentUnit)}
                      className="p-2.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                      tabIndex={0}
                    >
                      {Object.values(CURRENT_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resistance Input (R) */}
                <div className={`flex flex-col gap-1.5 p-3 rounded-lg transition-colors ${
                  target === 'R' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>电阻 R (Resistance)</span>
                      {target === 'R' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-mono">
                          求解目标
                        </span>
                      )}
                    </label>

                    <span className="text-[11px] text-slate-500 font-mono">
                      SI: {toSI(rNum || 0, RESISTANCE_UNITS[rUnit].multiplier)} Ω
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'R'}
                      value={target === 'R' && calcResult.isValid ? formatWithPrecision(calcResult.r_display, precision) : rValStr}
                      onChange={(e) => setRValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm font-mono transition-colors min-w-0 ${
                        target === 'R'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : isInputInvalid(rValStr)
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500'
                      }`}
                      placeholder="例如 4"
                      tabIndex={0}
                    />

                    <select
                      value={rUnit}
                      onChange={(e) => setRUnit(e.target.value as ResistanceUnit)}
                      className="p-2.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                      tabIndex={0}
                    >
                      {Object.values(RESISTANCE_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Power Output / Input (P) */}
                <div className={`flex flex-col gap-1.5 p-3 rounded-lg transition-colors ${
                  target === 'P' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span>电功率 P (Power)</span>
                      {target === 'P' && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500 text-white font-mono">
                          求解目标
                        </span>
                      )}
                    </label>

                    <span className="text-[11px] text-slate-500 font-mono">
                      SI: {calcResult.isValid ? calcResult.p_watts : 0} W
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'P'}
                      value={target === 'P' && calcResult.isValid ? formatWithPrecision(calcResult.p_display, precision) : calcResult.isValid ? formatWithPrecision(calcResult.p_display, precision) : pValStr}
                      onChange={(e) => setPValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm font-mono transition-colors min-w-0 ${
                        target === 'P'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                      placeholder="自动计算"
                      tabIndex={0}
                    />

                    <select
                      value={pUnit}
                      onChange={(e) => setPUnit(e.target.value as PowerUnit)}
                      className="p-2.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                      tabIndex={0}
                    >
                      {Object.values(POWER_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* RIGHT VISUAL CIRCUIT DIAGRAM (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col gap-6 max-w-full">
                <CircuitDiagram result={calcResult} precision={precision} />
              </div>
            </div>

            {/* FORMULA WHEEL (欧姆定律经典物理公式轮盘) */}
            <FormulaWheel onSelectTarget={(newTarget) => setTarget(newTarget)} />

            {/* FORMULA SUBSTITUTION STEPS & REVERSE VERIFICATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SolutionSteps result={calcResult} />
              <ReverseVerification result={calcResult} precision={precision} />
            </div>

            {/* HISTORY PANEL */}
            <HistoryPanel
              history={history}
              onLoadItem={handleLoadHistoryItem}
              onDeleteItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
              onClearAll={() => {
                setHistory([]);
                showToast('已清空所有历史记录');
              }}
            />

            {/* REQUIREMENT 7: Exactly 3-4 strongly related utility tools */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>常用扩展电学工程小工具 (Related Engineering Tools)</span>
                </h3>
                <span className="text-xs text-slate-500">专为硬件研发与维修精简保留 4 项核心工具</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveRelatedTool('color-code')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <Disc className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">色环电阻算查识别器</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">4色环/5色环标准与精密阻值一键识别</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRelatedTool('voltage-divider')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <GitFork className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">电阻串联分压计算器</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">计算 V_out 分压偏置及回路微安贯穿电流</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRelatedTool('power-cost')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <DollarSign className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">用电功率与电费计算器</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">根据设备功率评估每日/每月度数与电费金额</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRelatedTool('led-resistor')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-pink-400 dark:hover:border-pink-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <Lightbulb className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">LED 限流保护电阻计算器</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">精确推导发光二极管降压串联限流电阻及功率</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <p>欧姆定律全能计算器 · 集成电路图动态可视化与物理反算自洽校验系统</p>
      </footer>

      {/* MODALS */}
      <PrecisionSettingsModal
        isOpen={isPrecisionModalOpen}
        onClose={() => setIsPrecisionModalOpen(false)}
        config={precision}
        onChange={(newConfig) => {
          setPrecision(newConfig);
          showToast('已更新计算精度与数值格式设置');
        }}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
      />
    </div>
  );
}
