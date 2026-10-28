/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  COLOR_BANDS,
  ColorBand,
  get4BandResistorColors,
  findNearestStandardEValues,
} from '../utils/resistorCode';
import { formatValueWithPrecision, PrecisionMode } from '../utils/calculator';
import { Palette, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ResistorDecoderProps {
  currentResistance: number | null;
  onApplyResistance: (r: number) => void;
  precisionMode: PrecisionMode;
  precisionDigits: number;
}

export const ResistorDecoder: React.FC<ResistorDecoderProps> = ({
  currentResistance,
  onApplyResistance,
  precisionMode,
  precisionDigits,
}) => {
  const [inputVal, setInputVal] = useState<number>(currentResistance ?? 4700);

  const effResistance = inputVal > 0 ? inputVal : 1;
  const bands = get4BandResistorColors(effResistance);
  const eSeries = findNearestStandardEValues(effResistance);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Resistor Color Code & EIA Nominal E-Series Matcher
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Decode standard 4-band EIA color bands and map calculated theoretical values to physical E12/E24 commercial parts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Resistor Visual Schematic */}
        <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center">
          <svg viewBox="0 0 500 160" className="w-full max-w-[420px]" xmlns="http://www.w3.org/2000/svg">
            {/* Axial Leads */}
            <line x1="20" y1="80" x2="110" y2="80" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <line x1="390" y1="80" x2="480" y2="80" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

            {/* Ceramic Resistor Body with characteristic dumbbell contours */}
            <path
              d="M 110 50 C 125 50, 135 60, 150 60 L 350 60 C 365 60, 375 50, 390 50 C 400 50, 400 110, 390 110 C 375 110, 365 100, 350 100 L 150 100 C 135 100, 125 110, 110 110 C 100 110, 100 50, 110 50 Z"
              fill="#d6c5a0"
              stroke="#8c7851"
              strokeWidth="2.5"
            />

            {/* 4 Bands */}
            {/* Band 1: 1st digit */}
            <rect x="155" y="60" width="16" height="40" fill={bands.band1.colorHex} rx="1" />
            {/* Band 2: 2nd digit */}
            <rect x="200" y="60" width="16" height="40" fill={bands.band2.colorHex} rx="1" />
            {/* Band 3: Multiplier */}
            <rect x="250" y="60" width="16" height="40" fill={bands.multiplierBand.colorHex} rx="1" />
            {/* Band 4: Tolerance */}
            <rect x="330" y="60" width="16" height="40" fill={bands.toleranceBand.colorHex} rx="1" />
          </svg>

          {/* Color Band Legend */}
          <div className="grid grid-cols-4 gap-2 w-full mt-4 text-center">
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block">1st Digit</span>
              <span className="font-bold text-slate-200">{bands.band1.name}</span>
              <span className="font-mono text-cyan-400 block text-xs">({bands.band1.value})</span>
            </div>
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block">2nd Digit</span>
              <span className="font-bold text-slate-200">{bands.band2.name}</span>
              <span className="font-mono text-cyan-400 block text-xs">({bands.band2.value})</span>
            </div>
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block">Multiplier</span>
              <span className="font-bold text-slate-200">{bands.multiplierBand.name}</span>
              <span className="font-mono text-cyan-400 block text-xs">(×{bands.multiplierBand.multiplier})</span>
            </div>
            <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block">Tolerance</span>
              <span className="font-bold text-slate-200">{bands.toleranceBand.name}</span>
              <span className="font-mono text-amber-400 block text-xs">(±5%)</span>
            </div>
          </div>
        </div>

        {/* Commercial Nominal E-Series Matcher */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Test Resistance Value
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                min="0.1"
                value={inputVal}
                onChange={(e) => setInputVal(parseFloat(e.target.value) || 1)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400 font-mono">Ω</span>
              <button
                onClick={() => onApplyResistance(inputVal)}
                className="px-3 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium transition-colors"
              >
                Apply to Lab
              </button>
            </div>
          </div>

          {/* Standard Commercial Parts Matching */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Nearest Off-the-Shelf Commercial Values
            </span>

            {/* E12 Standard (10% Tolerance) */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">E12 Series (Standard 10%)</span>
                <span className="text-base font-mono font-bold text-slate-100">
                  {formatValueWithPrecision(eSeries.nearestE12, precisionMode, precisionDigits)} Ω
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-mono font-semibold ${
                    Math.abs(eSeries.e12DiffPercent) < 2
                      ? 'text-emerald-400'
                      : Math.abs(eSeries.e12DiffPercent) < 5
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {eSeries.e12DiffPercent > 0 ? '+' : ''}
                  {eSeries.e12DiffPercent.toFixed(2)}%
                </span>
                <button
                  onClick={() => {
                    setInputVal(eSeries.nearestE12);
                    onApplyResistance(eSeries.nearestE12);
                  }}
                  className="block text-[11px] text-cyan-400 hover:underline mt-0.5"
                >
                  Adopt E12
                </button>
              </div>
            </div>

            {/* E24 Standard (5% Tolerance) */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">E24 Series (Precision 5%)</span>
                <span className="text-base font-mono font-bold text-cyan-300">
                  {formatValueWithPrecision(eSeries.nearestE24, precisionMode, precisionDigits)} Ω
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-mono font-semibold ${
                    Math.abs(eSeries.e24DiffPercent) < 1
                      ? 'text-emerald-400'
                      : Math.abs(eSeries.e24DiffPercent) < 3
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {eSeries.e24DiffPercent > 0 ? '+' : ''}
                  {eSeries.e24DiffPercent.toFixed(2)}%
                </span>
                <button
                  onClick={() => {
                    setInputVal(eSeries.nearestE24);
                    onApplyResistance(eSeries.nearestE24);
                  }}
                  className="block text-[11px] text-cyan-400 hover:underline mt-0.5"
                >
                  Adopt E24
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
