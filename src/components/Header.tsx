/**
 * Header component styled in FormulaCalcKit signature layout:
 * Clean white background with subtle border, indigo/blue brand mark, pill badges, and dual-language selector.
 */
import React from 'react';
import { RotateCcw, FileText, Globe } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReset: () => void;
  onExport: () => void;
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReset,
  onExport,
  lang,
  setLang,
}) => {
  const navItems = [
    { id: 'calculator', label: lang === 'zh' ? '欧姆定律与功率' : 'Ohm & Power' },
    { id: 'circuit', label: lang === 'zh' ? '串并联电路分析' : 'Circuit Solver' },
    { id: 'resistor', label: lang === 'zh' ? '色环电阻解码' : 'Color Decoder' },
    { id: 'energy', label: lang === 'zh' ? '电能电费核算' : 'Energy & Cost' },
    { id: 'tutorial', label: lang === 'zh' ? '物理教程与参考' : 'Guide & Reference' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 py-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs font-bold font-mono text-lg shrink-0">
            Ω
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('calculator')}
              className="font-bold text-slate-900 tracking-tight text-base sm:text-lg hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer text-left"
            >
              {lang === 'zh' ? '欧姆定律与电功率万能计算器' : "Ohm's Law & Power Calculator"}
            </button>
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-medium whitespace-nowrap">
              FormulaCalcKit
            </span>
          </div>
        </div>

        {/* Center Nav Links - 5 Clean tabs */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer font-medium ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            title={lang === 'zh' ? 'Switch to English' : '切换为简体中文'}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono">{lang === 'zh' ? 'EN' : '中文'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            title={lang === 'zh' ? '重置所有输入' : 'Reset Inputs'}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'zh' ? '重置' : 'Reset'}</span>
          </button>

          {/* Export Report CTA */}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'zh' ? '导出报告' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Nav Strip */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar border-t border-slate-100 bg-slate-50/80 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === item.id
                ? 'bg-blue-600 text-white font-medium shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
