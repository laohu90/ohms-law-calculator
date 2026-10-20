/**
 * Series & Parallel Circuit Solver with Live Animated Schematic and Overload Protection.
 * Styled in FormulaCalcKit signature layout (clean white cards, 12-col split, crisp indicators).
 */
import React, { useState } from 'react';
import { ResistorItem } from '../types/electronics';
import { formatValue } from '../utils/formulas';
import {
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Square,
  Split,
  Layers,
  Sparkles,
} from 'lucide-react';

export const CircuitSolver: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel' | 'divider'>('series');
  const [sourceVoltage, setSourceVoltage] = useState<number>(12);
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  // Dynamic resistor bank
  const [resistors, setResistors] = useState<ResistorItem[]>([
    {
      id: 'r1',
      name: 'R1',
      resistance: 10,
      unit: 'Ω',
      ratingWatts: 0.5,
      tolerancePct: 5,
    },
    {
      id: 'r2',
      name: 'R2',
      resistance: 20,
      unit: 'Ω',
      ratingWatts: 0.5,
      tolerancePct: 5,
    },
    {
      id: 'r3',
      name: 'R3',
      resistance: 30,
      unit: 'Ω',
      ratingWatts: 1.0,
      tolerancePct: 5,
    },
  ]);

  // For voltage divider mode
  const [dividerVin, setDividerVin] = useState<number>(5);
  const [dividerVoutTarget, setDividerVoutTarget] = useState<number>(3.3);
  const [dividerR1, setDividerR1] = useState<number>(1000);
  const [dividerLoadRL, setDividerLoadRL] = useState<number>(0);

  const handleAddResistor = () => {
    if (resistors.length >= 8) return;
    const nextIdx = resistors.length + 1;
    setResistors((prev) => [
      ...prev,
      {
        id: `r${Date.now()}`,
        name: `R${nextIdx}`,
        resistance: 10,
        unit: 'Ω',
        ratingWatts: 0.5,
        tolerancePct: 5,
      },
    ]);
  };

  const handleRemoveResistor = (id: string) => {
    if (resistors.length <= 2) return;
    setResistors((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateResistor = (id: string, updates: Partial<ResistorItem>) => {
    setResistors((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const calculateCircuit = () => {
    if (!isSwitchClosed || sourceVoltage <= 0) {
      return {
        rTotal: 0,
        iTotal: 0,
        pTotal: 0,
        details: resistors.map((r) => ({
          ...r,
          voltageDrop: 0,
          current: 0,
          powerDissipated: 0,
          isOverloaded: false,
        })),
      };
    }

    if (circuitType === 'series') {
      const rTotal = resistors.reduce((sum, r) => sum + (r.resistance > 0 ? r.resistance : 0), 0);
      const iTotal = rTotal > 0 ? sourceVoltage / rTotal : 0;
      const pTotal = sourceVoltage * iTotal;

      const details = resistors.map((r) => {
        const vDrop = iTotal * r.resistance;
        const pDiss = iTotal * iTotal * r.resistance;
        const isOverloaded = pDiss > r.ratingWatts;
        return {
          ...r,
          voltageDrop: vDrop,
          current: iTotal,
          powerDissipated: pDiss,
          isOverloaded,
        };
      });

      return { rTotal, iTotal, pTotal, details };
    } else {
      let conductanceSum = 0;
      resistors.forEach((r) => {
        if (r.resistance > 0) conductanceSum += 1 / r.resistance;
      });

      const rTotal = conductanceSum > 0 ? 1 / conductanceSum : 0;
      const iTotal = rTotal > 0 ? sourceVoltage / rTotal : 0;
      const pTotal = sourceVoltage * iTotal;

      const details = resistors.map((r) => {
        const vDrop = sourceVoltage;
        const iBranch = r.resistance > 0 ? sourceVoltage / r.resistance : 0;
        const pDiss = vDrop * iBranch;
        const isOverloaded = pDiss > r.ratingWatts;
        return {
          ...r,
          voltageDrop: vDrop,
          current: iBranch,
          powerDissipated: pDiss,
          isOverloaded,
        };
      });

      return { rTotal, iTotal, pTotal, details };
    }
  };

  const results = calculateCircuit();

  const calculateDivider = () => {
    if (dividerVoutTarget >= dividerVin || dividerVin <= 0 || dividerR1 <= 0) {
      return { r2Ideal: 0, actualVout: 0, current: 0 };
    }
    const r2Ideal = (dividerR1 * dividerVoutTarget) / (dividerVin - dividerVoutTarget);
    let actualVout = (dividerVin * r2Ideal) / (dividerR1 + r2Ideal);

    if (dividerLoadRL > 0) {
      const r2Parallel = (r2Ideal * dividerLoadRL) / (r2Ideal + dividerLoadRL);
      actualVout = (dividerVin * r2Parallel) / (dividerR1 + r2Parallel);
    }
    const current = dividerVin / (dividerR1 + r2Ideal);

    return {
      r2Ideal,
      actualVout,
      current,
    };
  };

  const dividerResults = calculateDivider();

  return (
    <section id="circuit" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{lang === 'zh' ? '多路网络仿真 · 基尔霍夫定律' : 'CIRCUIT SIMULATOR · KIRCHHOFF LAWS'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === 'zh' ? '串联、并联与分压网络多路电路分析器' : 'Series, Parallel & Voltage Divider Solver'}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              {lang === 'zh'
                ? '支持任意增减电阻支路、独立配置各元件阻值与额定耐受功率。提供动态电荷流动动画、开关通断控制与元件过载烧毁警报。'
                : 'Simulate series, parallel, and voltage divider topologies with live animated charges, overload detection, and component ratings.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setCircuitType('series')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                circuitType === 'series'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'zh' ? '串联电路' : 'Series'}</span>
            </button>
            <button
              onClick={() => setCircuitType('parallel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                circuitType === 'parallel'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Split className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'zh' ? '并联电路' : 'Parallel'}</span>
            </button>
            <button
              onClick={() => setCircuitType('divider')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                circuitType === 'divider'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'zh' ? '分压器设计' : 'Voltage Divider'}</span>
            </button>
          </div>
        </div>
      </div>

      {circuitType === 'divider' ? (
        /* Voltage Divider Mode */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="max-w-xl">
            <h3 className="text-base font-bold text-slate-900">
              {lang === 'zh' ? '精密电阻分压器参数设计' : 'Precision Voltage Divider Designer'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              给定输入电压 Vin 与目标输出电压 Vout，由分压公式 Vout = Vin × R2 / (R1 + R2) 反求最佳下拉电阻 R2。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-mono text-slate-600 mb-1">输入电压 Vin (V)</label>
              <input
                type="number"
                value={dividerVin}
                onChange={(e) => setDividerVin(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-mono text-slate-600 mb-1">目标输出 Vout (V)</label>
              <input
                type="number"
                value={dividerVoutTarget}
                onChange={(e) => setDividerVoutTarget(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-mono text-slate-600 mb-1">上拉电阻 R1 (Ω)</label>
              <input
                type="number"
                value={dividerR1}
                onChange={(e) => setDividerR1(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-mono text-slate-600 mb-1">负载电阻 RL (0为开路)</label>
              <input
                type="number"
                value={dividerLoadRL}
                placeholder="0"
                onChange={(e) => setDividerLoadRL(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-1">
              <div className="text-xs text-slate-600">所需下拉电阻 R2 理论值:</div>
              <div className="text-2xl font-mono font-bold text-blue-700">
                {formatValue(dividerResults.r2Ideal)} Ω
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {dividerResults.r2Ideal > 1000
                  ? `≈ ${(dividerResults.r2Ideal / 1000).toFixed(2)} kΩ`
                  : ''}
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-1">
              <div className="text-xs text-slate-600">实际端输出电压 Vout:</div>
              <div className="text-2xl font-mono font-bold text-emerald-700">
                {formatValue(dividerResults.actualVout)} V
              </div>
              <div className="text-[11px] text-slate-500">
                {dividerLoadRL > 0 ? `考虑 ${dividerLoadRL}Ω 负载后` : '空载理想状态'}
              </div>
            </div>

            <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100 space-y-1">
              <div className="text-xs text-slate-600">分压偏置静态电流:</div>
              <div className="text-2xl font-mono font-bold text-sky-700">
                {formatValue(dividerResults.current * 1000)} mA
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                功耗: {formatValue(dividerVin * dividerResults.current * 1000)} mW
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Series / Parallel Standard Mode */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Resistor Table (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Source Voltage & Switch Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {lang === 'zh' ? '直流电源电压与回路开关' : 'DC Source & Circuit Switch'}
                </span>
                <button
                  onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    isSwitchClosed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isSwitchClosed ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'zh' ? '电路导通 (ON)' : 'Closed (ON)'}</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>{lang === 'zh' ? '电路断开 (OFF)' : 'Open (OFF)'}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>{lang === 'zh' ? '电源总电压 (U_total)' : 'Total Voltage'}</span>
                    <span className="font-mono text-blue-700 font-bold">{sourceVoltage} V</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="48"
                    step="0.5"
                    value={sourceVoltage}
                    onChange={(e) => setSourceVoltage(parseFloat(e.target.value) || 0)}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <input
                  type="number"
                  value={sourceVoltage}
                  onChange={(e) => setSourceVoltage(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-900 text-right focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Resistor List Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {lang === 'zh' ? '电路元件配置表' : 'Resistor Configuration'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'zh' ? '可独立调整每个电阻阻值与额定功率耐受值' : 'Configure individual resistance and power ratings.'}
                  </p>
                </div>
                <button
                  onClick={handleAddResistor}
                  disabled={resistors.length >= 8}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? `添加电阻 (${resistors.length}/8)` : `Add (${resistors.length}/8)`}</span>
                </button>
              </div>

              <div className="space-y-3">
                {resistors.map((r, idx) => {
                  const detail = results.details.find((d) => d.id === r.id);
                  return (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        detail?.isOverloaded
                          ? 'bg-rose-50/50 border-rose-300'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-mono font-bold text-xs flex items-center justify-center">
                            R{idx + 1}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0.1"
                              step="0.5"
                              value={r.resistance}
                              onChange={(e) =>
                                handleUpdateResistor(r.id, {
                                  resistance: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-20 bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-mono text-slate-900 text-right focus:outline-none focus:border-blue-600"
                            />
                            <span className="text-xs font-mono text-slate-500">Ω</span>
                          </div>
                        </div>

                        {/* Power rating selector */}
                        <div className="flex items-center gap-2">
                          <div className="text-[11px] text-slate-500 font-mono">
                            耐受功率:
                            <select
                              value={r.ratingWatts}
                              onChange={(e) =>
                                handleUpdateResistor(r.id, {
                                  ratingWatts: parseFloat(e.target.value),
                                })
                              }
                              className="ml-1 bg-white text-slate-800 text-xs px-2 py-1 rounded-lg border border-slate-300"
                            >
                              <option value="0.125">1/8 W</option>
                              <option value="0.25">1/4 W</option>
                              <option value="0.5">1/2 W</option>
                              <option value="1">1 W</option>
                              <option value="2">2 W</option>
                              <option value="5">5 W</option>
                            </select>
                          </div>

                          <button
                            onClick={() => handleRemoveResistor(r.id)}
                            disabled={resistors.length <= 2}
                            title="删除该电阻"
                            className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-20 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Telemetry row */}
                      <div className="mt-2.5 pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-xs font-mono">
                        <div>
                          <span className="text-slate-500">分压: </span>
                          <span className="text-slate-900 font-semibold">
                            {formatValue(detail?.voltageDrop)} V
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">分流: </span>
                          <span className="text-slate-900 font-semibold">
                            {formatValue(detail?.current)} A
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500">功耗: </span>
                          <span
                            className={`font-semibold ${
                              detail?.isOverloaded ? 'text-rose-600 font-bold' : 'text-slate-900'
                            }`}
                          >
                            {formatValue(detail?.powerDissipated)} W
                          </span>
                        </div>
                      </div>

                      {detail?.isOverloaded && (
                        <div className="mt-2 text-[11px] font-semibold text-rose-700 flex items-center gap-1.5 bg-rose-100/70 p-1.5 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>元件过载警告: 耗散功率 ({formatValue(detail.powerDissipated)}W) 超过标称 {r.ratingWatts}W！</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Schematic & Total Outputs (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Visual Circuit Schematic Canvas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="font-bold text-slate-900">
                    {lang === 'zh' ? '交互式电路仿真原理图' : 'Live Circuit Schematic'}
                  </span>
                </div>
                <span className="font-mono text-slate-500">
                  {circuitType === 'series' ? '纯串联拓扑' : '纯并联网络'}
                </span>
              </div>

              {/* Schematic SVG */}
              <div className="w-full aspect-[16/10] max-h-[300px] bg-slate-50 rounded-xl my-4 relative flex items-center justify-center p-2 overflow-hidden border border-slate-200">
                <svg viewBox="0 0 500 300" className="w-full h-full select-none">
                  {circuitType === 'series' ? (
                    <g>
                      <rect
                        x="60"
                        y="40"
                        width="380"
                        height="220"
                        rx="10"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="3.5"
                      />

                      {isSwitchClosed && (
                        <rect
                          x="60"
                          y="40"
                          width="380"
                          height="220"
                          rx="10"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                          strokeDasharray="8 6"
                          className="animate-[dash_1s_linear_infinite]"
                          opacity="0.85"
                        />
                      )}

                      {/* DC Battery Source */}
                      <g transform="translate(60, 150)">
                        <rect x="-15" y="-30" width="30" height="60" fill="#f8fafc" />
                        <line x1="-15" y1="-12" x2="15" y2="-12" stroke="#f59e0b" strokeWidth="4" />
                        <line x1="-8" y1="12" x2="8" y2="12" stroke="#64748b" strokeWidth="6" />
                        <text x="-25" y="-10" fill="#f59e0b" fontSize="12" fontWeight="bold">
                          +
                        </text>
                        <text x="-25" y="16" fill="#64748b" fontSize="12" fontWeight="bold">
                          -
                        </text>
                        <text
                          x="-35"
                          y="3"
                          fill="#0f172a"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono"
                          textAnchor="end"
                        >
                          {sourceVoltage}V
                        </text>
                      </g>

                      {/* Top Switch */}
                      <g transform="translate(250, 40)">
                        <rect x="-25" y="-15" width="50" height="30" fill="#f8fafc" />
                        <circle cx="-16" cy="0" r="3.5" fill="#475569" />
                        <circle cx="16" cy="0" r="3.5" fill="#475569" />
                        {isSwitchClosed ? (
                          <line x1="-16" y1="0" x2="16" y2="0" stroke="#10b981" strokeWidth="3" />
                        ) : (
                          <line x1="-16" y1="0" x2="8" y2="-16" stroke="#ef4444" strokeWidth="3" />
                        )}
                        <text x="0" y="-12" fill="#64748b" fontSize="10" textAnchor="middle">
                          {isSwitchClosed ? '闭合' : '断开'}
                        </text>
                      </g>

                      {/* Resistors */}
                      {resistors.map((r, i) => {
                        const total = resistors.length;
                        const xStep = 320 / (total + 1);
                        const posX = 420 - (i + 1) * xStep;
                        const posY = 260;
                        const detail = results.details.find((d) => d.id === r.id);

                        return (
                          <g key={r.id} transform={`translate(${posX}, ${posY})`}>
                            <rect x="-25" y="-10" width="50" height="20" fill="#f8fafc" />
                            <rect
                              x="-20"
                              y="-8"
                              width="40"
                              height="16"
                              rx="3"
                              fill={detail?.isOverloaded ? '#fee2e2' : '#ffffff'}
                              stroke={detail?.isOverloaded ? '#ef4444' : '#475569'}
                              strokeWidth="1.5"
                            />
                            <line x1="-10" y1="-8" x2="-10" y2="8" stroke="#f59e0b" strokeWidth="2" />
                            <line x1="0" y1="-8" x2="0" y2="8" stroke="#6366f1" strokeWidth="2" />
                            <line x1="10" y1="-8" x2="10" y2="8" stroke="#10b981" strokeWidth="2" />

                            <text
                              x="0"
                              y="-14"
                              fill="#0f172a"
                              fontSize="11"
                              fontWeight="bold"
                              fontFamily="JetBrains Mono"
                              textAnchor="middle"
                            >
                              {r.name} ({r.resistance}Ω)
                            </text>
                            <text
                              x="0"
                              y="22"
                              fill="#4f46e5"
                              fontSize="10"
                              fontWeight="bold"
                              fontFamily="JetBrains Mono"
                              textAnchor="middle"
                            >
                              {formatValue(detail?.voltageDrop)}V
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  ) : (
                    <g>
                      {/* Parallel Schematic */}
                      <g transform="translate(60, 150)">
                        <line x1="0" y1="-90" x2="0" y2="90" stroke="#cbd5e1" strokeWidth="3.5" />
                        <rect x="-15" y="-30" width="30" height="60" fill="#f8fafc" />
                        <line x1="-15" y1="-12" x2="15" y2="-12" stroke="#f59e0b" strokeWidth="4" />
                        <line x1="-8" y1="12" x2="8" y2="12" stroke="#64748b" strokeWidth="6" />
                        <text x="-25" y="-10" fill="#f59e0b" fontSize="12" fontWeight="bold">
                          +
                        </text>
                        <text x="-25" y="16" fill="#64748b" fontSize="12" fontWeight="bold">
                          -
                        </text>
                        <text
                          x="-30"
                          y="3"
                          fill="#0f172a"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="JetBrains Mono"
                          textAnchor="end"
                        >
                          {sourceVoltage}V
                        </text>
                      </g>

                      <line x1="60" y1="60" x2="440" y2="60" stroke="#cbd5e1" strokeWidth="3" />
                      <line x1="60" y1="240" x2="440" y2="240" stroke="#cbd5e1" strokeWidth="3" />

                      {/* Switch */}
                      <g transform="translate(100, 60)">
                        <rect x="-15" y="-12" width="30" height="24" fill="#f8fafc" />
                        <circle cx="-10" cy="0" r="3" fill="#475569" />
                        <circle cx="10" cy="0" r="3" fill="#475569" />
                        {isSwitchClosed ? (
                          <line x1="-10" y1="0" x2="10" y2="0" stroke="#10b981" strokeWidth="3" />
                        ) : (
                          <line x1="-10" y1="0" x2="6" y2="-12" stroke="#ef4444" strokeWidth="3" />
                        )}
                      </g>

                      {/* Branches */}
                      {resistors.map((r, i) => {
                        const total = resistors.length;
                        const xStep = 280 / total;
                        const posX = 150 + (i + 0.5) * xStep;
                        const detail = results.details.find((d) => d.id === r.id);

                        return (
                          <g key={r.id}>
                            <line
                              x1={posX}
                              y1="60"
                              x2={posX}
                              y2="240"
                              stroke={isSwitchClosed ? '#6366f1' : '#cbd5e1'}
                              strokeWidth="2.5"
                            />
                            <circle cx={posX} cy="60" r="3" fill="#6366f1" />
                            <circle cx={posX} cy="240" r="3" fill="#6366f1" />

                            <g transform={`translate(${posX}, 150)`}>
                              <rect x="-10" y="-22" width="20" height="44" fill="#f8fafc" />
                              <rect
                                x="-8"
                                y="-18"
                                width="16"
                                height="36"
                                rx="3"
                                fill={detail?.isOverloaded ? '#fee2e2' : '#ffffff'}
                                stroke={detail?.isOverloaded ? '#ef4444' : '#475569'}
                                strokeWidth="1.5"
                              />
                              <text
                                x="-14"
                                y="0"
                                fill="#0f172a"
                                fontSize="11"
                                fontWeight="bold"
                                fontFamily="JetBrains Mono"
                                textAnchor="end"
                                dominantBaseline="middle"
                              >
                                {r.name}
                              </text>
                              <text
                                x="14"
                                y="-6"
                                fill="#4f46e5"
                                fontSize="10"
                                fontWeight="bold"
                                fontFamily="JetBrains Mono"
                                textAnchor="start"
                              >
                                {r.resistance}Ω
                              </text>
                              <text
                                x="14"
                                y="8"
                                fill="#0284c7"
                                fontSize="10"
                                fontWeight="bold"
                                fontFamily="JetBrains Mono"
                                textAnchor="start"
                              >
                                {formatValue(detail?.current)}A
                              </text>
                            </g>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </svg>
              </div>

              <div className="w-full text-center text-xs text-slate-500">
                {isSwitchClosed
                  ? '电路处于正常导通闭合状态，电荷流动顺畅'
                  : '电路已断开开路，电流为零'}
              </div>
            </div>

            {/* Total Results Summary Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  全电路等效综述
                </span>
                <span className="text-xs font-mono text-blue-700 font-bold">
                  {circuitType === 'series' ? 'R_eq = ∑ R_i' : '1/R_eq = ∑ 1/R_i'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">等效总电阻</div>
                  <div className="text-xl font-mono font-bold text-blue-700">
                    {formatValue(results.rTotal)} Ω
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">主回路总电流</div>
                  <div className="text-xl font-mono font-bold text-sky-700">
                    {formatValue(results.iTotal)} A
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 mb-0.5">全电路总功率</div>
                  <div className="text-xl font-mono font-bold text-rose-700">
                    {formatValue(results.pTotal)} W
                  </div>
                </div>
              </div>

              {/* Theorem summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-slate-800">
                  {circuitType === 'series' ? '串联电路核心物理定理:' : '并联电路核心物理定理:'}
                </div>
                {circuitType === 'series' ? (
                  <p className="text-slate-600 leading-relaxed">
                    1. <strong>电流处处相等</strong>: I_1 = I_2 = ... = I_total。<br />
                    2. <strong>串联分压正比于电阻</strong>: U_k = U_total × (R_k / R_eq)，阻值越大分配到的电压越高。<br />
                    3. <strong>串联总电阻恒大于任一分电阻</strong>: R_eq = R_1 + R_2 + ... + R_n。
                  </p>
                ) : (
                  <p className="text-slate-600 leading-relaxed">
                    1. <strong>各支路电压处处相等</strong>: U_1 = U_2 = ... = U_total。<br />
                    2. <strong>并联分流反比于电阻</strong>: 阻值越小的支路流过的分流越大 (I_k = U / R_k)。<br />
                    3. <strong>并联总电阻恒小于任一分电阻</strong>: 并联支路越多，总等效电阻越小。
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
