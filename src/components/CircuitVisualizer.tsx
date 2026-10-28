/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId, useState } from 'react';
import { get4BandResistorColors } from '../utils/resistorCode';
import { formatValueWithPrecision, PrecisionMode, evaluatePowerSafety } from '../utils/calculator';
import { Play, Pause, Zap, Activity, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

interface CircuitVisualizerProps {
  voltage: number | null;
  current: number | null;
  resistance: number | null;
  power: number | null;
  precisionMode: PrecisionMode;
  precisionDigits: number;
}

export const CircuitVisualizer: React.FC<CircuitVisualizerProps> = ({
  voltage,
  current,
  resistance,
  power,
  precisionMode,
  precisionDigits,
}) => {
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const [flowType, setFlowType] = useState<'conventional' | 'electron'>('conventional');
  const [showTooltip, setShowTooltip] = useState(false);
  const uniqueId = useId();

  // Effective values based on switch state
  const effVoltage = isSwitchClosed ? (voltage ?? 0) : 0;
  const effCurrent = isSwitchClosed ? (current ?? 0) : 0;
  const effPower = isSwitchClosed ? (power ?? 0) : 0;
  const effResistance = resistance ?? 100;

  // Resistor color bands
  const bands = get4BandResistorColors(effResistance);

  // Power thermal safety
  const safety = evaluatePowerSafety(effPower);

  // Speed of animated electron flow based on current
  // Normalized speed: 0A -> paused, 0.01A -> slow, 1A -> moderate, 10A -> fast
  const flowSpeedSeconds = effCurrent > 0 
    ? Math.max(0.35, Math.min(4.0, 2.5 / Math.pow(Math.abs(effCurrent), 0.35)))
    : 0;

  const isFlowing = isSwitchClosed && effCurrent > 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-sm">
      {/* Visualizer Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 tracking-tight">
              Interactive Schematic & Dynamic Electron Flow
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live DC circuit simulation with physical charge transport visualization
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Switch Button */}
          <button
            onClick={() => setIsSwitchClosed(!isSwitchClosed)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              isSwitchClosed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
            }`}
            title="Toggle knife switch in circuit"
          >
            {isSwitchClosed ? (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" /> Circuit Closed
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" /> Circuit Open
              </>
            )}
          </button>

          {/* Flow Direction Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFlowType('conventional')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                flowType === 'conventional'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Conventional (+ → −)
            </button>
            <button
              onClick={() => setFlowType('electron')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                flowType === 'electron'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Electrons (− → +)
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Schematic Canvas */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 800 460"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id={`grid-${uniqueId}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>

            {/* Linear gradient for battery positive/negative plates */}
            <linearGradient id={`goldGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Glowing filter for hot resistor */}
            <filter id={`heatGlow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Animated electron dash styles */}
            <style>
              {`
                @keyframes flowConventional {
                  0% { stroke-dashoffset: 40; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes flowElectron {
                  0% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: 40; }
                }
                .flow-path-anim {
                  animation: ${
                    isFlowing
                      ? flowType === 'conventional'
                        ? `flowConventional ${flowSpeedSeconds}s linear infinite`
                        : `flowElectron ${flowSpeedSeconds}s linear infinite`
                      : 'none'
                  };
                }
              `}
            </style>
          </defs>

          {/* Background Grid */}
          <rect width="800" height="460" fill={`url(#grid-${uniqueId})`} />

          {/* Circuit Loop Outline Coordinates:
              Top wire: (120, 100) -> Switch -> Ammeter -> (680, 100)
              Right wire: (680, 100) -> Resistor -> (680, 360)
              Bottom wire: (680, 360) -> (120, 360)
              Left wire: (120, 360) -> Battery -> (120, 100)
          */}

          {/* STATIC WIRE BACKDROP (Dark Copper / Slate) */}
          <path
            d="M 120 200 L 120 100 L 250 100 M 310 100 L 400 100 M 460 100 L 680 100 L 680 190 M 680 270 L 680 360 L 120 360 L 120 260"
            fill="none"
            stroke="#334155"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* DYNAMIC ELECTRON / CURRENT CHARGE FLOW PATH (Only when switch closed) */}
          {isFlowing && (
            <path
              d="M 120 200 L 120 100 L 250 100 L 310 100 L 400 100 L 460 100 L 680 100 L 680 190 L 680 270 L 680 360 L 120 360 L 120 260 Z"
              fill="none"
              stroke={flowType === 'conventional' ? '#06b6d4' : '#38bdf8'}
              strokeWidth="3"
              strokeDasharray="6 14"
              strokeLinecap="round"
              className="flow-path-anim"
            />
          )}

          {/* ===================== DC POWER SUPPLY / BATTERY (Left Side, centered at Y=230) ===================== */}
          <g transform="translate(120, 230)">
            {/* Long Plate (Positive, Top) */}
            <line x1="-32" y1="-15" x2="32" y2="-15" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            <text x="42" y="-10" fill="#f59e0b" fontSize="16" fontFamily="JetBrains Mono" fontWeight="bold">
              +
            </text>

            {/* Short Plate (Negative, Bottom) */}
            <line x1="-16" y1="15" x2="16" y2="15" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
            <text x="26" y="22" fill="#94a3b8" fontSize="16" fontFamily="JetBrains Mono" fontWeight="bold">
              −
            </text>

            {/* DC Source Label & Digital Readout Box */}
            <g transform="translate(-110, -35)">
              <rect width="90" height="70" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="45" y="20" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle" fontWeight="bold">
                DC SOURCE
              </text>
              <text x="45" y="44" fill="#f59e0b" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                {formatValueWithPrecision(effVoltage, precisionMode, precisionDigits)}
              </text>
              <text x="45" y="58" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                VOLTS
              </text>
            </g>
          </g>

          {/* ===================== KNIFE SWITCH (Top wire, X=250 to 310, Y=100) ===================== */}
          <g transform="translate(250, 100)">
            <circle cx="0" cy="0" r="4.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            <circle cx="60" cy="0" r="4.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="2" />
            {isSwitchClosed ? (
              <line x1="0" y1="0" x2="60" y2="0" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
            ) : (
              <line x1="0" y1="0" x2="48" y2="-28" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
            )}
            <text x="30" y="24" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              SW {isSwitchClosed ? '(ON)' : '(OFF)'}
            </text>
          </g>

          {/* ===================== AMMETER IN SERIES (Top wire, centered at X=430, Y=100) ===================== */}
          <g transform="translate(430, 100)">
            <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="0" y="-4" fill="#06b6d4" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              A
            </text>
            <text x="0" y="12" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              {formatValueWithPrecision(effCurrent, precisionMode, precisionDigits)}A
            </text>
            <text x="0" y="-30" fill="#64748b" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              Ammeter (Series)
            </text>
          </g>

          {/* ===================== RESISTOR LOAD (Right Side, centered at X=680, Y=230) ===================== */}
          <g transform="translate(680, 230)">
            {/* Glow if dangerous wattage */}
            {!safety.safe && isFlowing && (
              <rect
                x="-26"
                y="-45"
                width="52"
                height="90"
                rx="14"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
                opacity="0.8"
                filter={`url(#heatGlow-${uniqueId})`}
              />
            )}

            {/* Ceramic Resistor Body */}
            <rect
              x="-20"
              y="-40"
              width="40"
              height="80"
              rx="10"
              fill="#d6c5a0"
              stroke="#8c7851"
              strokeWidth="2"
            />

            {/* 4 Color Bands (EIA Standard) */}
            {/* Band 1: First digit */}
            <rect x="-20" y="-28" width="40" height="7" fill={bands.band1.colorHex} />
            {/* Band 2: Second digit */}
            <rect x="-20" y="-14" width="40" height="7" fill={bands.band2.colorHex} />
            {/* Band 3: Multiplier */}
            <rect x="-20" y="0" width="40" height="7" fill={bands.multiplierBand.colorHex} />
            {/* Band 4: Tolerance */}
            <rect x="-20" y="18" width="40" height="7" fill={bands.toleranceBand.colorHex} />

            {/* Resistor Lead wires */}
            <line x1="0" y1="-40" x2="0" y2="-45" stroke="#94a3b8" strokeWidth="4" />
            <line x1="0" y1="40" x2="0" y2="45" stroke="#94a3b8" strokeWidth="4" />

            {/* Resistor Specs Label Card */}
            <g transform="translate(40, -40)">
              <rect width="130" height="82" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="65" y="18" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" fontWeight="bold" textAnchor="middle">
                LOAD RESISTOR R
              </text>
              <text x="65" y="38" fill="#38bdf8" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                {formatValueWithPrecision(effResistance, precisionMode, precisionDigits)} Ω
              </text>
              <text x="65" y="54" fill="#a78bfa" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                P: {formatValueWithPrecision(effPower, precisionMode, precisionDigits)} W
              </text>
              <text
                x="65"
                y="70"
                fill={safety.safe ? '#10b981' : '#f43f5e'}
                fontSize="9.5"
                fontFamily="JetBrains Mono"
                fontWeight="semibold"
                textAnchor="middle"
              >
                {safety.safe ? `PKG: ${safety.rating}` : 'HOT: HEATSINK REQ'}
              </text>
            </g>
          </g>

          {/* ===================== VOLTMETER IN PARALLEL (Across Resistor) ===================== */}
          {/* Voltmeter probe leads */}
          <path
            d="M 680 180 C 620 180, 580 200, 580 230 C 580 260, 620 280, 680 280"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Red & Black Probe points */}
          <circle cx="680" cy="180" r="4" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="680" cy="280" r="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Voltmeter Dial */}
          <g transform="translate(540, 230)">
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
            <text x="0" y="-4" fill="#a855f7" fontSize="14" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
              V
            </text>
            <text x="0" y="13" fill="#e2e8f0" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              {formatValueWithPrecision(effVoltage, precisionMode, precisionDigits)}V
            </text>
            <text x="0" y="42" fill="#64748b" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              Voltmeter (Parallel)
            </text>
          </g>

          {/* Flow Direction Indicator arrow in bottom wire */}
          {isFlowing && (
            <g transform="translate(400, 360)">
              {flowType === 'conventional' ? (
                // Right to left on bottom wire
                <path d="M 15 -6 L -10 0 L 15 6 Z" fill="#06b6d4" />
              ) : (
                // Left to right on bottom wire
                <path d="M -15 -6 L 10 0 L -15 6 Z" fill="#38bdf8" />
              )}
              <text x="0" y="-12" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                {flowType === 'conventional' ? 'Current I (←)' : 'Electrons e⁻ (→)'}
              </text>
            </g>
          )}
        </svg>

        {/* Floating Circuit Parameter HUD */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 backdrop-blur-md shadow-lg flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Loop Status</span>
            <span className={`font-mono font-semibold ${isFlowing ? 'text-emerald-400' : 'text-slate-400'}`}>
              {isFlowing ? '● CURRENT FLOWING' : '○ CIR OPEN / IDLE'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Current Density</span>
            <span className="font-mono text-cyan-400 font-semibold">
              {formatValueWithPrecision(effCurrent, precisionMode, precisionDigits)} A
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">Heat Dissipation</span>
            <span className="font-mono text-amber-400 font-semibold">
              {formatValueWithPrecision(effPower, precisionMode, precisionDigits)} W
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Resistor Band & Physical Specification Strip */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Color Band Card */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">4-Band Code:</span>
            <div className="flex items-center gap-1">
              <span
                className="w-4 h-4 rounded-sm border border-slate-700"
                style={{ backgroundColor: bands.band1.colorHex }}
                title={`Digit 1: ${bands.band1.name} (${bands.band1.value})`}
              />
              <span
                className="w-4 h-4 rounded-sm border border-slate-700"
                style={{ backgroundColor: bands.band2.colorHex }}
                title={`Digit 2: ${bands.band2.name} (${bands.band2.value})`}
              />
              <span
                className="w-4 h-4 rounded-sm border border-slate-700"
                style={{ backgroundColor: bands.multiplierBand.colorHex }}
                title={`Multiplier: ${bands.multiplierBand.name} (×${bands.multiplierBand.multiplier})`}
              />
              <span
                className="w-4 h-4 rounded-sm border border-slate-700"
                style={{ backgroundColor: bands.toleranceBand.colorHex }}
                title={`Tolerance: ${bands.toleranceBand.name} (±${bands.toleranceBand.tolerance}%)`}
              />
            </div>
            <span className="text-slate-300 font-mono ml-1">
              {bands.band1.name} · {bands.band2.name} · {bands.multiplierBand.name} · Gold (±5%)
            </span>
          </div>
        </div>

        {/* Safety & Package Rating */}
        <div
          className={`border rounded-lg p-3 flex items-center justify-between ${
            safety.safe
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {safety.safe ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">
              {safety.safe
                ? `Safe Power Level: ${safety.rating}`
                : `Thermal Warning: Exceeds standard package rating!`}
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80">{safety.recommendedPackage}</span>
        </div>
      </div>
    </div>
  );
};
