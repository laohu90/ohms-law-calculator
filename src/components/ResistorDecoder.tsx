/**
 * Resistor Color Code Decoder and Reverse Lookup.
 * Styled in FormulaCalcKit signature layout (clean white cards, 12-col split, crisp color selectors).
 */
import React, { useState } from 'react';
import {
  COLOR_TABLE,
  DIGIT_COLORS,
  MULTIPLIER_COLORS,
  TOLERANCE_COLORS,
  decode4Band,
  decode5Band,
  encodeResistanceToBands,
} from '../utils/resistorColors';
import { formatValue, formatAutoEngineering } from '../utils/formulas';
import { ArrowRightLeft, BookOpen } from 'lucide-react';

export const ResistorDecoder: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [bandCount, setBandCount] = useState<4 | 5>(4);

  // Active bands
  const [band1, setBand1] = useState<string>('yellow'); // 4
  const [band2, setBand2] = useState<string>('violet'); // 7
  const [band3, setBand3] = useState<string>('black');  // 0 (for 5-band)
  const [multiplier, setMultiplier] = useState<string>('red'); // x100 => 4.7k
  const [tolerance, setTolerance] = useState<string>('gold'); // 5%

  // Reverse lookup state
  const [reverseOhms, setReverseOhms] = useState<string>('10000'); // 10k

  const decoded =
    bandCount === 4
      ? decode4Band(band1, band2, multiplier, tolerance)
      : decode5Band(band1, band2, band3, multiplier, tolerance);

  const eng = formatAutoEngineering(decoded.resistance, 'resistance');
  const minOhms = decoded.resistance * (1 - decoded.tolerance / 100);
  const maxOhms = decoded.resistance * (1 + decoded.tolerance / 100);

  const reverseOhmsNum = parseFloat(reverseOhms) || 0;
  const reverse4Result = encodeResistanceToBands(reverseOhmsNum, false);
  const reverse5Result = encodeResistanceToBands(reverseOhmsNum, true);

  return (
    <section id="resistor" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{lang === 'zh' ? '色环标称解码 · E24标准' : 'RESISTOR COLOR CODE DECODER'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === 'zh' ? '色环电阻阻值解码与反查对照器' : 'Resistor Color Code Decoder & Reverse Lookup'}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              {lang === 'zh'
                ? '支持标准 4 环与高精度 5 环金属膜/碳膜电阻双向解码。点选色环查看阻值及公差范围，或输入目标阻值秒出推荐色环排布。'
                : 'Interactive 4-band and 5-band resistor color decoder with reverse resistance search and E-series tolerance boundaries.'}
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setBandCount(4)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                bandCount === 4
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4 环电阻 (标准)
            </button>
            <button
              onClick={() => setBandCount(5)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                bandCount === 5
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              5 环电阻 (精密)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Resistor Graphic & Palette (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Realistic SVG Resistor */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center">
            <div className="w-full max-w-[460px] aspect-[4/1.8] flex items-center justify-center">
              <svg viewBox="0 0 500 220" className="w-full h-full drop-shadow-sm select-none">
                <defs>
                  <linearGradient id="resistor-body-light" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e2e8f0" />
                    <stop offset="30%" stopColor="#f8fafc" />
                    <stop offset="70%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <linearGradient id="lead-wire-light" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="50%" stopColor="#e2e8f0" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>

                {/* Left Wire Lead */}
                <rect x="20" y="105" width="80" height="10" rx="2" fill="url(#lead-wire-light)" />
                {/* Right Wire Lead */}
                <rect x="400" y="105" width="80" height="10" rx="2" fill="url(#lead-wire-light)" />

                {/* Ceramic Body */}
                <path
                  d="M 100 80 
                     C 100 65, 120 65, 130 75 
                     L 145 85 
                     L 355 85 
                     L 370 75 
                     C 380 65, 400 65, 400 80 
                     L 400 140 
                     C 400 155, 380 155, 370 145 
                     L 355 135 
                     L 145 135 
                     L 130 145 
                     C 120 155, 100 155, 100 140 
                     Z"
                  fill="url(#resistor-body-light)"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />

                {/* Color Bands */}
                <rect
                  x="135"
                  y="72"
                  width="18"
                  height="76"
                  rx="1"
                  fill={COLOR_TABLE[band1]?.colorHex || '#18181b'}
                  stroke="#00000030"
                  strokeWidth="1"
                />

                <rect
                  x="175"
                  y="85"
                  width="18"
                  height="50"
                  rx="1"
                  fill={COLOR_TABLE[band2]?.colorHex || '#18181b'}
                  stroke="#00000030"
                  strokeWidth="1"
                />

                {bandCount === 5 && (
                  <rect
                    x="215"
                    y="85"
                    width="18"
                    height="50"
                    rx="1"
                    fill={COLOR_TABLE[band3]?.colorHex || '#18181b'}
                    stroke="#00000030"
                    strokeWidth="1"
                  />
                )}

                <rect
                  x={bandCount === 4 ? 240 : 270}
                  y="85"
                  width="18"
                  height="50"
                  rx="1"
                  fill={COLOR_TABLE[multiplier]?.colorHex || '#18181b'}
                  stroke="#00000030"
                  strokeWidth="1"
                />

                <rect
                  x="345"
                  y="72"
                  width="18"
                  height="76"
                  rx="1"
                  fill={COLOR_TABLE[tolerance]?.colorHex || '#d97706'}
                  stroke="#00000030"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Readout strip */}
            <div className="w-full mt-2 pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">
                  {lang === 'zh' ? '解码标称电阻:' : 'Decoded Resistance:'}
                </span>
                <div className="text-3xl font-mono font-extrabold text-blue-700">
                  {eng.value} {eng.unit}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-slate-500">
                  {lang === 'zh' ? '标称公差: ' : 'Tolerance: '}
                  <strong className="text-emerald-700">±{decoded.tolerance}%</strong>
                </span>
                <div className="text-xs font-mono text-slate-500 mt-0.5">
                  允许区间: {formatValue(minOhms, 2)}Ω ~ {formatValue(maxOhms, 2)}Ω
                </div>
              </div>
            </div>
          </div>

          {/* Color Band Swatches Palette */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {lang === 'zh' ? '色环颜色配置面板' : 'Color Band Configuration'}
            </h3>

            {/* Band 1 */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-700 font-medium">
                第 1 环 (第 1 位有效数字): <span className="font-mono text-blue-700 font-bold">{COLOR_TABLE[band1]?.name} [{COLOR_TABLE[band1]?.digit}]</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DIGIT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBand1(c)}
                    className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                      band1 === c ? 'scale-110 ring-2 ring-blue-600 shadow-xs' : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: COLOR_TABLE[c].colorHex }}
                    title={COLOR_TABLE[c].name}
                  />
                ))}
              </div>
            </div>

            {/* Band 2 */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-700 font-medium">
                第 2 环 (第 2 位有效数字): <span className="font-mono text-blue-700 font-bold">{COLOR_TABLE[band2]?.name} [{COLOR_TABLE[band2]?.digit}]</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DIGIT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBand2(c)}
                    className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                      band2 === c ? 'scale-110 ring-2 ring-blue-600 shadow-xs' : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: COLOR_TABLE[c].colorHex }}
                    title={COLOR_TABLE[c].name}
                  />
                ))}
              </div>
            </div>

            {/* Band 3 (if 5-band) */}
            {bandCount === 5 && (
              <div className="space-y-1.5">
                <div className="text-xs text-slate-700 font-medium">
                  第 3 环 (第 3 位有效数字): <span className="font-mono text-blue-700 font-bold">{COLOR_TABLE[band3]?.name} [{COLOR_TABLE[band3]?.digit}]</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DIGIT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setBand3(c)}
                      className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                        band3 === c ? 'scale-110 ring-2 ring-blue-600 shadow-xs' : 'border-slate-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: COLOR_TABLE[c].colorHex }}
                      title={COLOR_TABLE[c].name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Multiplier */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-700 font-medium">
                倍率环 (乘数): <span className="font-mono text-blue-700 font-bold">{COLOR_TABLE[multiplier]?.name} [×{COLOR_TABLE[multiplier]?.multiplier}]</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MULTIPLIER_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setMultiplier(c)}
                    className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                      multiplier === c ? 'scale-110 ring-2 ring-blue-600 shadow-xs' : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: COLOR_TABLE[c].colorHex }}
                    title={`${COLOR_TABLE[c].name} (x${COLOR_TABLE[c].multiplier})`}
                  />
                ))}
              </div>
            </div>

            {/* Tolerance */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-700 font-medium">
                公差环 (精度): <span className="font-mono text-emerald-700 font-bold">{COLOR_TABLE[tolerance]?.name} [±{COLOR_TABLE[tolerance]?.tolerance}%]</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOLERANCE_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setTolerance(c)}
                    className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                      tolerance === c ? 'scale-110 ring-2 ring-emerald-600 shadow-xs' : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: COLOR_TABLE[c].colorHex }}
                    title={`${COLOR_TABLE[c].name} (±${COLOR_TABLE[c].tolerance}%)`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reverse Decoder and Mnemonic Table (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Reverse Lookup Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'zh' ? '阻值反查色环 (Reverse Lookup)' : 'Reverse Color Band Finder'}
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {lang === 'zh' ? '输入电阻数值（欧姆），系统自动推导 4 环与 5 环标准色环排布：' : 'Enter resistance in Ohms to automatically find the color band sequence:'}
            </p>

            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="any"
                value={reverseOhms}
                onChange={(e) => setReverseOhms(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono text-sm focus:outline-none focus:border-blue-600 focus:bg-white"
                placeholder="例如: 4700 或 10000"
              />
              <span className="inline-flex items-center px-3 rounded-xl bg-slate-100 text-xs font-mono text-slate-600 border border-slate-200">
                Ω
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '330Ω (LED限流)', val: '330' },
                { label: '1kΩ (上拉)', val: '1000' },
                { label: '4.7kΩ (I2C上拉)', val: '4700' },
                { label: '10kΩ (分压标准)', val: '10000' },
                { label: '100kΩ (高阻)', val: '100000' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setReverseOhms(p.val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 hover:text-blue-600 hover:border-blue-200 cursor-pointer transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Reverse Results */}
            <div className="space-y-3 pt-2">
              {/* 4-Band Result */}
              {reverse4Result && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                    <span>标准 4 环色环推荐:</span>
                    <span className="text-blue-700 font-mono text-[11px] font-bold">
                      {reverse4Result.standardResistance}Ω (±5%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      reverse4Result.band1,
                      reverse4Result.band2,
                      reverse4Result.multiplier,
                      reverse4Result.tolerance,
                    ]
                      .filter(Boolean)
                      .map((c, i) => {
                        const bandInfo = COLOR_TABLE[c as string];
                        if (!bandInfo) return null;
                        return (
                          <div
                            key={i}
                            className="flex-1 py-1 px-1 rounded-md text-center text-[10px] font-mono font-bold shadow-2xs border border-black/10"
                            style={{
                              backgroundColor: bandInfo.colorHex,
                              color: bandInfo.textColor,
                            }}
                          >
                            {bandInfo.name.split(' ')[0]}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* 5-Band Result */}
              {reverse5Result && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="text-xs font-semibold text-slate-900 flex items-center justify-between">
                    <span>精密 5 环色环推荐:</span>
                    <span className="text-blue-700 font-mono text-[11px] font-bold">
                      {reverse5Result.standardResistance}Ω (±1%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[
                      reverse5Result.band1,
                      reverse5Result.band2,
                      reverse5Result.band3,
                      reverse5Result.multiplier,
                      reverse5Result.tolerance,
                    ]
                      .filter((c): c is string => Boolean(c))
                      .map((c, i) => {
                        const bandInfo = COLOR_TABLE[c];
                        if (!bandInfo) return null;
                        return (
                          <div
                            key={i}
                            className="flex-1 py-1 px-1 rounded-md text-center text-[10px] font-mono font-bold shadow-2xs border border-black/10"
                            style={{
                              backgroundColor: bandInfo.colorHex,
                              color: bandInfo.textColor,
                            }}
                          >
                            {bandInfo.name.split(' ')[0]}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Color Code Mnemonic Guide */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">色环速记口诀与法则</h3>
            </div>
            <div className="text-xs text-slate-700 font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              <strong className="text-blue-700 font-bold">“黑棕红橙黄绿蓝紫灰白”</strong>
              <div className="text-slate-500 text-[11px] mt-1.5 font-sans">
                对应数字 0 到 9：<br />
                黑0, 棕1, 红2, 橙3, 黄4, 绿5, 蓝6, 紫7, 灰8, 白9。<br />
                金色为乘 0.1 (±5%), 银色为乘 0.01 (±10%)。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
