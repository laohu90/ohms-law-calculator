import React, { useState, useEffect } from 'react';
import {
  VariableType,
  PrecisionMode,
  VOLTAGE_UNITS,
  CURRENT_UNITS,
  RESISTANCE_UNITS,
  POWER_UNITS,
  UnitDefinition,
  solveOhmsLaw,
  formatValueWithPrecision,
  evaluatePowerSafety,
} from './utils/calculator';
import { CircuitVisualizer } from './components/CircuitVisualizer';
import { OhmsWheel } from './components/OhmsWheel';
import { DerivationPanel } from './components/DerivationPanel';
import { NetworkSchematic } from './components/NetworkSchematic';
import { ResistorDecoder } from './components/ResistorDecoder';
import { ACInspector } from './components/ACInspector';
import { PracticalTools } from './components/PracticalTools';
import { ReportModal } from './components/ReportModal';
import { I18N, Lang } from './i18n';
import {
  Zap,
  Sliders,
  RotateCcw,
  Download,
  ShieldAlert,
  ChevronDown,
  Layers,
  Sparkles,
  Cpu,
  BookmarkCheck,
  Languages,
} from 'lucide-react';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'core' | 'network' | 'decoder' | 'ac' | 'tools'>('core');
  const [lang, setLang] = useState<Lang>('zh');

  const t = I18N[lang];

  // Active input selections: which 2 of the 4 variables are user inputs
  const [inputVariables, setInputVariables] = useState<[VariableType, VariableType]>(['voltage', 'resistance']);

  // Base raw numeric values in fundamental SI units (V, A, Ω, W)
  const [voltage, setVoltage] = useState<number>(12); // 12V
  const [resistance, setResistance] = useState<number>(240); // 240 Ω
  const [current, setCurrent] = useState<number>(0.05); // 50 mA
  const [power, setPower] = useState<number>(0.6); // 0.6 W

  // Unit multiplier selectors for display
  const [vUnit, setVUnit] = useState<UnitDefinition>(VOLTAGE_UNITS[2]); // V
  const [iUnit, setIUnit] = useState<UnitDefinition>(CURRENT_UNITS[3]); // mA
  const [rUnit, setRUnit] = useState<UnitDefinition>(RESISTANCE_UNITS[1]); // Ω
  const [pUnit, setPUnit] = useState<UnitDefinition>(POWER_UNITS[4]); // W

  // High precision controls (Directly solving Shortcoming #3)
  const [precisionMode, setPrecisionMode] = useState<PrecisionMode>('sigfigs');
  const [precisionDigits, setPrecisionDigits] = useState<number>(4);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Compute remaining 2 variables based on active inputs
  const isVInput = inputVariables.includes('voltage');
  const isIInput = inputVariables.includes('current');
  const isRInput = inputVariables.includes('resistance');
  const isPInput = inputVariables.includes('power');

  const { solved, activeFormulas, derivations } = solveOhmsLaw(
    isVInput ? voltage : null,
    isIInput ? current : null,
    isRInput ? resistance : null,
    isPInput ? power : null
  );

  // Sync state when solved values change
  useEffect(() => {
    if (!isVInput && solved.voltage !== null && !isNaN(solved.voltage)) {
      setVoltage(solved.voltage);
    }
    if (!isIInput && solved.current !== null && !isNaN(solved.current)) {
      setCurrent(solved.current);
    }
    if (!isRInput && solved.resistance !== null && !isNaN(solved.resistance)) {
      setResistance(solved.resistance);
    }
    if (!isPInput && solved.power !== null && !isNaN(solved.power)) {
      setPower(solved.power);
    }
  }, [isVInput, isIInput, isRInput, isPInput, solved.voltage, solved.current, solved.resistance, solved.power]);

  // Toggle which variables are active inputs
  const handleToggleInput = (v: VariableType) => {
    if (inputVariables.includes(v)) return; // Already an input
    // Replace the first input variable with the new one
    setInputVariables([inputVariables[1], v]);
  };

  // Preset scenarios
  const applyPreset = (presetName: string) => {
    if (presetName === 'led') {
      setInputVariables(['voltage', 'current']);
      setVoltage(5);
      setCurrent(0.02); // 20mA LED
      setVUnit(VOLTAGE_UNITS[2]);
      setIUnit(CURRENT_UNITS[3]);
    } else if (presetName === 'auto') {
      setInputVariables(['voltage', 'power']);
      setVoltage(12);
      setPower(55); // 55W automotive halogen bulb
      setVUnit(VOLTAGE_UNITS[2]);
      setPUnit(POWER_UNITS[4]);
    } else if (presetName === 'usb') {
      setInputVariables(['voltage', 'current']);
      setVoltage(5);
      setCurrent(2.4); // 5V 2.4A USB fast charger
      setVUnit(VOLTAGE_UNITS[2]);
      setIUnit(CURRENT_UNITS[4]);
    } else if (presetName === 'heater') {
      setInputVariables(['voltage', 'power']);
      setVoltage(220);
      setPower(1500); // 1500W electric space heater
      setVUnit(VOLTAGE_UNITS[2]);
      setPUnit(POWER_UNITS[4]);
    } else if (presetName === 'audio') {
      setInputVariables(['resistance', 'power']);
      setResistance(8); // 8Ω standard loudspeaker
      setPower(50); // 50W amplifier channel
      setRUnit(RESISTANCE_UNITS[1]);
      setPUnit(POWER_UNITS[4]);
    }
  };

  // Reset to default standard state
  const handleReset = () => {
    setInputVariables(['voltage', 'resistance']);
    setVoltage(12);
    setResistance(240);
    setCurrent(0.05);
    setPower(0.6);
  };

  const powerSafety = evaluatePowerSafety(solved.power ?? power);

  return (
    <div className="min-h-screen bg-[#0c0f17] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* ======================= TOP BAR CONTRACT ======================= */}
      {/* Strict 1-row, 3-zone contract: [Brand title] — [4-5 nav links] — [1 primary action] */}
      <header className="sticky top-0 z-40 bg-[#0c0f17]/95 border-b border-slate-800 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-100 whitespace-nowrap shrink-0 flex items-center gap-2.5"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-sm">
              Ω
            </div>
            <span>{t.appName}</span>
          </a>

          {/* Zone 2: 5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => setActiveTab('core')}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeTab === 'core' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {t.navCore}
              {activeTab === 'core' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeTab === 'network' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {t.navNetwork}
              {activeTab === 'network' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('decoder')}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeTab === 'decoder' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {t.navDecoder}
              {activeTab === 'decoder' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('ac')}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeTab === 'ac' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {t.navAC}
              {activeTab === 'ac' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activeTab === 'tools' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              {t.navTools}
              {activeTab === 'tools' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions (Language toggle + Export Report) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
              title="切换语言 / Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'zh' ? '中 / EN' : 'EN / 中'}</span>
            </button>
            <button
              onClick={() => setIsReportOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> {t.exportReport}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Precision & Unit Calibration Ribbon (Directly addresses Shortcoming #3) */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Numerical Precision Engine:
            </span>

            {/* Precision Mode Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setPrecisionMode('sigfigs')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  precisionMode === 'sigfigs' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Significant Figures (有效数字)"
              >
                Significant Figures
              </button>
              <button
                onClick={() => setPrecisionMode('decimals')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  precisionMode === 'decimals' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Fixed Decimal Places (固定小数位数)"
              >
                Decimal Places
              </button>
              <button
                onClick={() => setPrecisionMode('scientific')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  precisionMode === 'scientific' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Scientific Exponential Notation (科学记数法 a × 10^b)"
              >
                Scientific (10ⁿ)
              </button>
              <button
                onClick={() => setPrecisionMode('engineering')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  precisionMode === 'engineering' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Engineering Notation with SI Metric Prefixes (p, n, μ, m, k, M, G)"
              >
                SI Prefixes
              </button>
            </div>

            {/* Precision Digits Slider */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">
                {precisionMode === 'sigfigs'
                  ? 'Digits:'
                  : precisionMode === 'decimals'
                  ? 'Decimals:'
                  : 'Sig Figs:'}
              </span>
              <input
                type="range"
                min={precisionMode === 'decimals' ? 0 : 1}
                max={10}
                value={precisionDigits}
                onChange={(e) => setPrecisionDigits(parseInt(e.target.value, 10))}
                className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <span className="font-mono text-cyan-400 font-bold w-4 text-center">
                {precisionDigits}
              </span>
            </div>
          </div>

          {/* Quick Presets Menu */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 mr-1 hidden sm:inline">Lab Presets:</span>
            <button
              onClick={() => applyPreset('led')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              5V LED
            </button>
            <button
              onClick={() => applyPreset('auto')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              12V Auto Bulb
            </button>
            <button
              onClick={() => applyPreset('usb')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              USB 5V/2.4A
            </button>
            <button
              onClick={() => applyPreset('heater')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              220V Heater
            </button>
            <button
              onClick={() => applyPreset('audio')}
              className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors"
            >
              8Ω Speaker
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200"
              title="Reset parameters to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Tab 1: Core Ohm's Law Calculator & Real-Time Physical Circuit Visualizer */}
        {activeTab === 'core' && (
          <div className="space-y-6">
            {/* 4 Interactive Variable Parameter Cards (V, I, R, P) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Variable 1: Voltage (V) */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  isVInput
                    ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">V</span>
                    <span className="text-xs text-slate-300 font-medium">Voltage (Potential)</span>
                  </div>
                  <button
                    onClick={() => handleToggleInput('voltage')}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                      isVInput
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isVInput ? 'INPUT [LOCK]' : 'CALCULATED'}
                  </button>
                </div>

                {/* Input or Solved Value */}
                <div className="flex items-center gap-2 mb-3">
                  {isVInput ? (
                    <input
                      type="number"
                      step="any"
                      min="0.000000001"
                      value={voltage / vUnit.multiplier}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value) || 0;
                        setVoltage(parsed * vUnit.multiplier);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  ) : (
                    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-amber-300 tabular-nums">
                      {formatValueWithPrecision(
                        (solved.voltage ?? voltage) / vUnit.multiplier,
                        precisionMode,
                        precisionDigits
                      )}
                    </div>
                  )}

                  {/* Unit Selector */}
                  <select
                    value={vUnit.symbol}
                    onChange={(e) => {
                      const found = VOLTAGE_UNITS.find((u) => u.symbol === e.target.value);
                      if (found) setVUnit(found);
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-amber-500"
                  >
                    {VOLTAGE_UNITS.map((u) => (
                      <option key={u.symbol} value={u.symbol}>
                        {u.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Fine scrub slider for input */}
                {isVInput && (
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={Math.min(100, Math.max(0.1, voltage / vUnit.multiplier))}
                    onChange={(e) => setVoltage(parseFloat(e.target.value) * vUnit.multiplier)}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                )}
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Base SI: {(solved.voltage ?? voltage).toExponential(3)} V
                </div>
              </div>

              {/* Variable 2: Current (I) */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  isIInput
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-cyan-400">I</span>
                    <span className="text-xs text-slate-300 font-medium">Current (Intensity)</span>
                  </div>
                  <button
                    onClick={() => handleToggleInput('current')}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                      isIInput
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isIInput ? 'INPUT [LOCK]' : 'CALCULATED'}
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {isIInput ? (
                    <input
                      type="number"
                      step="any"
                      min="0.000000000001"
                      value={current / iUnit.multiplier}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value) || 0;
                        setCurrent(parsed * iUnit.multiplier);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  ) : (
                    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-cyan-300 tabular-nums">
                      {formatValueWithPrecision(
                        (solved.current ?? current) / iUnit.multiplier,
                        precisionMode,
                        precisionDigits
                      )}
                    </div>
                  )}

                  <select
                    value={iUnit.symbol}
                    onChange={(e) => {
                      const found = CURRENT_UNITS.find((u) => u.symbol === e.target.value);
                      if (found) setIUnit(found);
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {CURRENT_UNITS.map((u) => (
                      <option key={u.symbol} value={u.symbol}>
                        {u.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                {isIInput && (
                  <input
                    type="range"
                    min="0.01"
                    max="1000"
                    step="0.01"
                    value={Math.min(1000, Math.max(0.01, current / iUnit.multiplier))}
                    onChange={(e) => setCurrent(parseFloat(e.target.value) * iUnit.multiplier)}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                )}
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Base SI: {(solved.current ?? current).toExponential(3)} A
                </div>
              </div>

              {/* Variable 3: Resistance (R) */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  isRInput
                    ? 'bg-slate-900 border-sky-500/50 shadow-lg shadow-sky-500/5'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-sky-400">R</span>
                    <span className="text-xs text-slate-300 font-medium">Resistance (Load)</span>
                  </div>
                  <button
                    onClick={() => handleToggleInput('resistance')}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                      isRInput
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isRInput ? 'INPUT [LOCK]' : 'CALCULATED'}
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {isRInput ? (
                    <input
                      type="number"
                      step="any"
                      min="0.001"
                      value={resistance / rUnit.multiplier}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value) || 0;
                        setResistance(parsed * rUnit.multiplier);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-sky-500"
                    />
                  ) : (
                    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-sky-300 tabular-nums">
                      {formatValueWithPrecision(
                        (solved.resistance ?? resistance) / rUnit.multiplier,
                        precisionMode,
                        precisionDigits
                      )}
                    </div>
                  )}

                  <select
                    value={rUnit.symbol}
                    onChange={(e) => {
                      const found = RESISTANCE_UNITS.find((u) => u.symbol === e.target.value);
                      if (found) setRUnit(found);
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-sky-500"
                  >
                    {RESISTANCE_UNITS.map((u) => (
                      <option key={u.symbol} value={u.symbol}>
                        {u.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                {isRInput && (
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={Math.min(10000, Math.max(1, resistance / rUnit.multiplier))}
                    onChange={(e) => setResistance(parseFloat(e.target.value) * rUnit.multiplier)}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                )}
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Base SI: {(solved.resistance ?? resistance).toExponential(3)} Ω
                </div>
              </div>

              {/* Variable 4: Power (P) */}
              <div
                className={`rounded-xl p-4 transition-all border ${
                  isPInput
                    ? 'bg-slate-900 border-purple-500/50 shadow-lg shadow-purple-500/5'
                    : 'bg-slate-950/70 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-purple-400">P</span>
                    <span className="text-xs text-slate-300 font-medium">Power (Dissipation)</span>
                  </div>
                  <button
                    onClick={() => handleToggleInput('power')}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold transition-colors ${
                      isPInput
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                    }`}
                  >
                    {isPInput ? 'INPUT [LOCK]' : 'CALCULATED'}
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {isPInput ? (
                    <input
                      type="number"
                      step="any"
                      min="0.000000001"
                      value={power / pUnit.multiplier}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value) || 0;
                        setPower(parsed * pUnit.multiplier);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-slate-100 focus:outline-none focus:border-purple-500"
                    />
                  ) : (
                    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-lg font-mono font-bold text-purple-300 tabular-nums">
                      {formatValueWithPrecision(
                        (solved.power ?? power) / pUnit.multiplier,
                        precisionMode,
                        precisionDigits
                      )}
                    </div>
                  )}

                  <select
                    value={pUnit.symbol}
                    onChange={(e) => {
                      const found = POWER_UNITS.find((u) => u.symbol === e.target.value);
                      if (found) setPUnit(found);
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-2 font-mono focus:outline-none focus:border-purple-500"
                  >
                    {POWER_UNITS.map((u) => (
                      <option key={u.symbol} value={u.symbol}>
                        {u.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                {isPInput && (
                  <input
                    type="range"
                    min="0.1"
                    max="1000"
                    step="0.1"
                    value={Math.min(1000, Math.max(0.1, power / pUnit.multiplier))}
                    onChange={(e) => setPower(parseFloat(e.target.value) * pUnit.multiplier)}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                )}
                <div className="text-[11px] text-slate-500 mt-1 font-mono">
                  Base SI: {(solved.power ?? power).toExponential(3)} W
                </div>
              </div>
            </section>

            {/* Split Console: Interactive Schematic Visualizer (Left) + Ohm's Law Wheel & Steps (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Circuit Schematic (Directly solves Shortcoming #1) */}
              <div className="lg:col-span-7 space-y-6">
                <CircuitVisualizer
                  voltage={solved.voltage ?? voltage}
                  current={solved.current ?? current}
                  resistance={solved.resistance ?? resistance}
                  power={solved.power ?? power}
                  precisionMode={precisionMode}
                  precisionDigits={precisionDigits}
                />

                {/* Step-by-Step Derivation Breakdown */}
                <DerivationPanel
                  derivations={derivations}
                  precisionMode={precisionMode}
                  precisionDigits={precisionDigits}
                />
              </div>

              {/* Right Column: Interactive Ohm's Law Wheel */}
              <div className="lg:col-span-5 space-y-6">
                <OhmsWheel
                  activeFormulas={activeFormulas}
                  onSelectTarget={(target) => handleToggleInput(target)}
                />

                {/* Thermal & Physical Specifications Card */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Component Thermal & Safety Analysis
                  </h4>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between p-2 bg-slate-950/70 rounded border border-slate-800">
                      <span className="text-slate-400">Power Rating Required:</span>
                      <span className="font-mono font-bold text-slate-100">{powerSafety.rating}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-slate-950/70 rounded border border-slate-800">
                      <span className="text-slate-400">Recommended Physical Package:</span>
                      <span className="font-mono text-cyan-300">{powerSafety.recommendedPackage}</span>
                    </div>
                    {powerSafety.warning && (
                      <div className="p-2.5 bg-rose-950/30 border border-rose-500/40 rounded text-rose-300 text-xs leading-relaxed">
                        ⚠️ {powerSafety.warning}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Multi-Component Network Designer (Series, Parallel, Voltage Divider) */}
        {activeTab === 'network' && (
          <NetworkSchematic
            precisionMode={precisionMode}
            precisionDigits={precisionDigits}
          />
        )}

        {/* Tab 3: Resistor Color Code & E-Series Matcher */}
        {activeTab === 'decoder' && (
          <ResistorDecoder
            currentResistance={solved.resistance ?? resistance}
            onApplyResistance={(r) => {
              setResistance(r);
              if (!isRInput) {
                handleToggleInput('resistance');
              }
              setActiveTab('core');
            }}
            precisionMode={precisionMode}
            precisionDigits={precisionDigits}
          />
        )}

        {/* Tab 4: AC Impedance & Phasor Inspector */}
        {activeTab === 'ac' && (
          <ACInspector
            precisionMode={precisionMode}
            precisionDigits={precisionDigits}
          />
        )}

        {/* Tab 5: Practical Engineering Tools (LED & Power Cost) */}
        {activeTab === 'tools' && (
          <PracticalTools lang={lang} />
        )}
      </main>

      {/* Export / Printable Lab Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        circuitState={{
          voltage: solved.voltage ?? voltage,
          current: solved.current ?? current,
          resistance: solved.resistance ?? resistance,
          power: solved.power ?? power,
        }}
        activeFormulas={activeFormulas}
        derivations={derivations}
        precisionMode={precisionMode}
        precisionDigits={precisionDigits}
      />

      {/* Clean Scientific Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>OhmLab Precision Studio</span>
            <span aria-hidden="true">·</span>
            <span>Based on IEC 60062 / EIA-RS-279 Standards</span>
            <span aria-hidden="true">·</span>
            <span>V = I · R & P = V · I</span>
          </div>
          <div>High-precision engineering circuit laboratory</div>
        </div>
      </footer>
    </div>
  );
}
