/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  solveSeriesNetwork,
  solveParallelNetwork,
  solveVoltageDivider,
  NetworkType,
} from '../utils/networkSolver';
import { formatValueWithPrecision, PrecisionMode } from '../utils/calculator';
import { Plus, Trash2, Sliders, GitBranch, Share2, Layers, Cpu } from 'lucide-react';

interface NetworkSchematicProps {
  precisionMode: PrecisionMode;
  precisionDigits: number;
}

export const NetworkSchematic: React.FC<NetworkSchematicProps> = ({
  precisionMode,
  precisionDigits,
}) => {
  const [networkType, setNetworkType] = useState<NetworkType>('series');
  const [sourceVoltage, setSourceVoltage] = useState<number>(12);

  // Series / Parallel resistors
  const [resistors, setResistors] = useState<{ id: string; label: string; resistance: number }[]>([
    { id: '1', label: 'R1', resistance: 100 },
    { id: '2', label: 'R2', resistance: 220 },
    { id: '3', label: 'R3', resistance: 470 },
  ]);

  // Voltage Divider specific state
  const [dividerR1, setDividerR1] = useState<number>(1000);
  const [dividerR2, setDividerR2] = useState<number>(2000);
  const [dividerRLoad, setDividerRLoad] = useState<number | null>(10000);
  const [hasLoad, setHasLoad] = useState<boolean>(true);

  // Add resistor
  const handleAddResistor = () => {
    if (resistors.length >= 6) return;
    const nextNum = resistors.length + 1;
    setResistors([
      ...resistors,
      { id: Date.now().toString(), label: `R${nextNum}`, resistance: 100 * nextNum },
    ]);
  };

  // Remove resistor
  const handleRemoveResistor = (id: string) => {
    if (resistors.length <= 2) return;
    setResistors(resistors.filter((r) => r.id !== id));
  };

  // Update resistor resistance
  const handleUpdateResistance = (id: string, val: number) => {
    setResistors(
      resistors.map((r) => (r.id === id ? { ...r, resistance: Math.max(0.1, val) } : r))
    );
  };

  // Solved states
  const seriesSolution = solveSeriesNetwork(sourceVoltage, resistors);
  const parallelSolution = solveParallelNetwork(sourceVoltage, resistors);
  const dividerSolution = solveVoltageDivider(
    sourceVoltage,
    dividerR1,
    dividerR2,
    hasLoad ? dividerRLoad : null
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
      {/* Header and Topology Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" /> Multi-Component Circuit Network Designer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyze complex topologies, equivalent impedance, nodal voltages, and current division
          </p>
        </div>

        {/* Segmented Topology Control */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setNetworkType('series')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              networkType === 'series'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Series Circuit
          </button>
          <button
            onClick={() => setNetworkType('parallel')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              networkType === 'parallel'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Parallel Circuit
          </button>
          <button
            onClick={() => setNetworkType('voltage_divider')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              networkType === 'voltage_divider'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Voltage Divider & Load
          </button>
        </div>
      </div>

      {/* Global Source Voltage Control */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Power Source Voltage (V_total):</span>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="any"
              min="0.1"
              value={sourceVoltage}
              onChange={(e) => setSourceVoltage(Math.max(0.1, parseFloat(e.target.value) || 1))}
              className="w-24 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
            <span className="text-xs text-slate-400 font-mono">Volts</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 mr-1">Presets:</span>
          {[3.3, 5, 9, 12, 24, 48].map((preset) => (
            <button
              key={preset}
              onClick={() => setSourceVoltage(preset)}
              className={`px-2 py-0.5 rounded font-mono text-xs border ${
                sourceVoltage === preset
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset}V
            </button>
          ))}
        </div>
      </div>

      {/* ======================= CASE 1 & 2: SERIES / PARALLEL ======================= */}
      {networkType !== 'voltage_divider' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Component List & Slider Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Resistor Network Elements ({resistors.length})
              </span>
              <button
                onClick={handleAddResistor}
                disabled={resistors.length >= 6}
                className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-cyan-300 rounded border border-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Resistor
              </button>
            </div>

            <div className="space-y-3">
              {resistors.map((r, idx) => (
                <div
                  key={r.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {r.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="any"
                          min="0.1"
                          value={r.resistance}
                          onChange={(e) =>
                            handleUpdateResistance(r.id, parseFloat(e.target.value) || 1)
                          }
                          className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-slate-200 text-right focus:outline-none focus:border-cyan-500"
                        />
                        <span className="text-xs text-slate-400 font-mono">Ω</span>
                      </div>
                      {resistors.length > 2 && (
                        <button
                          onClick={() => handleRemoveResistor(r.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                          title="Remove resistor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Resistor fine-tuning slider */}
                  <input
                    type="range"
                    min="1"
                    max="2000"
                    step="1"
                    value={r.resistance}
                    onChange={(e) => handleUpdateResistance(r.id, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              ))}
            </div>

            {/* Equivalent Summary Box */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-lg p-3.5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                Network Equivalent Parameters
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total R_eq</div>
                  <div className="text-sm font-mono font-bold text-slate-100">
                    {formatValueWithPrecision(
                      networkType === 'series'
                        ? seriesSolution.totalResistance
                        : parallelSolution.totalResistance,
                      precisionMode,
                      precisionDigits
                    )}
                    Ω
                  </div>
                </div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Current</div>
                  <div className="text-sm font-mono font-bold text-cyan-400">
                    {formatValueWithPrecision(
                      networkType === 'series'
                        ? seriesSolution.totalCurrent
                        : parallelSolution.totalCurrent,
                      precisionMode,
                      precisionDigits
                    )}
                    A
                  </div>
                </div>
                <div className="p-2 bg-slate-900/80 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-400">Total Power</div>
                  <div className="text-sm font-mono font-bold text-amber-400">
                    {formatValueWithPrecision(
                      networkType === 'series'
                        ? seriesSolution.totalPower
                        : parallelSolution.totalPower,
                      precisionMode,
                      precisionDigits
                    )}
                    W
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Schematic Topology & Per-Component Table */}
          <div className="lg:col-span-7 space-y-4">
            {/* SVG Visual Schematic of Series or Parallel */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 aspect-[16/9] max-h-[300px] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 700 320" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="netGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="700" height="320" fill="url(#netGrid)" />

                {/* Left Battery */}
                <g transform="translate(80, 160)">
                  <line x1="0" y1="-80" x2="0" y2="-12" stroke="#475569" strokeWidth="4" />
                  <line x1="0" y1="12" x2="0" y2="80" stroke="#475569" strokeWidth="4" />
                  <line x1="-24" y1="-12" x2="24" y2="-12" stroke="#f59e0b" strokeWidth="4" />
                  <line x1="-14" y1="12" x2="14" y2="12" stroke="#94a3b8" strokeWidth="6" />
                  <text x="32" y="-8" fill="#f59e0b" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">+</text>
                  <text x="22" y="16" fill="#94a3b8" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">−</text>
                  <text x="-10" y="36" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">{sourceVoltage}V</text>
                </g>

                {networkType === 'series' ? (
                  /* ================= SERIES SCHEMATIC ================= */
                  <g>
                    {/* Wires */}
                    <path d="M 80 80 L 160 80" fill="none" stroke="#475569" strokeWidth="4" />
                    <path d="M 80 240 L 620 240 L 620 80" fill="none" stroke="#475569" strokeWidth="4" />

                    {/* Resistors in a horizontal daisy chain */}
                    {seriesSolution.resistors.map((r, i) => {
                      const spacing = 460 / seriesSolution.resistors.length;
                      const startX = 160 + i * spacing;
                      const resX = startX + spacing * 0.5;

                      return (
                        <g key={r.id}>
                          {/* Inbound wire to resistor */}
                          <line x1={startX} y1="80" x2={resX - 25} y2="80" stroke="#475569" strokeWidth="4" />
                          {/* Resistor zig-zag or box */}
                          <rect
                            x={resX - 25}
                            y="68"
                            width="50"
                            height="24"
                            rx="4"
                            fill="#1e293b"
                            stroke="#06b6d4"
                            strokeWidth="2"
                          />
                          <text x={resX} y="84" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                            {r.label}
                          </text>

                          {/* Outbound wire */}
                          <line x1={resX + 25} y1="80" x2={startX + spacing} y2="80" stroke="#475569" strokeWidth="4" />

                          {/* Voltage drop & power under component */}
                          <text x={resX} y="112" fill="#38bdf8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                            {formatValueWithPrecision(r.voltageDrop, precisionMode, precisionDigits)}V
                          </text>
                          <text x={resX} y="126" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                            {formatValueWithPrecision(r.power, precisionMode, precisionDigits)}W
                          </text>
                        </g>
                      );
                    })}
                  </g>
                ) : (
                  /* ================= PARALLEL SCHEMATIC ================= */
                  <g>
                    {/* Top Bus & Bottom Bus */}
                    <line x1="80" y1="80" x2="620" y2="80" stroke="#475569" strokeWidth="4" />
                    <line x1="80" y1="240" x2="620" y2="240" stroke="#475569" strokeWidth="4" />

                    {/* Branches */}
                    {parallelSolution.resistors.map((r, i) => {
                      const spacing = 440 / parallelSolution.resistors.length;
                      const branchX = 180 + i * spacing;

                      return (
                        <g key={r.id}>
                          {/* Branch drop wire */}
                          <line x1={branchX} y1="80" x2={branchX} y2="135" stroke="#475569" strokeWidth="3" />
                          {/* Resistor */}
                          <rect
                            x={branchX - 14}
                            y="135"
                            width="28"
                            height="50"
                            rx="4"
                            fill="#1e293b"
                            stroke="#06b6d4"
                            strokeWidth="2"
                          />
                          <text x={branchX} y="165" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                            {r.label}
                          </text>
                          {/* Bottom wire to bus */}
                          <line x1={branchX} y1="185" x2={branchX} y2="240" stroke="#475569" strokeWidth="3" />

                          {/* Branch current */}
                          <text x={branchX + 22} y="155" fill="#06b6d4" fontSize="10" fontFamily="JetBrains Mono">
                            {formatValueWithPrecision(r.current, precisionMode, precisionDigits)}A
                          </text>
                          <text x={branchX + 22} y="170" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">
                            {formatValueWithPrecision(r.power, precisionMode, precisionDigits)}W
                          </text>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
            </div>

            {/* Per-Component Metrics Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5">Resistance (Ω)</th>
                    <th className="p-2.5">Voltage Drop (V)</th>
                    <th className="p-2.5">Current (A)</th>
                    <th className="p-2.5">Power (W)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
                  {(networkType === 'series'
                    ? seriesSolution.resistors
                    : parallelSolution.resistors
                  ).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-bold text-slate-100">{r.label}</td>
                      <td className="p-2.5">{r.resistance} Ω</td>
                      <td className="p-2.5 text-cyan-400">
                        {formatValueWithPrecision(r.voltageDrop, precisionMode, precisionDigits)} V
                      </td>
                      <td className="p-2.5 text-amber-400">
                        {formatValueWithPrecision(r.current, precisionMode, precisionDigits)} A
                      </td>
                      <td className="p-2.5 text-purple-400">
                        {formatValueWithPrecision(r.power, precisionMode, precisionDigits)} W
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Derivations breakdown */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-300 font-mono">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Network Derivation Steps
              </span>
              {(networkType === 'series'
                ? seriesSolution.derivationSteps
                : parallelSolution.derivationSteps
              ).map((step, sIdx) => (
                <div key={sIdx}>{step}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================= CASE 3: VOLTAGE DIVIDER ======================= */}
      {networkType === 'voltage_divider' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Divider Parameters
              </span>

              {/* R1 */}
              <div>
                <label className="text-xs text-slate-400 flex justify-between mb-1">
                  <span>Top Resistor (R1):</span>
                  <span className="font-mono text-cyan-300">{dividerR1} Ω</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={dividerR1}
                  onChange={(e) => setDividerR1(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* R2 */}
              <div>
                <label className="text-xs text-slate-400 flex justify-between mb-1">
                  <span>Bottom Resistor (R2):</span>
                  <span className="font-mono text-cyan-300">{dividerR2} Ω</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={dividerR2}
                  onChange={(e) => setDividerR2(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Load resistor toggle */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasLoad}
                      onChange={(e) => setHasLoad(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span>Attach Load Resistor (R_Load)</span>
                  </label>
                </div>

                {hasLoad && (
                  <div>
                    <label className="text-xs text-slate-400 flex justify-between mb-1">
                      <span>Load Resistance (R_L):</span>
                      <span className="font-mono text-amber-300">{dividerRLoad ?? 10000} Ω</span>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="50000"
                      step="50"
                      value={dividerRLoad ?? 10000}
                      onChange={(e) => setDividerRLoad(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Output KPI Box */}
            <div className="bg-slate-950 border border-emerald-500/30 rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                Divided Output Voltage (V_out)
              </span>
              <div className="text-3xl font-mono font-bold text-emerald-300 tabular-nums">
                {formatValueWithPrecision(dividerSolution.vOut, precisionMode, precisionDigits)} V
              </div>
              <p className="text-xs text-slate-400">
                Divider ratio: {((dividerSolution.vOut / sourceVoltage) * 100).toFixed(2)}% of source voltage
              </p>
            </div>
          </div>

          {/* Schematic & Derivation */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 aspect-[16/9] max-h-[300px] flex items-center justify-center">
              <svg viewBox="0 0 600 320" className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Wires */}
                {/* Top V_in rail */}
                <line x1="80" y1="40" x2="260" y2="40" stroke="#475569" strokeWidth="4" />
                <circle cx="80" cy="40" r="5" fill="#f59e0b" />
                <text x="70" y="25" fill="#f59e0b" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                  V_in ({sourceVoltage}V)
                </text>

                {/* Vertical leg through R1 */}
                <line x1="260" y1="40" x2="260" y2="80" stroke="#475569" strokeWidth="4" />
                {/* R1 */}
                <rect x="245" y="80" width="30" height="50" rx="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                <text x="260" y="110" fill="#e2e8f0" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  R1
                </text>
                <text x="295" y="110" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                  {dividerR1}Ω
                </text>

                {/* Center Node (V_out) */}
                <line x1="260" y1="130" x2="260" y2="190" stroke="#475569" strokeWidth="4" />
                <circle cx="260" cy="160" r="6" fill="#10b981" />

                {/* V_out branch to the right */}
                <line x1="260" y1="160" x2="440" y2="160" stroke="#10b981" strokeWidth="3" strokeDasharray="5 3" />
                <circle cx="440" cy="160" r="5" fill="#10b981" />
                <text x="455" y="165" fill="#10b981" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                  V_out = {formatValueWithPrecision(dividerSolution.vOut, precisionMode, precisionDigits)}V
                </text>

                {/* Vertical leg through R2 */}
                <rect x="245" y="190" width="30" height="50" rx="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                <text x="260" y="220" fill="#e2e8f0" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  R2
                </text>
                <text x="295" y="220" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono">
                  {dividerR2}Ω
                </text>

                {/* Bottom Ground rail */}
                <line x1="260" y1="240" x2="260" y2="280" stroke="#475569" strokeWidth="4" />
                <line x1="230" y1="280" x2="290" y2="280" stroke="#94a3b8" strokeWidth="4" />
                <line x1="240" y1="286" x2="280" y2="286" stroke="#94a3b8" strokeWidth="3" />
                <line x1="250" y1="292" x2="270" y2="292" stroke="#94a3b8" strokeWidth="2" />
                <text x="300" y="285" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">GND (0V)</text>

                {/* Optional R_load connected in parallel across R2 */}
                {hasLoad && (
                  <g>
                    <line x1="400" y1="160" x2="400" y2="190" stroke="#475569" strokeWidth="3" />
                    <rect x="385" y="190" width="30" height="50" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="400" y="220" fill="#f59e0b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                      R_L
                    </text>
                    <line x1="400" y1="240" x2="400" y2="280" stroke="#475569" strokeWidth="3" />
                    <line x1="400" y1="280" x2="260" y2="280" stroke="#475569" strokeWidth="3" />
                    <text x="400" y="145" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                      Load ({dividerRLoad}Ω)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Derivation */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs space-y-1 text-slate-300 font-mono">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Voltage Divider Mathematical Steps
              </span>
              {dividerSolution.derivation.map((d, dIdx) => (
                <div key={dIdx}>{d}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
