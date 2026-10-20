/**
 * Standard Material Resistivity (电阻率) and Conductivity Table.
 * Styled in FormulaCalcKit signature reference table layout.
 */
import React, { useState } from 'react';
import { MATERIAL_RESISTIVITY_TABLE, MaterialResistivity } from '../data/resistivityData';
import { Search, Table, Filter } from 'lucide-react';

export const MaterialTable: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: lang === 'zh' ? '全部物质' : 'All Materials' },
    { id: '良导体', label: lang === 'zh' ? '良导体 (Conductors)' : 'Conductors' },
    { id: '高阻合金', label: lang === 'zh' ? '高阻合金 (Resistive Alloys)' : 'Alloys' },
    { id: '半导体', label: lang === 'zh' ? '半导体 (Semiconductors)' : 'Semiconductors' },
    { id: '绝缘体', label: lang === 'zh' ? '绝缘体 (Insulators)' : 'Insulators' },
  ];

  const filteredMaterials = MATERIAL_RESISTIVITY_TABLE.filter((m) => {
    const matchesCategory =
      selectedCategory === 'all' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="materials" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>{lang === 'zh' ? '工程物理常数 · 20°C 参考' : 'PHYSICAL CONSTANTS · 20°C REFERENCE'}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {lang === 'zh' ? '常用物质与材料电阻率参考对照表' : 'Standard Material Resistivity Reference Chart'}
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {lang === 'zh'
            ? '电阻率 (Resistivity, ρ) 表征材料对电流流动的本征阻碍能力（单位：Ω·m）。导体电阻与长度成正比、与截面积成反比：R = ρ · L / S。'
            : 'Resistivity (ρ) quantifies how strongly a given material opposes the flow of electric current. Standard conductor resistance: R = ρ · L / S.'}
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'zh' ? '搜索材料名称或用途...' : 'Search material...'}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">物质名称 (Material)</th>
                <th className="py-3 px-3">类别 (Category)</th>
                <th className="py-3 px-3 font-mono">电阻率 ρ (Ω·m at 20°C)</th>
                <th className="py-3 px-3 font-mono">温度系数 α (10⁻³/°C)</th>
                <th className="py-3 px-4">典型应用与物理特征</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-mono text-xs">
                    {lang === 'zh' ? '未找到匹配的物质，请尝试更换关键词...' : 'No matching materials found.'}
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {lang === 'zh' ? m.name : m.nameEn}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                          m.category === '良导体'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : m.category === '高阻合金'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : m.category === '半导体'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {m.resistivity.toExponential(2)}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {m.tempCoeff > 0 ? `+${m.tempCoeff}` : m.tempCoeff}
                    </td>
                    <td className="py-3 px-4 text-slate-600 leading-relaxed">
                      {m.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footnote on Resistance vs Resistivity */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800">
            {lang === 'zh' ? '电阻率与导线电阻计算公式 (Resistor Law):' : 'Formula for Resistance from Resistivity:'}
          </div>
          <p className="font-mono text-blue-700 font-bold">
            R = ρ × (L / S)
          </p>
          <p className="text-[11px] text-slate-500">
            式中：ρ 为导线材料的电阻率 (Ω·m)，L 为导线长度 (m)，S 为导线横截面积 (m²)。
            导线越长电阻越大，横截面越粗电阻越小。当温度上升时，金属电阻率通常增大（正温度系数），而半导体和电解质电阻率通常减小（负温度系数）。
          </p>
        </div>
      </div>
    </section>
  );
};
