/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { formatValueWithPrecision, PrecisionMode } from '../utils/calculator';
import { Radio, Waves, ArrowRight, Gauge } from 'lucide-react';

interface ACInspectorProps {
  precisionMode: PrecisionMode;
  precisionDigits: number;
}

export const ACInspector: React.FC<ACInspectorProps> = ({
  precisionMode,
  precisionDigits,
}) => {
  const [vRms, setVRms] = useState<number>(120); // 120V standard AC
  const [frequency, setFrequency] = useState<number>(60); // 60 Hz
  const [resistance, setResistance] = useState<number>(50); // 50 Ω
  const [inductanceMh, setInductanceMh] = useState<number>(100); // 100 mH
  const [capacitanceUf, setCapacitanceUf] = useState<number>(20); // 20 μF

  // Calculations
  const omega = 2 * Math.PI * frequency;
  const L = inductanceMh * 1e-3;
  const C = capacitanceUf * 1e-6;

  const XL = omega * L; // Inductive reactance
  const XC = C > 0 ? 1 / (omega * C) : 0; // Capacitive reactance
  const netReactance = XL - XC;
  const impedanceZ = Math.sqrt(resistance * resistance + netReactance * netReactance);

  // AC Ohm's law: I_rms = V_rms / Z
  const iRms = impedanceZ > 0 ? vRms / impedanceZ : 0;
  const vPeak = vRms * Math.SQRT2;
  const iPeak = iRms * Math.SQRT2;

  // Phase angle theta (degrees)
  const phaseRad = Math.atan2(netReactance, resistance);
  const phaseDeg = (phaseRad * 180) / Math.PI;

  // Real, Reactive, Apparent Power
  const apparentPowerS = vRms * iRms; // VA
  const realPowerP = apparentPowerS * Math.cos(phaseRad); // Watts
  const reactivePowerQ = apparentPowerS * Math.sin(phaseRad); // VAR
  const powerFactor = Math.cos(phaseRad);

  // Generate SVG waveform points for v(t) and i(t)
  const width = 600;
  const height = 180;
  const centerY = height / 2;
  const points = 120;
  const cycles = 2;

  const vPointsArr: string[] = [];
  const iPointsArr: string[] = [];

  for (let pt = 0; pt <= points; pt++) {
    const x = (pt / points) * width;
    const angle = (pt / points) * cycles * 2 * Math.PI;
    // Voltage wave
    const vy = centerY - Math.sin(angle) * (height * 0.38);
    // Current wave shifted by phaseRad
    const iy = centerY - Math.sin(angle - phaseRad) * (height * 0.38);

    vPointsArr.push(`${x.toFixed(1)},${vy.toFixed(1)}`);
    iPointsArr.push(`${x.toFixed(1)},${iy.toFixed(1)}`);
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Waves className="w-5 h-5 text-indigo-400" /> AC Ohm's Law, Impedance (Z) & Phasor Analyzer
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Extend Ohm's Law to Alternating Current: V = I × Z with inductive/capacitive reactance and phase lead/lag
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AC Input Parameters */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-3">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              AC Source & Component Values
            </span>

            {/* Voltage RMS */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>RMS Voltage (V_rms):</span>
                <span className="font-mono text-cyan-300">{vRms} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="240"
                step="1"
                value={vRms}
                onChange={(e) => setVRms(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Frequency */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Frequency (f):</span>
                <span className="font-mono text-cyan-300">{frequency} Hz</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={frequency}
                onChange={(e) => setFrequency(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            {/* Resistance R */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Resistance (R):</span>
                <span className="font-mono text-slate-200">{resistance} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="200"
                step="1"
                value={resistance}
                onChange={(e) => setResistance(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
              />
            </div>

            {/* Inductance L */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Inductance (L):</span>
                <span className="font-mono text-emerald-300">{inductanceMh} mH</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="5"
                value={inductanceMh}
                onChange={(e) => setInductanceMh(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Capacitance C */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Capacitance (C):</span>
                <span className="font-mono text-amber-300">{capacitanceUf} μF</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.5"
                value={capacitanceUf}
                onChange={(e) => setCapacitanceUf(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* AC Results & Live Waveform Canvas */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Impedance |Z|</span>
              <span className="text-base font-mono font-bold text-cyan-400">
                {formatValueWithPrecision(impedanceZ, precisionMode, precisionDigits)} Ω
              </span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">RMS Current</span>
              <span className="text-base font-mono font-bold text-emerald-400">
                {formatValueWithPrecision(iRms, precisionMode, precisionDigits)} A
              </span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Phase Shift (θ)</span>
              <span
                className={`text-base font-mono font-bold ${
                  phaseDeg >= 0 ? 'text-amber-400' : 'text-blue-400'
                }`}
              >
                {phaseDeg.toFixed(2)}°
              </span>
              <span className="text-[9px] text-slate-500 block">
                {phaseDeg > 0 ? '(Current Lags / Inductive)' : phaseDeg < 0 ? '(Current Leads / Capacitive)' : '(In Phase)'}
              </span>
            </div>
          </div>

          {/* Real-time AC Waveform Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-cyan-400 inline-block" /> Voltage v(t)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-400 inline-block" /> Current i(t)
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                Power Factor: <span className="text-slate-100 font-semibold">{powerFactor.toFixed(3)}</span>
              </span>
            </div>

            <div className="w-full h-44 bg-slate-900/60 rounded border border-slate-800/80 flex items-center justify-center overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Center zero line */}
                <line x1="0" y1={centerY} x2={width} y2={centerY} stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Voltage Waveform */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={vPointsArr.join(' ')}
                />

                {/* Current Waveform */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={iPointsArr.join(' ')}
                />
              </svg>
            </div>
          </div>

          {/* Reactance Breakdown Strip */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg font-mono text-xs grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Inductive Reactance (X_L = 2πfL):</span>
              <span className="text-emerald-400 font-bold">{XL.toFixed(2)} Ω</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Capacitive Reactance (X_C = 1/(2πfC)):</span>
              <span className="text-amber-400 font-bold">{XC.toFixed(2)} Ω</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
