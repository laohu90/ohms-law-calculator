/**
 * Authoritative Bilingual Formula & Engineering Reference Section (SEO & Traffic Engine).
 * Designed to capture high-volume search traffic on Google for Ohm's Law, Power, Wire Sizing & Electrical formulas.
 */
import React from 'react';
import { BookOpen, Table, ShieldCheck, Zap, HelpCircle, ExternalLink } from 'lucide-react';

interface Props {
  lang: 'zh' | 'en';
}

export const SeoReferenceSection: React.FC<Props> = ({ lang }) => {
  const isZh = lang === 'zh';

  return (
    <article className="mt-12 space-y-8 pt-8 border-t border-slate-200/80">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="text-[11px] font-mono font-bold tracking-wider text-blue-600 uppercase">
          {isZh ? '电学参考手册 · 权威公式矩阵' : 'REFERENCE GUIDE · FORMULA MATRIX & WIRE SIZING'}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {isZh
            ? '欧姆定律与电功率 12 核心公式矩阵速查'
            : "Ohm's Law & Electric Power 12 Formula Wheel Matrix"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
          {isZh
            ? '在电路分析与电气工程中，电压(U)、电流(I)、电阻(R)与电功率(P)构成了最核心的四个物理量。任意已知其中两个量，即可通过下列代数矩阵直接推导求解：'
            : "In electrical physics, Voltage (U), Current (I), Resistance (R), and Electric Power (P) form the fundamental quad. Knowing any two allows instant derivation of the remaining two via the equations below:"}
        </p>
      </div>

      {/* 4 Cards Grid: U, I, R, P Formula Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Voltage U */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                U
              </span>
              <span className="font-bold text-sm text-slate-900">
                {isZh ? '求电压 (Voltage)' : 'Solve Voltage (U)'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
              伏特 (V)
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 I, R:</span>
              <span className="font-bold text-slate-900">U = I × R</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 P, I:</span>
              <span className="font-bold text-slate-900">U = P / I</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 P, R:</span>
              <span className="font-bold text-slate-900">U = √(P × R)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {isZh
              ? '定义：两点之间的电位差，推动电荷定向流动的动力。1V = 1A × 1Ω。'
              : 'Electric potential difference between two points. 1 Volt = 1 Amp × 1 Ohm.'}
          </p>
        </div>

        {/* Current I */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs">
                I
              </span>
              <span className="font-bold text-sm text-slate-900">
                {isZh ? '求电流 (Current)' : 'Solve Current (I)'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">
              安培 (A)
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 U, R:</span>
              <span className="font-bold text-slate-900">I = U / R</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 P, U:</span>
              <span className="font-bold text-slate-900">I = P / U</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 P, R:</span>
              <span className="font-bold text-slate-900">I = √(P / R)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {isZh
              ? '定义：单位时间内通过导体截面的电荷量。1A = 1 库仑/秒 (1C/s)。'
              : 'Rate of charge flow through a conductor. 1 Ampere = 1 Coulomb/second.'}
          </p>
        </div>

        {/* Resistance R */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                R
              </span>
              <span className="font-bold text-sm text-slate-900">
                {isZh ? '求电阻 (Resistance)' : 'Solve Resistance (R)'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
              欧姆 (Ω)
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 U, I:</span>
              <span className="font-bold text-slate-900">R = U / I</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 U, P:</span>
              <span className="font-bold text-slate-900">R = U² / P</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 P, I:</span>
              <span className="font-bold text-slate-900">R = P / I²</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {isZh
              ? '定义：导体对电流阻碍作用的大小。取决于材质电阻率、长度与横截面积。'
              : 'Opposition to electric current. Determined by resistivity ρ, length L, and area A.'}
          </p>
        </div>

        {/* Power P */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                P
              </span>
              <span className="font-bold text-sm text-slate-900">
                {isZh ? '求功率 (Power)' : 'Solve Power (P)'}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold">
              瓦特 (W)
            </span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 U, I:</span>
              <span className="font-bold text-slate-900">P = U × I</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 I, R:</span>
              <span className="font-bold text-slate-900">P = I² × R</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <span className="text-slate-500">已知 U, R:</span>
              <span className="font-bold text-slate-900">P = U² / R</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            {isZh
              ? '定义：电流在单位时间内所做的电功或能量转化速率。1W = 1 焦耳/秒 (1J/s)。'
              : 'Rate of electrical energy transfer per unit time. 1 Watt = 1 Joule/second.'}
          </p>
        </div>
      </div>

      {/* Wire Ampacity & Circuit Breaker Sizing Engineering Table (High SEO volume) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              {isZh
                ? '电气工程速查：纯铜线截面积、安全载流量与断路器匹配表'
                : 'Copper Wire Gauge Ampacity & Circuit Breaker Selection Chart'}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            IEC 60364 / GB 50217 Standard
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {isZh
            ? '在家庭装修与电气配电施工中，导线截面积必须严格根据工作电流大小选定，防止导线发热自燃；断路器（空气开关）额定电流必须小于导线最大安全载流量以提供短路与过载保护：'
            : 'Wire gauge must be selected according to continuous current to avoid thermal hazard. The circuit breaker rating must protect the wire from overload:'}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold font-mono">
                <th className="py-2.5 px-3">{isZh ? '导线规格 (mm²)' : 'Wire Size (mm²)'}</th>
                <th className="py-2.5 px-3">{isZh ? '美标规格 (AWG)' : 'AWG Size'}</th>
                <th className="py-2.5 px-3">{isZh ? '长期安全载流量 (A)' : 'Safe Ampacity (A)'}</th>
                <th className="py-2.5 px-3">{isZh ? '推荐空开规格' : 'Breaker Rating'}</th>
                <th className="py-2.5 px-3">{isZh ? '220V 承载功率' : 'Max Power @ 220V'}</th>
                <th className="py-2.5 px-3">{isZh ? '典型应用场景' : 'Typical Application'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-sans">
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">1.5 mm²</td>
                <td className="py-2.5 px-3 font-mono">16 AWG</td>
                <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">10A ~ 15A</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">C10 / C16</td>
                <td className="py-2.5 px-3 font-mono">约 2,200 W ~ 3,300 W</td>
                <td className="py-2.5 px-3">{isZh ? '全屋LED照明、排气扇回路' : 'Lighting circuits, exhaust fans'}</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors bg-blue-50/20">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">2.5 mm²</td>
                <td className="py-2.5 px-3 font-mono">14 AWG</td>
                <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">16A ~ 25A</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">C16 / C20</td>
                <td className="py-2.5 px-3 font-mono">约 3,500 W ~ 4,400 W</td>
                <td className="py-2.5 px-3">{isZh ? '客厅/卧室普通五孔插座回路' : 'Standard wall outlets & receptacles'}</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">4.0 mm²</td>
                <td className="py-2.5 px-3 font-mono">12 AWG</td>
                <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">25A ~ 32A</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">C25 / C32</td>
                <td className="py-2.5 px-3 font-mono">约 5,500 W ~ 7,000 W</td>
                <td className="py-2.5 px-3">{isZh ? '厨房大功率插座、储水式热水器、立式空调' : 'Kitchen appliances, AC, water heater'}</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">6.0 mm²</td>
                <td className="py-2.5 px-3 font-mono">10 AWG</td>
                <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">32A ~ 45A</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">C32 / C40</td>
                <td className="py-2.5 px-3 font-mono">约 7,000 W ~ 9,000 W</td>
                <td className="py-2.5 px-3">{isZh ? '即热式电热水器、中央空调外机、充电桩' : 'Instant water heater, EV charger'}</td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">10.0 mm²</td>
                <td className="py-2.5 px-3 font-mono">8 AWG</td>
                <td className="py-2.5 px-3 font-mono text-blue-700 font-semibold">48A ~ 65A</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">C50 / C63</td>
                <td className="py-2.5 px-3 font-mono">约 11,000 W ~ 14,000 W</td>
                <td className="py-2.5 px-3">{isZh ? '家庭强电箱总进户主线 (单相电入户)' : 'Residential main service feeder line'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Real-World Practical Examples Section (Google SEO snippet magnet) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            {isZh
              ? '经典生活与工程电学实际应用案例计算'
              : 'Real-World Everyday Electrical Calculation Case Studies'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {isZh ? '案例 1：手机快充充电头' : 'Case 1: USB-C Fast Charger'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                9V / 2.22A = 20W
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh
                ? '以苹果 PD 20W 快充为例，输出电压 U = 9V，输出电流 I = 2.22A。代入 P = U × I = 9 × 2.22 ≈ 20W。此时手机端等效输入阻抗 R = U / I = 9 / 2.22 ≈ 4.05 Ω。'
                : 'For an Apple 20W PD charger delivering 9V at 2.22A: P = 9 × 2.22 ≈ 20W. Equivalent load resistance R = 9 / 2.22 ≈ 4.05 Ω.'}
            </p>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {isZh ? '案例 2：家用电热水壶' : 'Case 2: Household Electric Kettle'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                220V / 2000W
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh
                ? '铭牌标有 220V 2000W 的电热水壶，工作电流 I = P / U = 2000 / 220 ≈ 9.09A。内部加热发热管等效阻值 R = U² / P = 220² / 2000 = 24.2 Ω。需配备 16A 专用三孔插座与 2.5mm² 铜线。'
                : 'A 220V 2000W kettle draws I = 2000 / 220 ≈ 9.09A. Internal heating element resistance R = 220² / 2000 = 24.2 Ω. Requires 2.5mm² wire.'}
            </p>
          </div>

          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {isZh ? '案例 3：汽车 12V 低音炮' : 'Case 3: Automotive 12V Subwoofer'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                12V / 4Ω = 36W
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isZh
                ? '车载 12V 铅酸电池驱动标称 4Ω 的扬声器低音喇叭。回路峰值电流 I = U / R = 12 / 4 = 3A。喇叭消耗的音频电功率 P = U² / R = 144 / 4 = 36W。'
                : 'A 12V car battery driving a 4Ω speaker draws I = 12 / 4 = 3A. Audio power delivered P = 12² / 4 = 36W.'}
            </p>
          </div>
        </div>
      </section>
    </article>
  );
};
