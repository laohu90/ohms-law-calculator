import React from 'react';
import { PrecisionConfig } from '../types/ohms';
import { Sliders, X, Check } from 'lucide-react';

interface PrecisionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PrecisionConfig;
  onChange: (newConfig: PrecisionConfig) => void;
}

export const PrecisionSettingsModal: React.FC<PrecisionSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              自定义计算精度与格式 (Precision Settings)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            精度模式 (Precision Mode)
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => onChange({ ...config, mode: 'decimal' })}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                config.mode === 'decimal'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              保留小数位数 (Decimal Places)
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...config, mode: 'sigfig' })}
              className={`py-2 px-3 text-xs font-medium rounded-md transition-colors ${
                config.mode === 'sigfig'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              保留有效数字 (Sig Figs)
            </button>
          </div>
        </div>

        {/* Slider / Numeric Input */}
        {config.mode === 'decimal' ? (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>小数位数 (0 ~ 12 位)</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 text-sm">
                {config.decimalPlaces} 位
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={config.decimalPlaces}
              onChange={(e) =>
                onChange({ ...config, decimalPlaces: parseInt(e.target.value, 10) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 位 (整数)</span>
              <span>4 位 (常用)</span>
              <span>12 位 (极高精度)</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>有效数字 (1 ~ 12 位)</span>
              <span className="font-mono text-amber-600 dark:text-amber-400 text-sm">
                {config.significantFigures} 位
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={config.significantFigures}
              onChange={(e) =>
                onChange({ ...config, significantFigures: parseInt(e.target.value, 10) })
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 位</span>
              <span>4 位 (标准工程)</span>
              <span>12 位</span>
            </div>
          </div>
        )}

        {/* Format Toggles */}
        <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              强制使用科学计数法 (e.g. 1.234e+3)
            </span>
            <input
              type="checkbox"
              checked={config.useScientific}
              onChange={(e) => onChange({ ...config, useScientific: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              添加千位分隔符 (e.g. 1,234.56)
            </span>
            <input
              type="checkbox"
              checked={config.useThousandsSeparator}
              onChange={(e) => onChange({ ...config, useThousandsSeparator: e.target.checked })}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>确定应用</span>
          </button>
        </div>
      </div>
    </div>
  );
};
