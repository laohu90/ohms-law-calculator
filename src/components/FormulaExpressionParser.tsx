import React, { useState } from 'react';
import { TargetParameter, VoltageUnit, CurrentUnit, ResistanceUnit } from '../types/ohms';
import { TranslationSchema } from '../i18n/translations';
import { Calculator, Sparkles, ArrowDownLeft, AlertCircle } from 'lucide-react';

interface FormulaExpressionParserProps {
  onApplyParsedValues: (params: {
    target: TargetParameter;
    uVal?: number;
    uUnit?: VoltageUnit;
    iVal?: number;
    iUnit?: CurrentUnit;
    rVal?: number;
    rUnit?: ResistanceUnit;
  }) => void;
  t: TranslationSchema;
}

const PRESET_EXPRESSIONS = [
  { label: '12V / 0.4ohm', expr: '12V / 0.4ohm', target: 'I' as TargetParameter },
  { label: '220V / 5A', expr: '220V / 5A', target: 'R' as TargetParameter },
  { label: '(5V - 2.1V) / 20mA', expr: '(5V - 2.1V) / 20mA', target: 'R' as TargetParameter },
  { label: 'sqrt(100W * 50ohm)', expr: 'sqrt(100W * 50ohm)', target: 'U' as TargetParameter },
];

export const FormulaExpressionParser: React.FC<FormulaExpressionParserProps> = ({
  onApplyParsedValues,
  t,
}) => {
  const [expression, setExpression] = useState<string>('12V / 0.4ohm');
  const [parsedResult, setParsedResult] = useState<{
    isValid: boolean;
    val?: number;
    unit?: string;
    target?: TargetParameter;
    message?: string;
  }>({
    isValid: true,
    val: 30,
    unit: 'A',
    target: 'I',
  });

  const handleParseExpression = (textToParse: string) => {
    setExpression(textToParse);
    if (!textToParse.trim()) {
      setParsedResult({ isValid: false, message: t.parserError });
      return;
    }

    try {
      let sanitized = textToParse
        .replace(/(\d+(?:\.\d+)?)\s*uV/gi, '($1*1e-6)')
        .replace(/(\d+(?:\.\d+)?)\s*mV/gi, '($1*1e-3)')
        .replace(/(\d+(?:\.\d+)?)\s*kV/gi, '($1*1e3)')
        .replace(/(\d+(?:\.\d+)?)\s*MV/gi, '($1*1e6)')
        .replace(/(\d+(?:\.\d+)?)\s*V/gi, '($1)')
        
        .replace(/(\d+(?:\.\d+)?)\s*uA/gi, '($1*1e-6)')
        .replace(/(\d+(?:\.\d+)?)\s*mA/gi, '($1*1e-3)')
        .replace(/(\d+(?:\.\d+)?)\s*kA/gi, '($1*1e3)')
        .replace(/(\d+(?:\.\d+)?)\s*A/gi, '($1)')

        .replace(/(\d+(?:\.\d+)?)\s*mOhm|mΩ/gi, '($1*1e-3)')
        .replace(/(\d+(?:\.\d+)?)\s*kOhm|kΩ/gi, '($1*1e3)')
        .replace(/(\d+(?:\.\d+)?)\s*MOhm|MΩ/gi, '($1*1e6)')
        .replace(/(\d+(?:\.\d+)?)\s*ohm|Ω/gi, '($1)')

        .replace(/(\d+(?:\.\d+)?)\s*mW/gi, '($1*1e-3)')
        .replace(/(\d+(?:\.\d+)?)\s*kW/gi, '($1*1e3)')
        .replace(/(\d+(?:\.\d+)?)\s*W/gi, '($1)')
        .replace(/\^/g, '**')
        .replace(/sqrt\(/gi, 'Math.sqrt(');

      let inferredTarget: TargetParameter = 'I';
      let inferredUnit = '';

      if (textToParse.includes('V') && textToParse.includes('A')) {
        inferredTarget = 'R';
        inferredUnit = 'Ω';
      } else if (textToParse.includes('V') && (textToParse.includes('ohm') || textToParse.includes('Ω'))) {
        inferredTarget = 'I';
        inferredUnit = 'A';
      } else if (textToParse.includes('A') && (textToParse.includes('ohm') || textToParse.includes('Ω'))) {
        inferredTarget = 'U';
        inferredUnit = 'V';
      } else if (textToParse.includes('W')) {
        inferredTarget = 'U';
        inferredUnit = 'V';
      }

      const evaluated = new Function(`return (${sanitized});`)();

      if (typeof evaluated === 'number' && !isNaN(evaluated) && isFinite(evaluated)) {
        setParsedResult({
          isValid: true,
          val: evaluated,
          unit: inferredUnit,
          target: inferredTarget,
        });
      } else {
        setParsedResult({
          isValid: false,
          message: t.parserError,
        });
      }
    } catch {
      setParsedResult({
        isValid: false,
        message: t.parserError,
      });
    }
  };

  const handleSyncToCalculator = () => {
    if (!parsedResult.isValid || parsedResult.val === undefined) return;

    if (parsedResult.target === 'I') {
      onApplyParsedValues({
        target: 'I',
        iVal: parsedResult.val,
        iUnit: 'A',
      });
    } else if (parsedResult.target === 'U') {
      onApplyParsedValues({
        target: 'U',
        uVal: parsedResult.val,
        uUnit: 'V',
      });
    } else if (parsedResult.target === 'R') {
      onApplyParsedValues({
        target: 'R',
        rVal: parsedResult.val,
        rUnit: 'ohm',
      });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4 max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500 shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.parserTitle}
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">{t.parserSub}</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Preset tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            {t.presetLabel}
          </span>
          {PRESET_EXPRESSIONS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleParseExpression(preset.expr)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap shrink-0 border border-slate-200/60 dark:border-slate-700 font-mono"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Text Input */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={expression}
            onChange={(e) => handleParseExpression(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
            placeholder={t.parserPlaceholder}
          />

          <button
            onClick={handleSyncToCalculator}
            disabled={!parsedResult.isValid}
            className="px-4 py-3 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <ArrowDownLeft className="w-4 h-4 shrink-0" />
            <span>{t.syncToCalcBtn}</span>
          </button>
        </div>

        {/* Parsed Output Card */}
        {parsedResult.isValid ? (
          <div className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                {t.parsedResultLabel}
              </span>
              <span className="font-bold font-mono text-base text-indigo-900 dark:text-indigo-200">
                {parsedResult.val} {parsedResult.unit}
              </span>
            </div>

            <span className="text-[11px] text-indigo-600/80 dark:text-indigo-400 font-mono">
              Target: [{parsedResult.target}]
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{parsedResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
