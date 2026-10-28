import React, { useState } from 'react';
import { CalculationResult, PrecisionConfig } from '../types/ohms';
import { formatWithPrecision, getUnitSymbol } from '../utils/unitConverter';
import { TranslationSchema } from '../i18n/translations';
import { Zap, Power, Flame, Activity } from 'lucide-react';

interface CircuitDiagramProps {
  result: CalculationResult;
  precision: PrecisionConfig;
  t: TranslationSchema;
}

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({
  result,
  precision,
  t,
}) => {
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  if (!result.isValid) {
    return (
      <div className="bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 min-h-[280px]">
        <Activity className="w-10 h-10 mb-2 text-slate-400 animate-pulse" />
        <p className="font-semibold text-slate-700 dark:text-slate-300 text-base">{t.circuitUnavail}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {t.circuitUnavailSub}
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

  const animSpeed = isSwitchClosed && i_amps > 0 ? Math.max(0.2, Math.min(3, 2 / Math.sqrt(Math.max(i_amps, 0.001)))) : 0;
  const heatIntensity = isSwitchClosed ? Math.min(1, Math.max(0, Math.log10(p_watts + 1) / 4)) : 0;
  const resistorGlowColor = `rgba(239, 68, 68, ${0.15 + heatIntensity * 0.7})`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4 max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.circuitTitle}
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
          title="Toggle Switch State"
        >
          <Power className="w-3.5 h-3.5 shrink-0" />
          <span>{isSwitchClosed ? t.switchOn : t.switchOff}</span>
        </button>
      </div>

      {/* SVG Canvas for Circuit */}
      <div className="relative w-full overflow-hidden bg-slate-950 rounded-lg p-2 border border-slate-800 flex items-center justify-center max-w-full">
        <svg
          viewBox="0 0 600 320"
          className="w-full h-auto max-h-[300px] select-none"
          role="img"
          aria-label={t.circuitTitle}
        >
          <defs>
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
          <path
            d="M 90 160 L 90 50 L 450 50 L 450 270 L 90 270 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Conducting Wire */}
          <path
            d="M 90 160 L 90 50 L 450 50 L 450 270 L 90 270 Z"
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

          {/* BATTERY / POWER SOURCE */}
          <g transform="translate(90, 160)">
            <rect x="-30" y="-35" width="60" height="70" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <line x1="-18" y1="-15" x2="18" y2="-15" stroke="#38bdf8" strokeWidth="4" />
            <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#38bdf8" strokeWidth="2" />
            <line x1="-18" y1="5" x2="18" y2="5" stroke="#38bdf8" strokeWidth="4" />
            <line x1="-10" y1="15" x2="10" y2="15" stroke="#38bdf8" strokeWidth="2" />
            <text x="-35" y="-20" fill="#ef4444" fontSize="16" fontWeight="bold">+</text>
            <text x="-35" y="30" fill="#3b82f6" fontSize="16" fontWeight="bold">-</text>

            <rect x="-65" y="-12" width="65" height="24" rx="4" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1" />
            <text x="-33" y="4" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
              U = {formatWithPrecision(u_display, precision)} {getUnitSymbol(u_unit)}
            </text>
          </g>

          {/* SWITCH */}
          <g transform="translate(230, 50)">
            <circle cx="-25" cy="0" r="4" fill="#38bdf8" />
            <circle cx="25" cy="0" r="4" fill="#38bdf8" />
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
              {isSwitchClosed ? 'S (ON)' : 'S (OFF)'}
            </text>
          </g>

          {/* RESISTOR */}
          <g transform="translate(450, 160)">
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
            <rect x="-18" y="-35" width="36" height="70" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="3" />
            <rect x="-18" y="-25" width="36" height="6" fill="#ef4444" />
            <rect x="-18" y="-10" width="36" height="6" fill="#3b82f6" />
            <rect x="-18" y="5" width="36" height="6" fill="#10b981" />
            <rect x="-18" y="20" width="36" height="6" fill="#eab308" />

            <rect x="25" y="-12" width="85" height="24" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
            <text x="67" y="4" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
              R = {formatWithPrecision(r_display, precision)} {getUnitSymbol(r_unit)}
            </text>
          </g>

          {/* AMMETER */}
          <g transform="translate(270, 270)">
            <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
            <text x="0" y="5" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle">
              A
            </text>
            {isSwitchClosed && i_amps > 0 && (
              <path
                d="M -40 0 L -28 0 M -32 -4 L -28 0 L -32 4"
                stroke="#34d399"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
            )}
            <rect x="-65" y="30" width="130" height="26" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="47" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">
              I = {isSwitchClosed ? `${formatWithPrecision(i_display, precision)} ${getUnitSymbol(i_unit)}` : t.openCircuit}
            </text>
          </g>

          {/* POWER BADGE */}
          <g transform="translate(270, 160)">
            <rect x="-65" y="-28" width="130" height="56" rx="8" fill="#0f172a" stroke="#ec4899" strokeWidth="1.5" />
            <text x="0" y="-8" fill="#cbd5e1" fontSize="11" textAnchor="middle">
              {t.powerDissipation}
            </text>
            <text x="0" y="16" fill="#f472b6" fontSize="14" fontWeight="bold" textAnchor="middle">
              P = {isSwitchClosed ? `${formatWithPrecision(p_display, precision)} ${getUnitSymbol(p_unit)}` : '0 W'}
            </text>
          </g>
        </svg>
      </div>

      {/* Summary Pill Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
        <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex flex-col">
          <span className="text-sky-600 dark:text-sky-400 font-semibold">{t.batteryU}</span>
          <span className="text-base font-bold font-mono text-sky-900 dark:text-sky-200">
            {formatWithPrecision(u_display, precision)} {getUnitSymbol(u_unit)}
          </span>
          <span className="text-[11px] text-sky-600/80 dark:text-sky-400/80 mt-0.5">
            {t.siEquivalent}: {result.u_volts} V
          </span>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.ammeterI}</span>
          <span className="text-base font-bold font-mono text-emerald-900 dark:text-emerald-200">
            {isSwitchClosed ? `${formatWithPrecision(i_display, precision)} ${getUnitSymbol(i_unit)}` : '0 A'}
          </span>
          <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
            {t.siEquivalent}: {isSwitchClosed ? result.i_amps : 0} A
          </span>
        </div>

        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col">
          <span className="text-amber-600 dark:text-amber-400 font-semibold">{t.resistorR}</span>
          <span className="text-base font-bold font-mono text-amber-900 dark:text-amber-200">
            {formatWithPrecision(r_display, precision)} {getUnitSymbol(r_unit)}
          </span>
          <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
            {t.siEquivalent}: {result.r_ohms} Ω
          </span>
        </div>

        <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/60 flex flex-col">
          <span className="text-pink-600 dark:text-pink-400 font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-pink-500 shrink-0" /> {t.powerLabel}
          </span>
          <span className="text-base font-bold font-mono text-pink-900 dark:text-pink-200">
            {isSwitchClosed ? `${formatWithPrecision(p_display, precision)} ${getUnitSymbol(p_unit)}` : '0 W'}
          </span>
          <span className="text-[11px] text-pink-600/80 dark:text-pink-400/80 mt-0.5">
            {t.siEquivalent}: {isSwitchClosed ? result.p_watts : 0} W
          </span>
        </div>
      </div>
    </div>
  );
};
