import React, { useState } from 'react';
import { CalculationResult } from '../types/ohms';
import { BookOpen, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface SolutionStepsProps {
  result: CalculationResult;
}

export const SolutionSteps: React.FC<SolutionStepsProps> = ({ result }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!result.isValid) return null;

  const handleCopySteps = () => {
    const textLines = [
      `=== 欧姆定律计算推导步骤 ===`,
      `计算目标: [${result.target}]`,
      ...result.steps.map(
        (s, idx) =>
          `[${idx + 1}] ${s.title}\n    公式: ${s.formulaStr}\n    代入: ${s.substitutionStr}\n    结果: ${s.resultStr}`
      ),
      `============================`,
    ].join('\n');

    navigator.clipboard.writeText(textLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            公式推导与详细解题步骤 (Step-by-Step Breakdown)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySteps}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            title="复制完整推导文本"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>已复制推导</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>复制过程</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            title={isExpanded ? '折叠步骤' : '展开步骤'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-3">
          {result.steps.map((step, index) => (
            <div
              key={index}
              className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col gap-1.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {step.title}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
                  {step.formulaStr}
                </span>
              </div>

              {/* Substitution & Step calculation line */}
              <div className="text-sm font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200/60 dark:border-slate-800 overflow-x-auto">
                <span className="text-slate-400 dark:text-slate-500 select-none mr-2">代入过程:</span>
                {step.substitutionStr}
              </div>

              <div className="text-xs font-semibold font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>阶段结果: {step.resultStr}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
