/**
 * Main Application Component for Ohm's Law & Electric Power Calculator.
 * Styled in FormulaCalcKit signature layout (density-calculator & linear-function-calculator).
 */
import { useState } from 'react';
import { Header } from './components/Header';
import { OhmCalculator } from './components/OhmCalculator';
import { CircuitSolver } from './components/CircuitSolver';
import { ResistorDecoder } from './components/ResistorDecoder';
import { EnergyCostCalculator } from './components/EnergyCostCalculator';
import { MaterialTable } from './components/MaterialTable';
import { TutorialGuide } from './components/TutorialGuide';
import { FaqSection } from './components/FaqSection';
import { ExportModal } from './components/ExportModal';
import { AdSlot } from './components/AdSlot';
import { useSeoHead } from './utils/useSeoHead';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  // Synchronize SEO meta tags dynamically based on locale & current tab
  useSeoHead({ lang, activeTab });

  const handleReset = () => {
    setResetKey((prev) => prev + 1);
  };

  const generateReport = () => {
    const timestamp = new Date().toLocaleString('zh-CN');
    return `# 欧姆定律与电功率万能计算与工程分析报告
生成时间: ${timestamp}
应用系统: 欧姆定律与电功率万能计算器 (FormulaCalcKit)

---

## 1. 核心物理定律与基本代数关系
- 欧姆定律基本式: U = I × R, I = U / R, R = U / I
- 电功率核心定义: P = U × I
- 纯电阻导出公式: P = I² × R, P = U² / R, R = U² / P, R = P / I²
- 耐压与极限电流: U = √(P × R), I = √(P / R)

## 2. 串联与并联电路核心准则
- 串联电路:
  - 等效总电阻: R_eq = R1 + R2 + ... + Rn
  - 回路总电流: I_total = U_total / R_eq
  - 分压定理: U_k = U_total × (R_k / R_eq) (电阻越大分压越大)
  - 各元件功率: P_k = I² × R_k
- 并联电路:
  - 等效总电导: G_eq = 1/R1 + 1/R2 + ... + Rn => R_eq = 1 / G_eq
  - 各支路电压: U_k = U_total
  - 分流定理: I_k = U_total / R_k (电阻越小分流越大)
  - 各元件功率: P_k = U² / R_k

## 3. 电能与焦耳定律
- 电功定义: W = P × t = U × I × t
- 焦耳发热: Q = I² × R × t
- 非纯电阻电路特例: W_总 = U·I·t, Q_热 = I²·r·t, W_有用机械功 = W_总 - Q_热

## 4. 色环电阻标称速记口诀
- 颜色对应 0~9: 黑0, 棕1, 红2, 橙3, 黄4, 绿5, 蓝6, 紫7, 灰8, 白9
- 乘数: 金色 ×0.1 (±5%), 银色 ×0.01 (±10%)
- 常用标准色环阻值: E24系列标准阻值公差 ±5%
`;
  };

  return (
    <div key={resetKey} className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* FormulaCalcKit Style Header with 5 Clean Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleReset}
        onExport={() => setIsExportOpen(true)}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
        {/* Render Active Module */}
        {activeTab === 'calculator' && <OhmCalculator lang={lang} />}
        {activeTab === 'circuit' && <CircuitSolver lang={lang} />}
        {activeTab === 'resistor' && <ResistorDecoder lang={lang} />}
        {activeTab === 'energy' && <EnergyCostCalculator lang={lang} />}
        {activeTab === 'tutorial' && (
          <div className="space-y-10">
            <TutorialGuide lang={lang} />
            <MaterialTable lang={lang} />
          </div>
        )}

        {/* Dedicated Responsive Smart Ad Slot (Zero CLS Layout) */}
        <AdSlot slotId="calc-footer-banner" lang={lang} />

        {/* Global FAQ Accordion (FormulaCalcKit Standard) */}
        <FaqSection lang={lang} />
      </main>

      {/* FormulaCalcKit Clean White Footer with E-E-A-T & Google Compliance */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                Ω
              </div>
              <span className="text-slate-900 font-bold text-sm">
                {lang === 'zh' ? '欧姆定律与电功率计算器' : "Ohm's Law & Electric Power Calculator"}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500">FormulaCalcKit Physics Series</span>
            </div>

            {/* Quick Tool Navigation for Crawlers and Users */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`cursor-pointer hover:text-blue-600 transition-colors ${
                  activeTab === 'calculator' ? 'font-bold text-blue-600' : ''
                }`}
              >
                {lang === 'zh' ? '欧姆定律计算' : "Ohm's Law Solver"}
              </button>
              <button
                onClick={() => setActiveTab('circuit')}
                className={`cursor-pointer hover:text-blue-600 transition-colors ${
                  activeTab === 'circuit' ? 'font-bold text-blue-600' : ''
                }`}
              >
                {lang === 'zh' ? '串并联分压仿真' : 'Circuit Solver'}
              </button>
              <button
                onClick={() => setActiveTab('resistor')}
                className={`cursor-pointer hover:text-blue-600 transition-colors ${
                  activeTab === 'resistor' ? 'font-bold text-blue-600' : ''
                }`}
              >
                {lang === 'zh' ? '色环电阻解码' : 'Resistor Decoder'}
              </button>
              <button
                onClick={() => setActiveTab('energy')}
                className={`cursor-pointer hover:text-blue-600 transition-colors ${
                  activeTab === 'energy' ? 'font-bold text-blue-600' : ''
                }`}
              >
                {lang === 'zh' ? '电能电费核算' : 'Electricity Cost'}
              </button>
              <button
                onClick={() => setActiveTab('tutorial')}
                className={`cursor-pointer hover:text-blue-600 transition-colors ${
                  activeTab === 'tutorial' ? 'font-bold text-blue-600' : ''
                }`}
              >
                {lang === 'zh' ? '物理教程与参考表' : 'Guide & Resistivity'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <p className="max-w-2xl leading-relaxed">
              {lang === 'zh'
                ? '免责声明：本系统计算公式基于国际单位制(SI)、基尔霍夫电路定律与IEC/GB电气标准。运算结果供教学科研、电子DIY与工程预估参考；实际强电布线与断路器选型请务必由国家持证电工在断电安全状态下实施。'
                : 'Disclaimer: All calculations comply with SI standards, Kirchhoff laws, and standard electrical codes. Intended for educational, laboratory, and engineering estimations. High-voltage installations must be inspected by certified electricians.'}
            </p>

            <div className="shrink-0 font-mono text-slate-400">
              © 2026 FormulaCalcKit · All Rights Reserved
            </div>
          </div>
        </div>
      </footer>

      {/* Export Report Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reportContent={generateReport()}
      />
    </div>
  );
}
