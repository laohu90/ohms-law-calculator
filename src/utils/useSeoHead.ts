/**
 * Dynamic SEO Head Manager for Google Indexing & Multi-Language Optimization.
 * Automatically synchronizes document title, description, keywords, and html lang tag.
 */
import { useEffect } from 'react';

interface SeoProps {
  lang: 'zh' | 'en';
  activeTab: string;
}

const SEO_CONFIG: Record<
  string,
  {
    titleZh: string;
    titleEn: string;
    descZh: string;
    descEn: string;
    keywordsZh: string;
    keywordsEn: string;
  }
> = {
  calculator: {
    titleZh: '欧姆定律与电功率计算器 | 伏特·安培·欧姆·瓦特四合一推导 - FormulaCalcKit',
    titleEn: "Ohm's Law & Electric Power Calculator | Watts, Volts, Amps & Ohms - FormulaCalcKit",
    descZh:
      '专业免费在线欧姆定律计算器。输入电压(U)、电流(I)、电阻(R)、功率(P)任意两项，秒算其余所有参数并提供分步代数解法与安全导线规格。',
    descEn:
      "Free online Ohm's Law and Electric Power calculator. Enter any 2 quantities (V, I, R, P) to calculate all unknowns with step-by-step algebra and wire sizing.",
    keywordsZh:
      '欧姆定律计算器,电功率计算器,电压电流电阻功率换算,瓦特安培伏特换算,P=UI计算器,U=IR计算公式,电阻计算,电学在线计算',
    keywordsEn:
      "Ohm's law calculator, electric power calculator, watts to amps, volts to watts, resistance calculator, P=VI solver, V=IR calculator, electrical formulas",
  },
  circuit: {
    titleZh: '串联与并联电路计算器 | 分压分流仿真与等效电阻推导 - FormulaCalcKit',
    titleEn: 'Series and Parallel Circuit Calculator | Voltage Divider Simulator - FormulaCalcKit',
    descZh:
      '在线串联与并联电路仿真计算器。实时求解等效总电阻、回路总电流、各电阻分压分流比与热功率分配，支持电阻过载告警。',
    descEn:
      'Online series and parallel resistor circuit calculator. Solve equivalent resistance, total current, voltage divider ratios, and component power dissipation.',
    keywordsZh:
      '串联电路计算器,并联电路计算器,等效电阻计算,分压电路计算器,分流公式,并联电阻计算公式,基尔霍夫电路仿真',
    keywordsEn:
      'series circuit calculator, parallel resistor calculator, equivalent resistance calculator, voltage divider calculator, current divider, circuit solver',
  },
  resistor: {
    titleZh: '色环电阻阻值计算器 | 4环/5环色标速查与反向查阻值 - FormulaCalcKit',
    titleEn: 'Resistor Color Code Calculator | 4-Band & 5-Band Color Chart - FormulaCalcKit',
    descZh:
      '专业 4 环与 5 环色环电阻阻值在线计算器。直观选色实时得出标称阻值与精度公差范围；支持输入阻值反向推荐标准色环排布。',
    descEn:
      'Decode 4-band and 5-band resistor color codes instantly. Visual color band selector, tolerance range calculation, and reverse value-to-color lookup.',
    keywordsZh:
      '色环电阻计算器,四环电阻计算器,五环电阻计算器,电阻色环表口诀,色标电阻阻值表,贴片电阻换算',
    keywordsEn:
      'resistor color code calculator, 4 band resistor calculator, 5 band resistor color chart, resistance decoder, resistor color code lookup',
  },
  energy: {
    titleZh: '用电度数与电费计算器 | 家用电器功率耗电核算 (kWh) - FormulaCalcKit',
    titleEn: 'Electricity Cost & Power Consumption Calculator (kWh) - FormulaCalcKit',
    descZh:
      '精准计算家用电器与工程设备用电量(kWh度数)及阶梯电费支出。内置空调、电热水壶、电脑等典型电器功率预设与节能减排分析。',
    descEn:
      'Calculate electrical energy consumption in kilowatt-hours (kWh) and electricity bills. Built-in presets for air conditioning, heaters, appliances, and carbon impact.',
    keywordsZh:
      '电费计算器,用电度数计算,千瓦时换算,电器耗电量核算,阶梯电价计算器,瓦特换算千瓦度数',
    keywordsEn:
      'electricity cost calculator, energy consumption calculator, kWh calculator, appliance power usage, electric bill estimator, watts to kWh',
  },
  tutorial: {
    titleZh: '电学物理核心教程与常用物质电阻率表 - FormulaCalcKit',
    titleEn: 'Electrical Physics Tutorial, Quiz & Material Resistivity Chart - FormulaCalcKit',
    descZh:
      '系统化电学物理核心概念教程与 60+ 种常见导体、合金、半导体与绝缘体电阻率参考表，附经典物理易错题库。',
    descEn:
      'Comprehensive physics tutorial on Ohm’s law, non-linear components, power transmission, and standard 20°C resistivity values for 60+ materials.',
    keywordsZh:
      '电阻率对照表,铜铝电阻率,电学教程,欧姆定律实验题库,纯电阻与非纯电阻区别,最大功率传输定理',
    keywordsEn:
      'material resistivity table, copper resistivity, physics electrical tutorial, Ohm law quiz, non-linear circuit physics, maximum power transfer theorem',
  },
};

export function useSeoHead({ lang, activeTab }: SeoProps) {
  useEffect(() => {
    const config = SEO_CONFIG[activeTab] || SEO_CONFIG.calculator;
    const title = lang === 'zh' ? config.titleZh : config.titleEn;
    const desc = lang === 'zh' ? config.descZh : config.descEn;
    const keywords = lang === 'zh' ? config.keywordsZh : config.keywordsEn;

    // Update document title
    document.title = title;

    // Update html lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // Update meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    // Update meta keywords
    let metaKeywords = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    // Update OpenGraph Title & Description
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = desc;

    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.content = title;

    const twitterDesc = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.content = desc;
  }, [lang, activeTab]);
}
