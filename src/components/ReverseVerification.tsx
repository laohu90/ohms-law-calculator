import React from 'react';
import { CalculationResult, PrecisionConfig } from '../types/ohms';
import { TranslationSchema } from '../i18n/translations';
import { formatWithPrecision } from '../utils/unitConverter';
import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface ReverseVerificationProps {
  result: CalculationResult;
  precision: PrecisionConfig;
  t: TranslationSchema;
}

export const ReverseVerification: React.FC<ReverseVerificationProps> = ({
  result,
  precision,
  t,
}) => {
  if (!result.isValid) return null;

  const { verification } = result;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.verificationTitle}
          </h3>
        </div>

        {verification.isConsistent ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t.verificationPass}</span>
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t.verificationFail}</span>
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {t.verificationDesc}
      </p>

      {/* Grid of 3 verification formulas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {t.path1Label}
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatWithPrecision(verification.p_from_ui, precision)} W
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {result.u_volts} V × {result.i_amps} A
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {t.path2Label}
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatWithPrecision(verification.p_from_i2r, precision)} W
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            ({result.i_amps} A)² × {result.r_ohms} Ω
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {t.path3Label}
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatWithPrecision(verification.p_from_u2r, precision)} W
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            ({result.u_volts} V)² / {result.r_ohms} Ω
          </span>
        </div>
      </div>

      {/* Residual metrics footer */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5 font-semibold">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>{t.maxResidualLabel}</span>
        </span>
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {verification.maxResidual.toExponential(4)} SI
        </span>
      </div>
    </div>
  );
};
