import React, { useState } from 'react';
import { CalculationResult, PrecisionConfig } from '../types/ohms';
import { formatWithPrecision, getUnitSymbol } from '../utils/unitConverter';
import { Zap, Power, Flame, Lightbulb, Activity } from 'lucide-react';

interface CircuitDiagramProps {
  result: CalculationResult;
  precision: PrecisionConfig;
}

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({
  result,
  precision,
}) => {
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  if (!result.isValid) {
    return (
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 min-h-[280px]">
        <Activity className="w-10 h-10 mb-2 text-slate-400 animate-pulse" />
        <p className="font-medium text-slate-700 dark:text-slate-300">电路不可用或输入参数待更正</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          请输入大于 0 的有效物理数值，系统将为您生成实时交互式电路示意图。
        </p>
      </div>
    );
  }

  const {
    u_display,
    u_unit,
    i_display,
    i_unit,
    r_display,
    r_unit,
    p_display,
    p_unit,
    i_amps,
    p_watts,
  } = result;

  // Calculate flow speed (animation duration) based on current in Amperes
  // Higher current -> faster flow (shorter duration e.g. 0.3s vs 3s)
  const animSpeed = isSwitchClosed && i_amps > 0 ? Math.max(0.2, Math.min(3, 2 / Math.sqrt(Math.max(i_amps, 0.001)))) : 0;

  // Heat glow calculation for resistor based on power
  const heatIntensity = isSwitchClosed ? Math.min(1, Math.max(0, Math.log10(p_watts + 1) / 4)) : 0;
  const resistorGlowColor = `rgba(239, 68, 68, ${0.15 + heatIntensity * 0.7})`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            直流电路动态可视化 (DC Circuit Visualization)
          </h3>
        </div>

        {/* Switch toggle control */}
        <button
          onClick={() => setIsSwitchClosed(!isSwitchClosed)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isSwitchClosed
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
          }`}
          title="点击切换开关状态"
        >
          <Power className="w-3.5 h-3.5" />
          {isSwitchClosed ? '开关：闭合 (ON)' : '开关：断开 (OFF)'}
        </button>
      </div>

      {/* SVG Canvas for Circuit */}
      <div className="relative w-full overflow-hidden bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-center justify-center">
        <svg
          viewBox="0 0 600 320"
          className="w-full h-auto max-h-[300px] select-none"
          role="img"
          aria-label="欧姆定律直流电路示意图"
        >
          <defs>
            {/* Glow filters for power and current */}
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-heat" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wire Background Path */}
          {/* Loop coordinates: Left (100, 160), Top (100, 50) -> (500, 50), Right (500, 160), Bottom (500, 270) -> (100, 270) */}
          <path
            d="M 100 160 L 100 50 L 500 50 L 500 270 L 100 270 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Conducting Wire */}
          <path
            d="M 100 160 L 100 50 L 500 50 L 500 270 L 100 270 Z"
            fill="none"
            stroke={isSwitchClosed ? '#38bdf8' : '#475569'}
            strokeWidth="3"
            strokeDasharray={isSwitchClosed ? '8 8' : 'none'}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: isSwitchClosed && animSpeed > 0 ? `flowAlongWire ${animSpeed}s linear infinite` : 'none',
            }}
          />

          {/* BATTERY / POWER SOURCE (Left Vertical Wire) */}
          <g transform="translate(100, 160)">
            <rect x="-30" y="-35" width="60" height="70" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            {/* Battery Plates */}
            <line x1="-18" y1="-15" x2="18" y2="-15" stroke="#38bdf8" strokeWidth="4" />
            <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#38bdf8" strokeWidth="2" />
            <line x1="-18" y1="5" x2="18" y2="5" stroke="#38bdf8" strokeWidth="4" />
            <line x1="-10" y1="15" x2="10" y2="15" stroke="#38bdf8" strokeWidth="2" />
            
            {/* Polarity indicators */}
            <text x="-35" y="-20" fill="#ef4444" fontSize="16" fontWeight="bold">+</text>
            <text x="-35" y="30" fill="#3b82f6" fontSize="16" fontWeight="bold">-</text>

            {/* Label U */}
            <rect x="-70" y="-12" width="65" height="24" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
            <text x="-38" y="4" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
              U = {formatWithPrecision(u_display, precision)} {getUnitSymbol(u_unit)}
            </text>
          </g>

          {/* SWITCH (Top Wire, near left-center) */}
          <g transform="translate(250, 50)">
            <circle cx="-25" cy="0" r="4" fill="#38bdf8" />
            <circle cx="25" cy="0" r="4" fill="#38bdf8" />
            {/* Switch Blade */}
            <line
              x1="-25"
              y1="0"
              x2={isSwitchClosed ? '25' : '15'}
              y2={isSwitchClosed ? '0' : '-20'}
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <text x="0" y="-24" fill="#cbd5e1" fontSize="11" textAnchor="middle">
              {isSwitchClosed ? '开关 S (闭合)' : '开关 S (断开)'}
            </text>
          </g>

          {/* RESISTOR (Right Vertical Wire) */}
          <g transform="translate(500, 160)">
            {/* Thermal Glow Effect background */}
            {isSwitchClosed && p_watts > 0 && (
              <rect
                x="-25"
                y="-45"
                width="50"
                height="90"
                rx="12"
                fill={resistorGlowColor}
                filter="url(#glow-heat)"
              />
            )}

            {/* Resistor IEC Standard Box / Zigzag */}
            <rect x="-18" y="-35" width="36" height="70" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
            
            {/* Decorative Resistor Bands */}
            <rect x="-18" y="-25" width="36" height="6" fill="#ef4444" />
            <rect x="-18" y="-10" width="36" height="6" fill="#3b82f6" />
            <rect x="-18" y="5" width="36" height="6" fill="#10b981" />
            <rect x="-18" y="20" width="36" height="6" fill="#eab308" />

            {/* Label R */}
            <rect x="25" y="-12" width="85" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            <text x="67" y="4" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
              R = {formatWithPrecision(r_display, precision)} {getUnitSymbol(r_unit)}
            </text>
          </g>

          {/* CURRENT INDICATOR (Bottom Wire) */}
          <g transform="translate(300, 270)">
            {/* Ammeter Circle */}
            <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            <text x="0" y="5" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle">
              A
            </text>

            {/* Arrow indicating direction */}
            {isSwitchClosed && i_amps > 0 && (
              <path
                d="M -40 0 L -28 0 M -32 -4 L -28 0 L -32 4"
                stroke="#34d399"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            )}

            {/* Label I */}
            <rect x="-65" y="30" width="130" height="26" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="47" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
              I = {isSwitchClosed ? `${formatWithPrecision(i_display, precision)} ${getUnitSymbol(i_unit)}` : '0 A (断路)'}
            </text>
          </g>

          {/* POWER DISSIPATION BADGE (Center of Circuit) */}
          <g transform="translate(300, 160)">
            <rect x="-70" y="-30" width="140" height="60" rx="8" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
            <text x="0" y="-8" fill="#cbd5e1" fontSize="11" textAnchor="middle">
              回路功耗 (Power P)
            </text>
            <text x="0" y="16" fill="#f472b6" fontSize="15" fontWeight="bold" textAnchor="middle">
              P = {isSwitchClosed ? `${formatWithPrecision(p_display, precision)} ${getUnitSymbol(p_unit)}` : '0 W'}
            </text>
          </g>
        </svg>
      </div>

      {/* Circuit Parameters Summary Pill Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex flex-col">
          <span className="text-sky-600 dark:text-sky-400 font-medium">电源电压 U</span>
          <span className="text-sm font-bold font-mono text-sky-900 dark:text-sky-200">
            {formatWithPrecision(u_display, precision)} {getUnitSymbol(u_unit)}
          </span>
          <span className="text-[10px] text-sky-600/80 dark:text-sky-400/80 mt-0.5">
            SI等效: {result.u_volts} V
          </span>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">回路电流 I</span>
          <span className="text-sm font-bold font-mono text-emerald-900 dark:text-emerald-200">
            {isSwitchClosed ? `${formatWithPrecision(i_display, precision)} ${getUnitSymbol(i_unit)}` : '0 A'}
          </span>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            SI等效: {isSwitchClosed ? result.i_amps : 0} A
          </span>
        </div>

        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col">
          <span className="text-amber-600 dark:text-amber-400 font-medium">负载电阻 R</span>
          <span className="text-sm font-bold font-mono text-amber-900 dark:text-amber-200">
            {formatWithPrecision(r_display, precision)} {getUnitSymbol(r_unit)}
          </span>
          <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
            SI等效: {result.r_ohms} Ω
          </span>
        </div>

        <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 flex flex-col">
          <span className="text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1">
            <Flame className="w-3 h-3 text-pink-500" /> 发热功率 P
          </span>
          <span className="text-sm font-bold font-mono text-pink-900 dark:text-pink-200">
            {isSwitchClosed ? `${formatWithPrecision(p_display, precision)} ${getUnitSymbol(p_unit)}` : '0 W'}
          </span>
          <span className="text-[10px] text-pink-600/80 dark:text-pink-400/80 mt-0.5">
            SI等效: {isSwitchClosed ? result.p_watts : 0} W
          </span>
        </div>
      </div>
    </div>
  );
};
