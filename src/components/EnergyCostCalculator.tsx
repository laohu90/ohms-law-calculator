/**
 * Electric Energy Consumption and Tariff Cost Calculator.
 * Styled in FormulaCalcKit signature layout (clean white cards, 12-column split, crisp cards).
 */
import React, { useState } from 'react';
import { AppliancePreset } from '../types/electronics';
import { formatValue } from '../utils/formulas';
import {
  Zap,
  Coins,
  Clock,
  Leaf,
  Sparkles,
  TrendingDown,
  Calendar,
} from 'lucide-react';

const APPLIANCE_PRESETS: AppliancePreset[] = [
  {
    id: 'aircon',
    name: '1.5匹变频冷暖空调',
    category: '大功率厨卫',
    typicalWatts: 1100,
    defaultDailyHours: 8,
    description: '夏季/冬季制冷制热，按变频平均功率折算',
  },
  {
    id: 'kettle',
    name: '大功率电热水壶',
    category: '大功率厨卫',
    typicalWatts: 1800,
    defaultDailyHours: 0.5,
    description: '烧沸一壶水约5分钟，日均使用3-5次',
  },
  {
    id: 'induction',
    name: '家用电磁炉 / 电陶炉',
    category: '大功率厨卫',
    typicalWatts: 2100,
    defaultDailyHours: 1,
    description: '爆炒与煮汤强劲档位',
  },
  {
    id: 'laptop',
    name: '办公笔记本电脑',
    category: '数码办公',
    typicalWatts: 65,
    defaultDailyHours: 8,
    description: 'Type-C PD 充电与办公功耗',
  },
  {
    id: 'phone',
    name: '智能手机快速充电器',
    category: '数码办公',
    typicalWatts: 30,
    defaultDailyHours: 1.5,
    description: '日均充满一次所需总电量',
  },
  {
    id: 'tv',
    name: '55寸 4K 智能电视',
    category: '生活家电',
    typicalWatts: 120,
    defaultDailyHours: 4,
    description: '家庭日常影音娱乐开机功率',
  },
  {
    id: 'fridge',
    name: '双门风冷节能冰箱',
    category: '生活家电',
    typicalWatts: 120,
    defaultDailyHours: 7.2,
    description: '压缩机间歇启停，实际日耗电约 0.85 度',
  },
  {
    id: 'fan',
    name: '直流变频落地风扇',
    category: '照明散热',
    typicalWatts: 35,
    defaultDailyHours: 8,
    description: '低噪舒适风，超级节能',
  },
  {
    id: 'led',
    name: '全屋客厅 LED 吸顶灯',
    category: '照明散热',
    typicalWatts: 48,
    defaultDailyHours: 5,
    description: '高显色节能固态照明',
  },
];

export const EnergyCostCalculator: React.FC<{ lang?: 'zh' | 'en' }> = ({ lang = 'zh' }) => {
  const [watts, setWatts] = useState<number>(1100);
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(30);
  const [tariffRate, setTariffRate] = useState<number>(0.60);

  const safeWatts = Math.max(0, watts || 0);
  const safeHours = Math.min(24, Math.max(0, hoursPerDay || 0));
  const safeDays = Math.min(31, Math.max(0, daysPerMonth || 0));
  const safeTariff = Math.max(0, tariffRate || 0);

  const dailyKWh = (safeWatts * safeHours) / 1000;
  const monthlyKWh = dailyKWh * safeDays;
  const yearlyKWh = dailyKWh * 365;

  const dailyCost = dailyKWh * safeTariff;
  const monthlyCost = monthlyKWh * safeTariff;
  const yearlyCost = yearlyKWh * safeTariff;

  const dailyJoules = dailyKWh * 3.6e6;
  const yearlyCarbonKg = yearlyKWh * 0.585;

  const handleSelectPreset = (p: AppliancePreset) => {
    setWatts(p.typicalWatts);
    setHoursPerDay(p.defaultDailyHours);
  };

  return (
    <section id="energy" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>{lang === 'zh' ? '电能计量 · 阶梯电费精算' : 'ENERGY CONSUMPTION & BILL'}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {lang === 'zh' ? '家用与工业电能消耗与电费精算器' : 'Electricity Energy & Cost Calculator'}
        </h2>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {lang === 'zh'
            ? '基于标准电功公式 W = P · t 与阶梯电价体系，输入用电设备功率与运行时长，一键预估日、月、年用电度数、费用支出及碳排放量。'
            : 'Estimate kilowatt-hours (kWh), daily/monthly/annual bills, and carbon footprint based on equipment wattage and operating duration.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls & Presets (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'zh' ? '用电设备能耗参数设置' : 'Appliance Power Parameters'}
            </h3>
            <span className="text-xs text-blue-700 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              W = P × t
            </span>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs text-slate-600 flex items-center justify-between">
                <span>用电器额定功率 (P)</span>
                <span className="font-mono text-blue-700 font-bold">{watts} W</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={watts}
                  onChange={(e) => setWatts(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
                />
                <span className="inline-flex items-center px-3 rounded-lg bg-slate-100 text-xs font-mono text-slate-700 border border-slate-200">
                  W
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs text-slate-600 flex items-center justify-between">
                <span>每日平均运行时长 (t)</span>
                <span className="font-mono text-sky-700 font-bold">{hoursPerDay} 小时/天</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  max="24"
                  step="0.5"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
                />
                <span className="inline-flex items-center px-3 rounded-lg bg-slate-100 text-xs font-mono text-slate-700 border border-slate-200">
                  h
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs text-slate-600 flex items-center justify-between">
                <span>每月开机天数</span>
                <span className="font-mono text-slate-800 font-semibold">{daysPerMonth} 天/月</span>
              </label>
              <input
                type="number"
                min="1"
                max="31"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(parseInt(e.target.value) || 30)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs text-slate-600 flex items-center justify-between">
                <span>电价单价 (元/度)</span>
                <span className="font-mono text-emerald-700 font-bold">{tariffRate} 元/kWh</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.05"
                  value={tariffRate}
                  onChange={(e) => setTariffRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 font-mono text-base focus:outline-none focus:border-blue-600"
                />
                <span className="inline-flex items-center px-3 rounded-lg bg-slate-100 text-xs font-mono text-slate-700 border border-slate-200">
                  元/度
                </span>
              </div>
            </div>
          </div>

          {/* Quick Tariff Selector */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">快速设置电价标准:</span>
            {[
              { label: '城乡居民第一档 (0.52元)', rate: 0.52 },
              { label: '居民基准电价 (0.60元)', rate: 0.60 },
              { label: '夏季高峰/第二档 (0.68元)', rate: 0.68 },
              { label: '商业用电 (0.95元)', rate: 0.95 },
            ].map((t) => (
              <button
                key={t.label}
                onClick={() => setTariffRate(t.rate)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono cursor-pointer transition-colors ${
                  tariffRate === t.rate
                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Preset Appliances Grid */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>常见用电设备快速匹配（点击即刻代入）</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {APPLIANCE_PRESETS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleSelectPreset(app)}
                  className="text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                    {app.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {app.typicalWatts}W · {app.defaultDailyHours}h/天
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Metrics (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">用电量与电费预算报表</h3>
              </div>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                实时计算
              </span>
            </div>

            <div className="space-y-3">
              {/* Daily */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>每日电能与电费</span>
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    耗电: <strong className="text-slate-900 font-bold">{formatValue(dailyKWh, 3)}</strong> 度 (kWh)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-slate-900">
                    ¥{formatValue(dailyCost, 2)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">元/天</div>
                </div>
              </div>

              {/* Monthly */}
              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 ring-2 ring-blue-50 flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-900 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>每月总用电与电费 (按{daysPerMonth}天)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-700 mt-1">
                    耗电: <strong className="text-blue-900 text-sm font-bold">{formatValue(monthlyKWh, 2)}</strong> 度
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-extrabold text-blue-700">
                    ¥{formatValue(monthlyCost, 2)}
                  </div>
                  <div className="text-[11px] text-slate-600 font-mono">元/月</div>
                </div>
              </div>

              {/* Yearly */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5 text-rose-600" />
                    <span>全年累计 (按365天)</span>
                  </div>
                  <div className="text-xs font-mono text-slate-600 mt-1">
                    耗电: <strong className="text-slate-900 font-bold">{formatValue(yearlyKWh, 1)}</strong> 度
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-emerald-700">
                    ¥{formatValue(yearlyCost, 1)}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">元/年</div>
                </div>
              </div>
            </div>

            {/* Joules and Carbon Footprint */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  日均物理焦耳能量:
                </span>
                <span className="font-mono text-slate-900 font-bold">
                  {dailyJoules >= 1e6
                    ? `${(dailyJoules / 1e6).toFixed(2)} 兆焦 (MJ)`
                    : `${(dailyJoules / 1000).toFixed(1)} kJ`}
                </span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  年碳排放等效折算:
                </span>
                <span className="font-mono text-emerald-700 font-bold">
                  ≈ {formatValue(yearlyCarbonKg, 1)} kg CO₂
                </span>
              </div>
            </div>
          </div>

          {/* Energy Saving Tips */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                节能降耗实用建议
              </h4>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong>待机功耗排查</strong>: 电视盒子、音响待机通常消耗 3W~10W，长期插电一年可浪费 25~80 度电。
              </li>
              <li>
                <strong>空调温度黄金法则</strong>: 夏季空调设定 26℃ 为人体最舒适且经济节能平衡点，每调高 1℃ 可节电 7%~10%。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
