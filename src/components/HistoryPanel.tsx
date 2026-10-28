import React, { useState } from 'react';
import { HistoryItem } from '../types/ohms';
import { TranslationSchema } from '../i18n/translations';
import { getUnitSymbol } from '../utils/unitConverter';
import {
  History,
  Trash2,
  Copy,
  RotateCcw,
  Check,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  t: TranslationSchema;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  t,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyItem = (item: HistoryItem) => {
    const text = `[${t.appName}] ${item.target} | ${t.inputsPrefix} ${item.inputsStr} => ${t.outputsPrefix} ${item.outputsStr} (${new Date(item.timestamp).toLocaleString()})`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['Time', 'Target', 'Voltage', 'UnitU', 'Current', 'UnitI', 'Resistance', 'UnitR', 'Power', 'UnitP'];
    const rows = history.map((h) => [
      new Date(h.timestamp).toLocaleString(),
      h.target,
      h.u_val,
      getUnitSymbol(h.u_unit),
      h.i_val,
      getUnitSymbol(h.i_unit),
      h.r_val,
      getUnitSymbol(h.r_unit),
      h.p_val,
      getUnitSymbol(h.p_unit),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ohms_law_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (history.length === 0) return;
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `ohms_law_history_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {t.historyTitle}
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
            {history.length} {t.historyCount}
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
              <span>{t.exportCSV}</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span>{t.exportJSON}</span>
            </button>

            <button
              onClick={onClearAll}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-800"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>{t.clearHistory}</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <History className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          <p>{t.noHistory}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs hover:border-amber-300 dark:hover:border-amber-800 transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] uppercase font-mono">
                    {t.unknownTarget}: {item.target}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-slate-800 dark:text-slate-200 font-mono truncate">
                  <span className="text-slate-500 font-normal">{t.inputsPrefix}</span> {item.inputsStr}
                </div>

                <div className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono truncate">
                  <span className="text-slate-500 font-normal">{t.outputsPrefix}</span> {item.outputsStr}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onLoadItem(item)}
                  className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCopyItem(item)}
                  className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
