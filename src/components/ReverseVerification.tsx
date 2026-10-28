import React from 'react';
import { CalculationResult, PrecisionConfig } from '../types/ohms';
import { formatWithPrecision } from '../utils/unitConverter';
import { CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface ReverseVerificationProps {
  result: CalculationResult;
  precision: PrecisionConfig;
}

export const ReverseVerification: React.FC<ReverseVerificationProps> = ({
  result,
  precision,
}) => {
  if (!result.isValid) return null;

  const { verification } = result;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            物理反算与自洽性校验 (Reverse Verification Engine)
          </h3>
        </div>

        {verification.isConsistent ? (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>自洽校验：100% 通过</span>
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>发现微小残差浮点偏差</span>
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        根据电学基尔霍夫与欧姆定理，功率 $P$ 与电压 $U$、电流 $I$、电阻 $R$ 存在三种独立的互导出路径。本引擎将计算结果回代至三个独立方程，检测物理关系自洽性。
      </p>

      {/* Grid of 3 verification formulas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>路径 1: P = U × I</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">基准验证</span>
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatWithPrecision(verification.p_from_ui, precision)} W
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {result.u_volts} V × {result.i_amps} A
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>路径 2: P = I² × R</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">焦耳定律</span>
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatWithPrecision(verification.p_from_i2r, precision)} W
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({result.i_amps} A)² × {result.r_ohms} Ω
          </span>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center justify-between">
            <span>路径 3: P = U² / R</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">伏安验证</span>
          </span>
          <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {formatWithPrecision(verification.p_from_u2r, precision)} W
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            ({result.u_volts} V)² / {result.r_ohms} Ω
          </span>
        </div>
      </div>

      {/* Residual metrics footer */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
          <span>最大反算残差 (Max Residual Δ):</span>
        </span>
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {verification.maxResidual.toExponential(4)} SI
        </span>
      </div>
    </div>
  );
};
