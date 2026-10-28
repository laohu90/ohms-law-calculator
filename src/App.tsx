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
import { useTranslation } from './i18n/useTranslation';
import { Language } from './i18n/translations';

// Components
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
  Globe,
} from 'lucide-react';

const STORAGE_KEY_HISTORY = 'ohms_calculator_history_v2';
const STORAGE_KEY_THEME = 'ohms_calculator_theme_v2';

export default function App() {
  const { lang, setLanguage, t, languages } = useTranslation();

  // --- STATE MANAGEMENT ---
  const [target, setTarget] = useState<TargetParameter>('I');

  const [uValStr, setUValStr] = useState<string>('12');
  const [uUnit, setUUnit] = useState<VoltageUnit>('V');

  const [iValStr, setIValStr] = useState<string>('3');
  const [iUnit, setIUnit] = useState<CurrentUnit>('A');

  const [rValStr, setRValStr] = useState<string>('4');
  const [rUnit, setRUnit] = useState<ResistanceUnit>('ohm');

  const [pValStr, setPValStr] = useState<string>('36');
  const [pUnit, setPUnit] = useState<PowerUnit>('W');

  const [precision, setPrecision] = useState<PrecisionConfig>({
    mode: 'decimal',
    decimalPlaces: 4,
    significantFigures: 4,
    useScientific: false,
    useThousandsSeparator: false,
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isPrecisionModalOpen, setIsPrecisionModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [activeRelatedTool, setActiveRelatedTool] = useState<RelatedToolId | 'none'>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDarkMode]);

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
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const uNum = parseFloat(uValStr);
  const iNum = parseFloat(iValStr);
  const rNum = parseFloat(rValStr);
  const pNum = parseFloat(pValStr);

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

        return [newItem, ...prev.slice(0, 49)];
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [calcResult, target, uUnit, iUnit, rUnit, pUnit, precision]);

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
    return url.toString();
  }, [target, uValStr, uUnit, iValStr, iUnit, rValStr, rUnit, pValStr, pUnit]);

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
    showToast('Loaded calculation parameters.');
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
    showToast('Reset to default values.');
  };

  const isInputInvalid = (valStr: string) => {
    const n = parseFloat(valStr);
    return isNaN(n) || n <= 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans max-w-full overflow-x-hidden text-sm sm:text-base">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-3.5 flex items-center justify-between gap-3 md:gap-6 max-w-full overflow-hidden">
        {/* Zone 1: Wordmark */}
        <a href="/" className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-none">{t.appName}</span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveRelatedTool('none')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'none' ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''
            }`}
          >
            {t.mainCalcNav}
          </button>
          <button
            onClick={() => setActiveRelatedTool('color-code')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'color-code' ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''
            }`}
          >
            {t.colorCodeNav}
          </button>
          <button
            onClick={() => setActiveRelatedTool('voltage-divider')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'voltage-divider' ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''
            }`}
          >
            {t.voltageDividerNav}
          </button>
          <button
            onClick={() => setActiveRelatedTool('power-cost')}
            className={`hover:text-amber-500 transition-colors whitespace-nowrap shrink-0 ${
              activeRelatedTool === 'power-cost' ? 'text-amber-600 dark:text-amber-400 font-extrabold' : ''
            }`}
          >
            {t.powerCostNav}
          </button>
        </nav>

        {/* Zone 3: Actions + i18n Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-slate-500 absolute left-2 pointer-events-none" />
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="pl-7 pr-2 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 cursor-pointer focus:ring-2 focus:ring-amber-500"
              aria-label="Select Language"
            >
              {Object.entries(languages).map(([code, info]) => (
                <option key={code} value={code}>
                  {info.flag} {info.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsPrecisionModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 focus:ring-2 focus:ring-amber-500"
            title={t.precisionBtn}
          >
            <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="hidden sm:inline">{t.precisionBtn}</span>
          </button>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1 shadow-xs focus:ring-2 focus:ring-amber-500"
            title={t.shareBtn}
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>{t.shareBtn}</span>
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:ring-2 focus:ring-amber-500"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6 flex flex-col gap-6 max-w-full overflow-x-hidden">
        {/* If a related tool is selected in mobile/top nav */}
        {activeRelatedTool !== 'none' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-3.5 rounded-xl">
              <span className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium">
                {t.usingToolNotice}
              </span>
              <button
                onClick={() => setActiveRelatedTool('none')}
                className="px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
              >
                {t.backToMainCalc}
              </button>
            </div>

            {activeRelatedTool === 'color-code' && <ResistorColorCode t={t} />}
            {activeRelatedTool === 'voltage-divider' && <VoltageDivider t={t} />}
            {activeRelatedTool === 'power-cost' && <PowerCostCalculator t={t} />}
            {activeRelatedTool === 'led-resistor' && <LedResistorCalculator t={t} />}
          </div>
        )}

        {/* MAIN CALCULATOR DASHBOARD */}
        {activeRelatedTool === 'none' && (
          <div className="flex flex-col gap-6 max-w-full overflow-x-hidden">
            {/* Target Calculation Segmented Control */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t.targetLabel}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {t.targetSub}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto">
                <button
                  onClick={() => setTarget('I')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    target === 'I'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono">{t.current}</span>
                </button>

                <button
                  onClick={() => setTarget('U')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    target === 'U'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono">{t.voltage}</span>
                </button>

                <button
                  onClick={() => setTarget('R')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    target === 'R'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono">{t.resistance}</span>
                </button>

                <button
                  onClick={() => setTarget('P')}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                    target === 'P'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                  }`}
                >
                  <span className="font-mono">{t.power}</span>
                </button>
              </div>
            </div>

            {/* Error Banner when non-positive input occurs */}
            {!calcResult.isValid && (
              <div className="bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-400 dark:border-rose-800 rounded-xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    {calcResult.errorMessage || t.invalidErrorTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
                    {t.invalidErrorDesc}
                  </p>
                </div>
              </div>
            )}

            {/* EXPRESSION PARSER INPUT */}
            <FormulaExpressionParser
              t={t}
              onApplyParsedValues={(p) => {
                if (p.target) setTarget(p.target);
                if (p.uVal !== undefined) setUValStr(p.uVal.toString());
                if (p.uUnit) setUUnit(p.uUnit);
                if (p.iVal !== undefined) setIValStr(p.iVal.toString());
                if (p.iUnit) setIUnit(p.iUnit);
                if (p.rVal !== undefined) setRValStr(p.rVal.toString());
                if (p.rUnit) setRUnit(p.rUnit);
                showToast('Synced expression values to main calculator.');
              }}
            />

            {/* 2-COLUMN SPLIT: Left Input Parameters, Right Circuit Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* INPUT PANEL (5 Cols) */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col gap-5 max-w-full">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{t.inputSectionTitle}</span>
                  </h3>

                  <button
                    onClick={handleReset}
                    className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.resetBtn}</span>
                  </button>
                </div>

                {/* Voltage Input (U) */}
                <div className={`flex flex-col gap-1.5 p-3.5 rounded-lg transition-colors ${
                  target === 'U' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                      <span>{t.voltageLabel}</span>
                    </label>

                    <span className="text-xs text-slate-500 font-mono">
                      {t.siEquivalent}: {toSI(uNum || 0, VOLTAGE_UNITS[uUnit].multiplier)} V
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'U'}
                      value={target === 'U' && calcResult.isValid ? formatWithPrecision(calcResult.u_display, precision) : uValStr}
                      onChange={(e) => setUValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm sm:text-base font-mono transition-colors min-w-0 ${
                        target === 'U'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : isInputInvalid(uValStr)
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500'
                      }`}
                      placeholder="12"
                    />

                    <select
                      value={uUnit}
                      onChange={(e) => setUUnit(e.target.value as VoltageUnit)}
                      className="p-2.5 rounded-lg text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                    >
                      {Object.values(VOLTAGE_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Input (I) */}
                <div className={`flex flex-col gap-1.5 p-3.5 rounded-lg transition-colors ${
                  target === 'I' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>{t.currentLabel}</span>
                    </label>

                    <span className="text-xs text-slate-500 font-mono">
                      {t.siEquivalent}: {toSI(iNum || 0, CURRENT_UNITS[iUnit].multiplier)} A
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'I'}
                      value={target === 'I' && calcResult.isValid ? formatWithPrecision(calcResult.i_display, precision) : iValStr}
                      onChange={(e) => setIValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm sm:text-base font-mono transition-colors min-w-0 ${
                        target === 'I'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : isInputInvalid(iValStr)
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500'
                      }`}
                      placeholder="3"
                    />

                    <select
                      value={iUnit}
                      onChange={(e) => setIUnit(e.target.value as CurrentUnit)}
                      className="p-2.5 rounded-lg text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                    >
                      {Object.values(CURRENT_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Resistance Input (R) */}
                <div className={`flex flex-col gap-1.5 p-3.5 rounded-lg transition-colors ${
                  target === 'R' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>{t.resistanceLabel}</span>
                    </label>

                    <span className="text-xs text-slate-500 font-mono">
                      {t.siEquivalent}: {toSI(rNum || 0, RESISTANCE_UNITS[rUnit].multiplier)} Ω
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'R'}
                      value={target === 'R' && calcResult.isValid ? formatWithPrecision(calcResult.r_display, precision) : rValStr}
                      onChange={(e) => setRValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm sm:text-base font-mono transition-colors min-w-0 ${
                        target === 'R'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : isInputInvalid(rValStr)
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500 text-rose-900 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500'
                      }`}
                      placeholder="4"
                    />

                    <select
                      value={rUnit}
                      onChange={(e) => setRUnit(e.target.value as ResistanceUnit)}
                      className="p-2.5 rounded-lg text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                    >
                      {Object.values(RESISTANCE_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Power Output / Input (P) */}
                <div className={`flex flex-col gap-1.5 p-3.5 rounded-lg transition-colors ${
                  target === 'P' ? 'bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60' : 'bg-slate-50/50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <label className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                      <span>{t.powerLabel}</span>
                    </label>

                    <span className="text-xs text-slate-500 font-mono">
                      {t.siEquivalent}: {calcResult.isValid ? calcResult.p_watts : 0} W
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="any"
                      disabled={target === 'P'}
                      value={target === 'P' && calcResult.isValid ? formatWithPrecision(calcResult.p_display, precision) : calcResult.isValid ? formatWithPrecision(calcResult.p_display, precision) : pValStr}
                      onChange={(e) => setPValStr(e.target.value)}
                      className={`flex-1 p-2.5 rounded-lg text-sm sm:text-base font-mono transition-colors min-w-0 ${
                        target === 'P'
                          ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                      placeholder="Auto"
                    />

                    <select
                      value={pUnit}
                      onChange={(e) => setPUnit(e.target.value as PowerUnit)}
                      className="p-2.5 rounded-lg text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 font-mono cursor-pointer shrink-0"
                    >
                      {Object.values(POWER_UNITS).map((u) => (
                        <option key={u.symbol} value={u.symbol}>{u.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* RIGHT CIRCUIT DIAGRAM (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6 max-w-full">
                <CircuitDiagram result={calcResult} precision={precision} t={t} />
              </div>
            </div>

            {/* FORMULA WHEEL */}
            <FormulaWheel onSelectTarget={(newTarget) => setTarget(newTarget)} t={t} />

            {/* STEPS & REVERSE VERIFICATION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SolutionSteps result={calcResult} t={t} />
              <ReverseVerification result={calcResult} precision={precision} t={t} />
            </div>

            {/* HISTORY PANEL */}
            <HistoryPanel
              history={history}
              onLoadItem={handleLoadHistoryItem}
              onDeleteItem={(id) => setHistory((prev) => prev.filter((h) => h.id !== id))}
              onClearAll={() => {
                setHistory([]);
                showToast('Cleared history.');
              }}
              t={t}
            />

            {/* RELATED TOOLS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>{t.relatedToolsTitle}</span>
                </h3>
                <span className="text-xs text-slate-500">{t.relatedToolsSub}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveRelatedTool('color-code')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <Disc className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{t.colorCodeTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.colorCodeDesc}</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRelatedTool('voltage-divider')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <GitFork className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{t.voltageDividerTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.voltageDividerDesc}</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRelatedTool('power-cost')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <DollarSign className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{t.powerCostTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.powerCostDesc}</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveRelatedTool('led-resistor')}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-pink-400 dark:hover:border-pink-700 transition-all text-left flex flex-col gap-2 group"
                >
                  <Lightbulb className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{t.ledResistorTitle}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.ledResistorDesc}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 px-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-auto">
        <p>{t.footerText}</p>
      </footer>

      {/* MODALS */}
      <PrecisionSettingsModal
        isOpen={isPrecisionModalOpen}
        onClose={() => setIsPrecisionModalOpen(false)}
        config={precision}
        onChange={(newConfig) => {
          setPrecision(newConfig);
          showToast('Updated precision settings.');
        }}
        t={t}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        t={t}
      />
    </div>
  );
}
