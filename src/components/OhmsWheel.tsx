/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VariableType } from '../utils/calculator';

interface OhmsWheelProps {
  activeFormulas: {
    voltageFormula?: string;
    currentFormula?: string;
    resistanceFormula?: string;
    powerFormula?: string;
  };
  onSelectTarget?: (target: VariableType) => void;
}

export const OhmsWheel: React.FC<OhmsWheelProps> = ({ activeFormulas, onSelectTarget }) => {
  // Check which formulas are active
  const isVActive = !!activeFormulas.voltageFormula;
  const isIActive = !!activeFormulas.currentFormula;
  const isRActive = !!activeFormulas.resistanceFormula;
  const isPActive = !!activeFormulas.powerFormula;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Ohm's Law & Power Formula Wheel</h3>
          <p className="text-xs text-slate-400">12 canonical relationships governing Voltage, Current, Resistance, and Power</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-2">
        <svg viewBox="0 0 400 400" className="w-full max-w-[320px] select-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>

          {/* Outer circle ring */}
          <circle cx="200" cy="200" r="190" fill="#090d16" stroke="#334155" strokeWidth="2" />
          <circle cx="200" cy="200" r="130" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />

          {/* Quadrant Dividers (Horizontal and Vertical) */}
          <line x1="10" y1="200" x2="390" y2="200" stroke="#334155" strokeWidth="2" />
          <line x1="200" y1="10" x2="200" y2="390" stroke="#334155" strokeWidth="2" />

          {/* 4 Quadrants:
              Top-Left: Voltage (V)
              Top-Right: Power (P)
              Bottom-Right: Current (I)
              Bottom-Left: Resistance (R)
          */}

          {/* ================= QUADRANT 1: TOP-LEFT (VOLTAGE V) ================= */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectTarget?.('voltage')}
            opacity={isVActive ? 1 : 0.75}
          >
            {/* Background sector highlight if active */}
            {isVActive && (
              <path
                d="M 200 200 L 10 200 A 190 190 0 0 1 200 10 Z"
                fill="rgba(245, 158, 11, 0.12)"
              />
            )}
            {/* Inner label */}
            <circle cx="150" cy="150" r="28" fill={isVActive ? '#f59e0b' : '#1e293b'} stroke="#f59e0b" strokeWidth="2" />
            <text x="150" y="156" fill={isVActive ? '#0f172a' : '#f59e0b'} fontSize="20" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
              V
            </text>
            <text x="150" y="128" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              VOLTS
            </text>

            {/* Formulas for V */}
            {/* V = I × R */}
            <text
              x="85"
              y="110"
              fill={activeFormulas.voltageFormula?.includes('I × R') ? '#f59e0b' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.voltageFormula?.includes('I × R') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              I × R
            </text>
            {/* V = P / I */}
            <text
              x="55"
              y="155"
              fill={activeFormulas.voltageFormula?.includes('P / I') ? '#f59e0b' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.voltageFormula?.includes('P / I') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              P / I
            </text>
            {/* V = √(P × R) */}
            <text
              x="115"
              y="70"
              fill={activeFormulas.voltageFormula?.includes('P × R') ? '#f59e0b' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.voltageFormula?.includes('P × R') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              √(P × R)
            </text>
          </g>

          {/* ================= QUADRANT 2: TOP-RIGHT (POWER P) ================= */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectTarget?.('power')}
            opacity={isPActive ? 1 : 0.75}
          >
            {isPActive && (
              <path
                d="M 200 200 L 200 10 A 190 190 0 0 1 390 200 Z"
                fill="rgba(168, 85, 247, 0.12)"
              />
            )}
            <circle cx="250" cy="150" r="28" fill={isPActive ? '#a855f7' : '#1e293b'} stroke="#a855f7" strokeWidth="2" />
            <text x="250" y="156" fill={isPActive ? '#0f172a' : '#a855f7'} fontSize="20" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
              P
            </text>
            <text x="250" y="128" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              WATTS
            </text>

            {/* Formulas for P */}
            {/* P = V × I */}
            <text
              x="260"
              y="70"
              fill={activeFormulas.powerFormula?.includes('V × I') ? '#a855f7' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.powerFormula?.includes('V × I') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              V × I
            </text>
            {/* P = I² × R */}
            <text
              x="300"
              y="110"
              fill={activeFormulas.powerFormula?.includes('I² × R') ? '#a855f7' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.powerFormula?.includes('I² × R') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              I² × R
            </text>
            {/* P = V² / R */}
            <text
              x="315"
              y="155"
              fill={activeFormulas.powerFormula?.includes('V² / R') ? '#a855f7' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.powerFormula?.includes('V² / R') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              V² / R
            </text>
          </g>

          {/* ================= QUADRANT 3: BOTTOM-RIGHT (CURRENT I) ================= */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectTarget?.('current')}
            opacity={isIActive ? 1 : 0.75}
          >
            {isIActive && (
              <path
                d="M 200 200 L 390 200 A 190 190 0 0 1 200 390 Z"
                fill="rgba(6, 182, 212, 0.12)"
              />
            )}
            <circle cx="250" cy="250" r="28" fill={isIActive ? '#06b6d4' : '#1e293b'} stroke="#06b6d4" strokeWidth="2" />
            <text x="250" y="256" fill={isIActive ? '#0f172a' : '#06b6d4'} fontSize="20" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
              I
            </text>
            <text x="250" y="288" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              AMPERES
            </text>

            {/* Formulas for I */}
            {/* I = V / R */}
            <text
              x="315"
              y="250"
              fill={activeFormulas.currentFormula?.includes('V / R') ? '#06b6d4' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.currentFormula?.includes('V / R') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              V / R
            </text>
            {/* I = P / V */}
            <text
              x="295"
              y="295"
              fill={activeFormulas.currentFormula?.includes('P / V') ? '#06b6d4' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.currentFormula?.includes('P / V') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              P / V
            </text>
            {/* I = √(P / R) */}
            <text
              x="250"
              y="335"
              fill={activeFormulas.currentFormula?.includes('P / R') ? '#06b6d4' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.currentFormula?.includes('P / R') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              √(P / R)
            </text>
          </g>

          {/* ================= QUADRANT 4: BOTTOM-LEFT (RESISTANCE R) ================= */}
          <g
            className="cursor-pointer transition-opacity"
            onClick={() => onSelectTarget?.('resistance')}
            opacity={isRActive ? 1 : 0.75}
          >
            {isRActive && (
              <path
                d="M 200 200 L 200 390 A 190 190 0 0 1 10 200 Z"
                fill="rgba(56, 189, 248, 0.12)"
              />
            )}
            <circle cx="150" cy="250" r="28" fill={isRActive ? '#38bdf8' : '#1e293b'} stroke="#38bdf8" strokeWidth="2" />
            <text x="150" y="256" fill={isRActive ? '#0f172a' : '#38bdf8'} fontSize="20" fontWeight="bold" fontFamily="JetBrains Mono" textAnchor="middle">
              R
            </text>
            <text x="150" y="288" fill="#94a3b8" fontSize="10" fontFamily="Plus Jakarta Sans" textAnchor="middle">
              OHMS (Ω)
            </text>

            {/* Formulas for R */}
            {/* R = V / I */}
            <text
              x="55"
              y="250"
              fill={activeFormulas.resistanceFormula?.includes('V / I') ? '#38bdf8' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.resistanceFormula?.includes('V / I') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              V / I
            </text>
            {/* R = V² / P */}
            <text
              x="75"
              y="295"
              fill={activeFormulas.resistanceFormula?.includes('V² / P') ? '#38bdf8' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.resistanceFormula?.includes('V² / P') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              V² / P
            </text>
            {/* R = P / I² */}
            <text
              x="120"
              y="335"
              fill={activeFormulas.resistanceFormula?.includes('P / I²') ? '#38bdf8' : '#cbd5e1'}
              fontSize="12"
              fontWeight={activeFormulas.resistanceFormula?.includes('P / I²') ? 'bold' : 'normal'}
              fontFamily="JetBrains Mono"
            >
              P / I²
            </text>
          </g>

          {/* Center Hub */}
          <circle cx="200" cy="200" r="42" fill="url(#wheelCenter)" stroke="#475569" strokeWidth="2" />
          <text x="200" y="196" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
            OHM'S
          </text>
          <text x="200" y="210" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="Plus Jakarta Sans" textAnchor="middle">
            LAW
          </text>
        </svg>
      </div>

      <div className="text-center mt-2 text-xs text-slate-400">
        Active equations automatically illuminated based on your inputs
      </div>
    </div>
  );
};
