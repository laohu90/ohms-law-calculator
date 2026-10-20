/**
 * FAQ Accordion Section styled in FormulaCalcKit signature layout.
 */
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  qZh: string;
  qEn: string;
  aZh: string;
  aEn: string;
}

const FAQS: FaqItem[] = [
  {
    qZh: '欧姆定律公式中，电压、电流、电阻与电功率的基本单位分别是什么？',
    qEn: "What are the standard SI units in Ohm's Law and Power equations?",
    aZh: '在国际单位制 (SI) 中：电压 U（或 V）的单位是伏特 (V)；电流 I 的单位是安培 (A)；电阻 R 的单位是欧姆 (Ω)；电功率 P 的单位是瓦特 (W)。1 伏特等于 1 安培电流流过 1 欧姆电阻时产生的电位降 (1V = 1A × 1Ω)，1 瓦特等于 1 伏特电压下流过 1 安培电流所消耗的功率 (1W = 1V × 1A)。',
    aEn: "In the SI system: Voltage (U or V) is in Volts (V); Current (I) in Amperes (A); Resistance (R) in Ohms (Ω); Electric Power (P) in Watts (W). 1V = 1A × 1Ω, and 1W = 1V × 1A = 1 Joule/second.",
  },
  {
    qZh: '已知用电器的额定电压和额定功率，如何计算它的工作电流与等效电阻？',
    qEn: 'How to calculate operating current and equivalent resistance from rated voltage and wattage?',
    aZh: '根据电功率变形公式：工作电流 I = P / U；内部等效纯电阻 R = U² / P。例如标有“220V 1000W”的电热水壶，工作电流 I = 1000 / 220 ≈ 4.55 A，等效热态电阻 R = 220² / 1000 = 48.4 Ω。',
    aEn: 'Current is given by I = P / U and resistance by R = U² / P. For example, a 220V 1000W kettle draws I = 1000 / 220 ≈ 4.55 A with resistance R = 220² / 1000 = 48.4 Ω.',
  },
  {
    qZh: '串联电路与并联电路在分压与分流上有什么核心区别与口诀？',
    qEn: 'What is the fundamental difference between series and parallel circuits?',
    aZh: '【串联电路】：电流处处相等 (I = I1 = I2)，总电压等于各分压之和 (U = U1 + U2)，分压与电阻成正比 (U1/U2 = R1/R2，阻值越大分压越高)，总电阻变大 (R = R1 + R2)；【并联电路】：各支路电压处处相等 (U = U1 = U2)，总电流等于各分流之和 (I = I1 + I2)，分流与电阻成反比 (I1/I2 = R2/R1，阻值越小分流越大)，总电阻变小 (1/R = 1/R1 + 1/R2)。',
    aEn: 'In series: Current is identical everywhere, voltage divides proportional to resistance (higher R gets higher V). In parallel: Voltage is identical across all branches, current divides inversely proportional to resistance (lower R takes higher current).',
  },
  {
    qZh: '为什么发热电器用 P = U²/R，而高压输电线路损耗用 P = I²R？',
    qEn: 'Why use P = U²/R for household heaters and P = I²R for power grid transmission losses?',
    aZh: '因为家用电器接入的是家庭固定恒压电网 (220V 固定)，此时电压 U 不变，功率与电阻成反比 (电阻越小发热功率越大)；而高压输电线是在主回路中传输大电流，导线本身相当于串联在回路中的小电阻，流过导线的电流 I 决定了焦耳发热损失，根据 P = I²R，将输电电压升高可成倍降低电流 I，从而将线路热损耗降低至原来的几百分之一。',
    aEn: 'Household appliances operate on a fixed supply voltage (e.g. 220V), where P = U²/R dictates power. Transmission lines carry a specific load current, where loss is thermal Joule heat P = I²·R_line. Raising transmission voltage lowers current I and reduces line losses exponentially.',
  },
  {
    qZh: '欧姆定律在什么情况下不成立或失效？',
    qEn: "When does Ohm's Law not apply or fail?",
    aZh: '欧姆定律只适用于金属导体、纯阻性合金以及电解质溶液等线性导体。对于半导体二极管/三极管（具有PN结阈值和非线性伏安特性）、气体辉光放电管、电弧以及超导体（临界温度下电阻突变为零，无电压维持电流），欧姆定律不再成立。此外，电动机等非纯电阻设备必须考虑线圈切割磁感线产生的反电动势，不能简单套用 U = IR 计算电能。',
    aEn: "Ohm's Law fails for non-linear components such as diodes, transistors, gas discharge lamps, electric arcs, and superconductors. For AC circuits with reactive components (capacitors and inductors), impedance Z = R + jX replaces pure resistance.",
  },
];

export const FaqSection: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <HelpCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          {lang === 'zh' ? '常见问题与电学答疑 (FAQ)' : 'Frequently Asked Questions (FAQ)'}
        </h3>
      </div>

      <div className="divide-y divide-slate-100">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => toggle(idx)}
                className="w-full text-left flex items-center justify-between gap-4 py-1 text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span>{lang === 'zh' ? faq.qZh : faq.qEn}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2 text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {lang === 'zh' ? faq.aZh : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
