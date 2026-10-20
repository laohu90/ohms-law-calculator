/**
 * Comprehensive Electrical Physics Tutorial and Interactive Quiz System.
 * Styled in FormulaCalcKit signature layout (clean white cards, 12-col split, crisp QA).
 */
import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types/electronics';
import {
  BookOpen,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Lightbulb,
  Zap,
  Layers,
} from 'lucide-react';

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: '【经典亮度陷阱】将标有“220V 40W”的灯泡 L1 和标有“220V 100W”的灯泡 L2 串联后接入 220V 的电源中（假设灯丝电阻不变），下列说法正确的是？',
    options: [
      'L2 比 L1 更亮，因为 L2 的额定功率更大',
      'L1 比 L2 更亮，因为 L1 的实际发光功率更大',
      '两只灯泡一样亮，因为串联回路中电流处处相等',
      '两只灯泡都会立即因过载而烧断灯丝',
    ],
    correctIndex: 1,
    difficulty: '进阶',
    explanation:
      '根据额定功率公式 R = U²/P：L1 的电阻 R1 = 220²/40 = 1210Ω；L2 的电阻 R2 = 220²/100 = 484Ω，即 R1 > R2。当两灯串联时，电流 I 处处相等，根据焦耳定律 P实 = I²R，电阻更大的 L1 消耗的实际电功率更大，因此 40W 的 L1 反而更亮！这是物理中极易出错的经典题。',
  },
  {
    id: 2,
    title: '【微观机制】在一段接有恒定直流电压的直导线中，电路闭合瞬间电灯几乎立即发光，这是因为？',
    options: [
      '自由电子以光速从电源负极直接飞奔到了灯泡处',
      '导线中电场的建立以接近光速（约3×10⁸ m/s）传播，使全线电子几乎同时定向漂移',
      '导线内部不存在电阻碰撞，电子运动没有延迟',
      '电压使灯丝产生了极高的化学反应自燃',
    ],
    correctIndex: 1,
    difficulty: '基础',
    explanation:
      '注意区分“电信号传播速度”与“电子定向漂移速度”：导体内部自由电子定向漂移的平均速度其实极其微小（通常只有 10⁻⁴ ~ 10⁻⁵ m/s，即几十分钟才移动几厘米），但闭合开关瞬间，沿导线建立电磁场的速度接近真空中光速 c（约 3×10⁸ m/s），使整条导线中的所有自由电子几乎在同一瞬间同时起步定向移动。',
  },
  {
    id: 3,
    title: '【非纯电阻电路】一台标有“220V 1100W”的电风扇在额定电压下正常工作，测得其内部线圈电阻为 4Ω。该电风扇每分钟消耗的电能 W 和线圈产生的焦耳热 Q 分别为？',
    options: [
      'W = 66,000 J，Q = 66,000 J',
      'W = 66,000 J，Q = 6,000 J',
      'W = 1,100 J，Q = 100 J',
      'W = 6,000 J，Q = 66,000 J',
    ],
    correctIndex: 1,
    difficulty: '进阶',
    explanation:
      '电风扇是非纯电阻用电器！输入电流 I = P/U = 1100W / 220V = 5A。每分钟时间 t = 60s。消耗的总电能 W = P·t = 1100W × 60s = 66,000 J。线圈产生的焦耳热只能用焦耳定律 Q = I²rt 计算：Q = 5² × 4Ω × 60s = 25 × 4 × 60 = 6,000 J。绝大部分电能（60,000 J）转化成了风扇转动的机械能，切忌使用 Q = U²/R 错算！',
  },
  {
    id: 4,
    title: '【最大功率传输定理】已知直流电源的电动势为 E = 12V，电源内阻为 r = 3Ω。当外电路负载电阻 R 调节为多少时，该负载获得的电功率最大？最大功率是多少？',
    options: [
      'R = 0Ω（短路），Pmax = 48W',
      'R = 3Ω，Pmax = 12W',
      'R = 6Ω，Pmax = 8W',
      'R → ∞（开路），Pmax = 12W',
    ],
    correctIndex: 1,
    difficulty: '竞赛',
    explanation:
      '根据最大功率传输定理，外电路负载获得最大功率的充要条件是负载电阻等于电源内阻，即 R = r = 3Ω。此时回路电流 I = E / (R + r) = 12V / 6Ω = 2A。负载最大功率 Pmax = I²R = 2² × 3 = 12W。亦可用公式 Pmax = E² / (4r) = 144 / 12 = 12W 直接求解。此时电源供电效率为 50%。',
  },
  {
    id: 5,
    title: '【欧姆定律适用性】下列哪一种电子元器件在正常工作条件下严格服从欧姆定律（其伏安特性曲线为通过原点的直线）？',
    options: [
      '硅整流二极管 (1N4007)',
      '金属膜精密定值电阻',
      '发光二极管 (LED)',
      '荧光日光灯管（气体辉光放电）',
    ],
    correctIndex: 1,
    difficulty: '基础',
    explanation:
      '欧姆定律只适用于金属导体、纯电阻元件以及电解质溶液。半导体二极管具有非线性的单向导电性，LED具有正向开启电压阈值，气体放电管存在电离雪崩击穿过程，它们的电压与电流均不成固定线性正比，属于典型的非线性元件。金属膜精密电阻在额定温升内阻值基本恒定，严格服从欧姆定律。',
  },
  {
    id: 6,
    title: '【并联电路分流】将 R1 = 10Ω 和 R2 = 40Ω 两个电阻并联，接入某一电压恒定的直流电路中。已知干路总电流为 2.5A，则流过 R1 的分流电流是多少？',
    options: [
      '0.5 A',
      '1.0 A',
      '2.0 A',
      '1.25 A',
    ],
    correctIndex: 2,
    difficulty: '基础',
    explanation:
      '并联电路分流原理：流过各电阻的电流与其阻值成反比，即 I1 / I2 = R2 / R1 = 40 / 10 = 4 / 1。因此 I1 占干路总电流的 4 / (4 + 1) = 4/5。所以 I1 = 2.5A × (4/5) = 2.0A；流过 R2 的分流为 0.5A。阻值越小分流越大。',
  },
];

export const TutorialGuide: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [activeTab, setActiveTab] = useState<'theory' | 'traps' | 'quiz'>('theory');

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (userAnswers[qId] !== undefined) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));

    const newAnswers = { ...userAnswers, [qId]: optIdx };
    if (Object.keys(newAnswers).length === QUIZ_QUESTIONS.length) {
      const allCorrect = QUIZ_QUESTIONS.every(
        (q) => newAnswers[q.id] === q.correctIndex
      );
      if (allCorrect) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanation({});
  };

  const scoreCount = QUIZ_QUESTIONS.filter(
    (q) => userAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <section id="tutorial" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>{lang === 'zh' ? '电学核心教程 · 进阶自测' : 'PHYSICS MASTERCLASS & QUIZ'}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {lang === 'zh' ? '电学核心教程、实验避坑指南与自测题库' : 'Electrical Physics Tutorial & Quiz'}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              {lang === 'zh'
                ? '从微观电子漂移到宏观基尔霍夫网络、纯电阻与非纯电阻差异、最大功率传输定理及经典考题陷阱剖析。'
                : 'In-depth tutorial on electron drift mechanics, Kirchhoff laws, non-pure resistive motors, and a 6-question quiz.'}
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              理论与微观机理
            </button>
            <button
              onClick={() => setActiveTab('traps')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'traps'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              经典考题易错陷阱
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              交互自测试卷 ({scoreCount}/{QUIZ_QUESTIONS.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Chapter 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>01. 欧姆定律的微观物理本质与适用边界</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">
                  自由电子的微观定向漂移模型 (Drift Velocity)
                </h4>
                <p className="text-slate-600">
                  金属导体内部充满着大量自由电子（密度约 10²⁸ 个/m³）。在未加电场时，电子做杂乱无章的高速无规则热运动（速度约 10⁵ m/s），宏观电流为零。
                </p>
                <p className="text-slate-600">
                  当在导体两端施加电位差 U 时，导体内形成恒定电场 E = U/L。电子受到电场力 F = eE 加速，并不断与晶格离子发生非弹性碰撞而减速，最终达到一个稳定的平均定向漂移速度 v_d：
                </p>
                <div className="font-mono text-blue-700 font-bold bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-center">
                  I = n · e · S · v_d
                </div>
                <p className="text-slate-500 text-[11px]">
                  其中 n 为电子数密度，e 为元电荷，S 为导线横截面积。微观定向漂移速度极小（仅约 0.1 mm/s），但电场能量以电磁波速度（接近光速 c ≈ 3×10⁸ m/s）传播，故全线开关一合瞬时通电。
                </p>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">欧姆定律的适用边界与非线性元件</h4>
                <p className="text-slate-600">
                  欧姆定律并非所有物理元件的“普遍公理”，而是针对特定材料在恒温条件下的实验定律：
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  <li>
                    <strong className="text-emerald-700">适用领域</strong>: 金属导体、绝大多数纯阻性合金丝（康铜、锰铜）、电解质水溶液。
                  </li>
                  <li>
                    <strong className="text-rose-700">不适用的非线性元件</strong>: 半导体二极管/三极管（具有PN结单向导电性，伏安特性为指数弯曲曲线）、气体放电管、电弧。
                  </li>
                  <li>
                    <strong className="text-sky-700">超导现象</strong>: 当温度低于临界转变温度 Tc 时，材料电阻突变为精确的 0，欧姆定律的 R = U/I 退化，电流维持无需任何端电压维持。
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>02. 串并联电路核心定律与基尔霍夫方程</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">串联电路 (Series)</div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside">
                  <li>
                    <strong>电流处处相等</strong>: I = I_1 = I_2 = ...
                  </li>
                  <li>
                    <strong>总电压等于分压和</strong>: U = U_1 + U_2
                  </li>
                  <li>
                    <strong>分压正比于电阻</strong>: U_1 / U_2 = R_1 / R_2
                  </li>
                  <li>
                    <strong>总电阻增大</strong>: R_total = R_1 + R_2
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">并联电路 (Parallel)</div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside">
                  <li>
                    <strong>各支路电压相等</strong>: U = U_1 = U_2 = ...
                  </li>
                  <li>
                    <strong>总电流等于分流和</strong>: I = I_1 + I_2
                  </li>
                  <li>
                    <strong>分流反比于电阻</strong>: I_1 / I_2 = R_2 / R_1
                  </li>
                  <li>
                    <strong>总电阻小于任一分电阻</strong>: 1/R = 1/R_1 + 1/R_2
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">基尔霍夫定律 (Kirchhoff)</div>
                <ul className="text-slate-600 space-y-1 list-disc list-inside">
                  <li>
                    <strong>KCL (节点电流定律)</strong>: ∑ I = 0，流入任何节点的电流代数和为零，本质是电荷守恒。
                  </li>
                  <li>
                    <strong>KVL (回路电压定律)</strong>: ∑ U = 0，闭合回路各段电位差代数和为零，本质是静电场能量守恒。
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-base">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>03. 电能转换与最大功率传输定理</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">纯电阻 vs 非纯电阻电路本质</h4>
                <p className="text-slate-600">
                  <strong>纯电阻电路</strong>（如电炉、白炽灯）：吸收的所有电能 100% 转化为焦耳热，满足 W = Q = UIt = I²Rt = (U²/R)t。
                </p>
                <p className="text-slate-600">
                  <strong>非纯电阻电路</strong>（如电动机、电风扇、电瓶充电器）：电能主要转化为机械能或化学能。
                </p>
                <div className="font-mono text-blue-700 font-bold bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-center">
                  W_总 = U · I · t = W_有用机械功 + I² · r · t
                </div>
                <p className="text-slate-500 text-[11px]">
                  因此对于非纯电阻电路，I ≠ U/R（因为存在反电动势），必须使用 W = UIt 求消耗电能，用 Q = I²rt 求发热。
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">最大功率传输定理 (Matching)</h4>
                <p className="text-slate-600">
                  对于具有内阻 r 的实际直流电源，当外接可变负载电阻 R_L 时：
                </p>
                <div className="font-mono text-blue-700 font-bold bg-blue-50 border border-blue-100 p-2.5 rounded-lg text-center">
                  当 R_L = r 时，P_out 达到最大峰值 P_max = E² / (4r)
                </div>
                <p className="text-slate-600">
                  此时电源转换效率 η = 50%。在弱电通信与射频工程中，追求最大信号功率传输，因此常进行 50Ω/75Ω 阻抗匹配；而在强电电力传输中，追求的是极高输电效率（η ≥ 95%），因此绝不能让负载电阻等于电网内阻。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'traps' && (
        <div className="space-y-4">
          {[
            {
              title: '陷阱 1：灯泡串联接入时“额定功率大的灯泡更亮”？',
              trap: '很多初学者直觉认为 100W 的灯泡一定比 40W 的亮。',
              truth:
                '错！在并联接入家庭 220V 电路中，各灯电压均为 220V，100W 的实际功率等于额定功率，确实更亮。但在串联电路中，电流相同，根据 R = U²/P，40W 灯泡的电阻反而更大（1210Ω vs 484Ω）。串联时由于 P实 = I²R，电阻大的 40W 灯泡分得的电压更高、消耗实际功率更大，因此反而 40W 的灯泡更加耀眼！',
            },
            {
              title: '陷阱 2：导线电阻忽略不计，那短路时电流为什么不是无穷大？',
              trap: '根据 I = U/R，如果导线短路 R = 0，电流是不是趋向于无穷大？',
              truth:
                '实际电源都存在内部电阻 r（化学内阻或绕组电阻），导线即使很粗也有毫欧级电阻。实际短路电流为 I_short = E / r。虽然不是无穷大，但内阻极小会导致电流激增数十倍到数百倍，瞬时发热 Q = I²rt 引燃绝缘皮发生火灾爆炸。',
            },
            {
              title: '陷阱 3：滑动变阻器滑片滑动时，电压表测滑动变阻器两端电压的变化量关系',
              trap: '误以为 ΔU / ΔI 的比值等于滑动变阻器当前的电阻值。',
              truth:
                '错！根据闭合电路欧姆定律 U_滑 = E - I(R0 + r)，对电流求微分可得 |ΔU_滑 / ΔI| = R0 + r，即滑动变阻器两端电压变化量与电流变化量的比值，恒等于串联在回路中的定值电阻与电源内阻之和，而与滑动变阻器本身的即时阻值无关！这是高考与竞赛实验题的黄金考点。',
            },
            {
              title: '陷阱 4：电动机卡死不转时为什么会迅速烧毁？',
              trap: '误以为不转了就“不工作了”，应该功耗更低。',
              truth:
                '电动机正常高速旋转时，线圈切割磁感线产生强大的反电动势 E_back，使得实际回路电流维持在安全额定水平 I = (U - E_back) / r。当转子卡死时，反电动势瞬间降为零，电动机退化为单纯的纯电阻电路，电流飙升为 I_stall = U / r（可达额定电流的 5~10 倍），焦耳发热暴增 25~100 倍，绝缘漆包线几秒内熔毁。',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800">
                <strong>误区直觉:</strong> {item.trap}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
                <strong className="text-emerald-700">正确物理推导:</strong> {item.truth}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="space-y-6">
          {/* Quiz Score Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold font-mono text-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  电学进阶闯关自测试卷
                </div>
                <div className="text-xs text-slate-500">
                  已完成: {Object.keys(userAnswers).length} / {QUIZ_QUESTIONS.length} 题 · 当前答对:{' '}
                  <span className="text-blue-700 font-bold">{scoreCount}</span> 题
                </div>
              </div>
            </div>

            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>重新作答</span>
            </button>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-2xl p-6 border transition-all shadow-xs ${
                    isAnswered
                      ? isCorrect
                        ? 'border-emerald-300 ring-2 ring-emerald-50'
                        : 'border-rose-300 ring-2 ring-rose-50'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 font-mono text-xs font-bold">
                          第 {idx + 1} 题
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {q.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug pt-1">
                        {q.title}
                      </h3>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <div className="flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle className="w-4 h-4" />
                            <span>回答正确</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-rose-700 text-xs font-bold bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                            <XCircle className="w-4 h-4" />
                            <span>回答有误</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = q.correctIndex === optIdx;

                      let optClass =
                        'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80';

                      if (isAnswered) {
                        if (isThisCorrect) {
                          optClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                        } else if (isThisSelected && !isCorrect) {
                          optClass = 'bg-rose-50 border-rose-300 text-rose-900';
                        } else {
                          optClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${optClass}`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-300 font-mono text-slate-700 flex items-center justify-center shrink-0 text-[11px] font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 mt-0.5">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Block */}
                  {showExplanation[q.id] && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl space-y-1.5 border border-slate-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                        <Lightbulb className="w-4 h-4 text-blue-600" />
                        <span>试题详尽解析与物理思路:</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
