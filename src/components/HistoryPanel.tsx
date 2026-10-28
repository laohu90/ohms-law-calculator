import React, { useState } from 'react';
import { HistoryItem, TargetParameter } from '../types/ohms';
import { getUnitSymbol } from '../utils/unitConverter';
import {
  History,
  Trash2,
  Copy,
  Download,
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
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyItem = (item: HistoryItem) => {
    const text = `[欧姆定律计算] 目标: ${item.target} | 输入: ${item.inputsStr} => 输出: ${item.outputsStr} (${new Date(item.timestamp).toLocaleString()})`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['时间', '计算目标', '电压U', '单位U', '电流I', '单位I', '电阻R', '单位R', '功率P', '单位P'];
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
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            计算历史记录 (Calculation History)
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
            {history.length} 条
          </span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 border border-emerald-200 dark:border-emerald-800"
              title="导出 CSV 表格"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>导出 CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors flex items-center gap-1 border border-indigo-200 dark:border-indigo-800"
              title="导出 JSON 数据"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>导出 JSON</span>
            </button>

            <button
              onClick={onClearAll}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors flex items-center gap-1 border border-rose-200 dark:border-rose-800"
              title="清空历史"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>清空</span>
            </button>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <History className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          <p>暂无计算历史记录。进行计算后，结果将自动保存在此处。</p>
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
                    目标: {item.target}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-slate-800 dark:text-slate-200 font-mono truncate">
                  <span className="text-slate-500">输入:</span> {item.inputsStr}
                </div>

                <div className="text-emerald-700 dark:text-emerald-400 font-semibold font-mono truncate">
                  <span className="text-slate-500 font-normal">得出:</span> {item.outputsStr}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onLoadItem(item)}
                  className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="重新载入此参数到计算器"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleCopyItem(item)}
                  className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title="复制此条文本记录"
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
                  title="删除此记录"
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
