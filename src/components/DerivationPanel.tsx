/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DerivationStep, formatValueWithPrecision, PrecisionMode } from '../utils/calculator';
import { Calculator, CheckCheck, BookOpen, Layers } from 'lucide-react';

interface DerivationPanelProps {
  derivations: DerivationStep[];
  precisionMode: PrecisionMode;
  precisionDigits: number;
}

export const DerivationPanel: React.FC<DerivationPanelProps> = ({
  derivations,
  precisionMode,
  precisionDigits,
}) => {
  if (derivations.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 text-center text-slate-400">
        <Calculator className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm">Input any two circuit variables to see rigorous mathematical derivations.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Step-by-Step Mathematical Derivation</h3>
            <p className="text-xs text-slate-400">Formal algebraic substitution and unit verification</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Precision: <span className="text-cyan-400 font-semibold">{precisionDigits} {precisionMode === 'sigfigs' ? 'Sig Figs' : precisionMode === 'decimals' ? 'Decimals' : precisionMode}</span>
        </div>
      </div>

      <div className="space-y-4">
        {derivations.map((step, idx) => (
          <div
            key={idx}
            className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4 space-y-2.5 transition-all hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Step {idx + 1}: Solve for {step.target}
              </span>
              <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Formula: {step.formulaPlain}
              </span>
            </div>

            {/* Algebraic Equation Display */}
            <div className="p-3 bg-slate-900/80 rounded border border-slate-800/80 font-mono text-sm space-y-1.5">
              <div className="text-slate-400 text-xs">
                General Form: <span className="text-slate-200 font-semibold">{step.formulaPlain}</span>
              </div>
              <div className="text-amber-400 text-xs">
                Substitution: <span className="text-amber-200">{step.substitution}</span>
              </div>
              <div className="text-emerald-400 text-xs pt-1 border-t border-slate-800/80 flex items-center justify-between">
                <span>Calculated Solution:</span>
                <span className="font-bold text-sm text-emerald-300">
                  {step.resultPlain}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {step.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
