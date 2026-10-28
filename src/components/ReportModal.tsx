/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CircuitState, DerivationStep, formatValueWithPrecision, PrecisionMode } from '../utils/calculator';
import { FileText, Copy, Check, Download, X, Printer } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitState: CircuitState;
  activeFormulas: {
    voltageFormula?: string;
    currentFormula?: string;
    resistanceFormula?: string;
    powerFormula?: string;
  };
  derivations: DerivationStep[];
  precisionMode: PrecisionMode;
  precisionDigits: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  circuitState,
  activeFormulas,
  derivations,
  precisionMode,
  precisionDigits,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const timestamp = new Date().toISOString();

  const generateMarkdownReport = () => {
    return `# Ohm's Law & Circuit Analysis Report
Generated: ${new Date().toLocaleString()}
Application: Ohm's Law & Circuit Analysis Laboratory

---

## 1. Primary Electrical Parameters
- **Voltage (V)**: ${formatValueWithPrecision(circuitState.voltage, precisionMode, precisionDigits)} V
- **Current (I)**: ${formatValueWithPrecision(circuitState.current, precisionMode, precisionDigits)} A
- **Resistance (R)**: ${formatValueWithPrecision(circuitState.resistance, precisionMode, precisionDigits)} Ω
- **Power Dissipation (P)**: ${formatValueWithPrecision(circuitState.power, precisionMode, precisionDigits)} W

## 2. Active Formula Models
- Voltage: ${activeFormulas.voltageFormula || 'Direct Input'}
- Current: ${activeFormulas.currentFormula || 'Direct Input'}
- Resistance: ${activeFormulas.resistanceFormula || 'Direct Input'}
- Power: ${activeFormulas.powerFormula || 'Direct Input'}

## 3. Mathematical Derivations
${derivations
  .map(
    (d, i) => `### Step ${i + 1}: Solve for ${d.target.toUpperCase()}
- Formula: \`${d.formulaPlain}\`
- Substitution: \`${d.substitution}\`
- Result: \`${d.resultPlain}\`
- Context: ${d.explanation}
`
  )
  .join('\n')}

---
Precision Setting: ${precisionDigits} (${precisionMode})
Verified in compliance with Ohm's Law (V = I * R) and Joule's Law (P = V * I).
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = generateMarkdownReport();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ohms-law-report-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100 text-sm">
              Engineering Circuit Analysis Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Report Preview */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-3">
            <div className="flex justify-between border-b border-slate-800 pb-2 text-slate-400">
              <span>OHM'S LAW LABORATORY RECORD</span>
              <span>{timestamp.slice(0, 10)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">VOLTAGE (V)</span>
                <span className="text-sm font-bold text-slate-100">
                  {formatValueWithPrecision(circuitState.voltage, precisionMode, precisionDigits)} V
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">CURRENT (I)</span>
                <span className="text-sm font-bold text-cyan-400">
                  {formatValueWithPrecision(circuitState.current, precisionMode, precisionDigits)} A
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">RESISTANCE (R)</span>
                <span className="text-sm font-bold text-slate-100">
                  {formatValueWithPrecision(circuitState.resistance, precisionMode, precisionDigits)} Ω
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">DISSIPATION (P)</span>
                <span className="text-sm font-bold text-amber-400">
                  {formatValueWithPrecision(circuitState.power, precisionMode, precisionDigits)} W
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold uppercase text-[11px] tracking-wider">
              Mathematical Derivation Steps
            </h4>
            {derivations.map((d, i) => (
              <div key={i} className="p-3 bg-slate-950/70 border border-slate-800 rounded">
                <div className="text-cyan-400 font-bold mb-1">
                  Step {i + 1}: {d.target.toUpperCase()} ({d.formulaPlain})
                </div>
                <div className="text-slate-400">Substitution: {d.substitution}</div>
                <div className="text-emerald-300 font-bold mt-1">Result: {d.resultPlain}</div>
                <div className="text-slate-400 text-[11px] mt-1">{d.explanation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/60">
          <span className="text-[11px] text-slate-500">
            Exported with {precisionDigits} {precisionMode}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy MD'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download (.md)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
