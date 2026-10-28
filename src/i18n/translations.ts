export type Language = 'en' | 'zh' | 'es' | 'fr' | 'pt';

export interface TranslationSchema {
  // Brand & Nav
  appName: string;
  appDesc: string;
  mainCalcNav: string;
  colorCodeNav: string;
  voltageDividerNav: string;
  powerCostNav: string;
  ledResistorNav: string;
  precisionBtn: string;
  shareBtn: string;
  
  // Targets
  targetLabel: string;
  targetSub: string;
  current: string;
  voltage: string;
  resistance: string;
  power: string;
  unknownTarget: string;

  // Input & Form
  inputSectionTitle: string;
  resetBtn: string;
  voltageLabel: string;
  currentLabel: string;
  resistanceLabel: string;
  powerLabel: string;
  siEquivalent: string;
  invalidErrorTitle: string;
  invalidErrorDesc: string;

  // Circuit Diagram
  circuitTitle: string;
  switchOn: string;
  switchOff: string;
  openCircuit: string;
  circuitUnavail: string;
  circuitUnavailSub: string;
  powerDissipation: string;
  batteryU: string;
  resistorR: string;
  ammeterI: string;

  // Formula Wheel
  formulaWheelTitle: string;
  formulaWheelSub: string;
  applyTargetBtn: string;
  wheelCenter: string;
  targetSelected: string;

  // Expression Parser
  parserTitle: string;
  parserSub: string;
  presetLabel: string;
  parserPlaceholder: string;
  syncToCalcBtn: string;
  parsedResultLabel: string;
  parserError: string;

  // Solution Steps
  stepsTitle: string;
  copyStepsBtn: string;
  copiedStepsBtn: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  step4Title: string;
  stepKnown: string;
  stepResult: string;

  // Reverse Verification
  verificationTitle: string;
  verificationPass: string;
  verificationFail: string;
  verificationDesc: string;
  path1Label: string;
  path2Label: string;
  path3Label: string;
  maxResidualLabel: string;

  // History
  historyTitle: string;
  historyCount: string;
  exportCSV: string;
  exportJSON: string;
  clearHistory: string;
  noHistory: string;
  inputsPrefix: string;
  outputsPrefix: string;

  // Precision Settings
  precisionTitle: string;
  precisionModeLabel: string;
  decimalMode: string;
  sigFigMode: string;
  decimalPlacesLabel: string;
  sigFigsLabel: string;
  scientificNotation: string;
  thousandsSeparator: string;
  applyPrecisionBtn: string;

  // Share Modal
  shareTitle: string;
  shareDesc: string;
  copyLinkBtn: string;
  copiedLinkBtn: string;

  // Related Tools Section
  relatedToolsTitle: string;
  relatedToolsSub: string;
  backToMainCalc: string;
  usingToolNotice: string;
  colorCodeTitle: string;
  colorCodeDesc: string;
  voltageDividerTitle: string;
  voltageDividerDesc: string;
  powerCostTitle: string;
  powerCostDesc: string;
  ledResistorTitle: string;
  ledResistorDesc: string;

  // Color Code Tool
  color4Band: string;
  color5Band: string;
  band1Label: string;
  band2Label: string;
  band3Label: string;
  multiplierLabel: string;
  toleranceLabel: string;

  // Voltage Divider Tool
  vInLabel: string;
  r1Label: string;
  r2Label: string;
  vOutResult: string;
  throughCurrentResult: string;
  totalPowerResult: string;

  // Power Cost Tool
  appliancePowerLabel: string;
  dailyHoursLabel: string;
  tariffLabel: string;
  dailyKwh: string;
  monthlyKwh: string;
  dailyCost: string;
  monthlyCost: string;

  // LED Resistor Tool
  supplyVLabel: string;
  ledDropVLabel: string;
  ledCurrentLabel: string;
  recommendedR: string;
  resistorPowerRating: string;

  // Footer
  footerText: string;
}

export const LANGUAGES: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '中文 (简体)', flag: '🇨🇳' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  pt: { name: 'Português', flag: '🇵🇹' },
};

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  en: {
    appName: "Ohm's Law Universal Calculator",
    appDesc: "Professional Ohm's Law and electric power calculator with interactive circuit visualization, step-by-step formula breakdown, precision unit converter, and reverse self-consistency verification.",
    mainCalcNav: "Main Calculator",
    colorCodeNav: "Resistor Color Code",
    voltageDividerNav: "Voltage Divider",
    powerCostNav: "Energy Cost",
    ledResistorNav: "LED Resistor",
    precisionBtn: "Precision",
    shareBtn: "Share Link",

    targetLabel: "SELECT TARGET PARAMETER TO SOLVE",
    targetSub: "Select unknown parameter to solve based on any two known electrical values",
    current: "I (Current)",
    voltage: "U (Voltage)",
    resistance: "R (Resistance)",
    power: "P (Power)",
    unknownTarget: "Target",

    inputSectionTitle: "Parameters & Units",
    resetBtn: "Reset",
    voltageLabel: "Voltage U",
    currentLabel: "Current I",
    resistanceLabel: "Resistance R",
    powerLabel: "Power P",
    siEquivalent: "SI Base",
    invalidErrorTitle: "Division by Zero / Invalid Parameter",
    invalidErrorDesc: "In standard DC electrical calculations, Voltage (U), Current (I), Resistance (R), and Power (P) must be positive values (> 0).",

    circuitTitle: "DC Circuit Visualization",
    switchOn: "Switch: CLOSED (ON)",
    switchOff: "Switch: OPEN (OFF)",
    openCircuit: "0 A (Open Circuit)",
    circuitUnavail: "Circuit Diagram Unavailable",
    circuitUnavailSub: "Please enter valid positive electrical parameters to generate real-time circuit schematic.",
    powerDissipation: "Dissipating Power",
    batteryU: "Supply Voltage U",
    resistorR: "Load Resistance R",
    ammeterI: "Circuit Current I",

    formulaWheelTitle: "Ohm's Law Formula Wheel",
    formulaWheelSub: "Click any formula sector to select target parameter and derivation",
    applyTargetBtn: "Apply This Target",
    wheelCenter: "Ohm's Law",
    targetSelected: "Target",

    parserTitle: "Free Expression & Formula Parser",
    parserSub: "Supports natural formulas with units (e.g., 12V / 0.4ohm)",
    presetLabel: "Quick Presets:",
    parserPlaceholder: "e.g., 12V / 400mOhm or sqrt(100W * 50ohm)",
    syncToCalcBtn: "Load into Main Calculator",
    parsedResultLabel: "Evaluated Result:",
    parserError: "Syntax error or invalid expression. Check units (+, -, *, /, ^, sqrt)",

    stepsTitle: "Formula Substitution & Step Breakdown",
    copyStepsBtn: "Copy Steps",
    copiedStepsBtn: "Copied!",
    step1Title: "Step 1: Known Extraction & SI Normalization",
    step2Title: "Step 2: Primary Formula Substitution",
    step3Title: "Step 3: Power & Related Metrics",
    step4Title: "Step 4: Reverse Verification Check",
    stepKnown: "Known Values",
    stepResult: "Intermediate Result",

    verificationTitle: "Physical Self-Consistency Verification",
    verificationPass: "Verification 100% Passed",
    verificationFail: "Floating-point Residual Detected",
    verificationDesc: "Cross-checks results against three independent physical laws: P = U·I, P = I²·R, and P = U²/R.",
    path1Label: "Path 1: P = U × I",
    path2Label: "Path 2: P = I² × R",
    path3Label: "Path 3: P = U² / R",
    maxResidualLabel: "Max Residual Delta (Δ):",

    historyTitle: "Calculation History",
    historyCount: "records",
    exportCSV: "Export CSV",
    exportJSON: "Export JSON",
    clearHistory: "Clear All",
    noHistory: "No history yet. Your calculations will be saved here automatically.",
    inputsPrefix: "Inputs:",
    outputsPrefix: "Results:",

    precisionTitle: "Precision & Formatting Settings",
    precisionModeLabel: "Precision Mode",
    decimalMode: "Decimal Places",
    sigFigMode: "Significant Figures",
    decimalPlacesLabel: "Decimal Places (0 - 12)",
    sigFigsLabel: "Significant Figures (1 - 12)",
    scientificNotation: "Force Scientific Notation (1.23e+3)",
    thousandsSeparator: "Use Thousands Separators (1,234.56)",
    applyPrecisionBtn: "Apply Settings",

    shareTitle: "Share Calculation Parameters",
    shareDesc: "This URL encodes your current inputs, units, and precision settings so colleagues can open the exact context.",
    copyLinkBtn: "Copy Link",
    copiedLinkBtn: "Link Copied!",

    relatedToolsTitle: "Related Electrical Engineering Tools",
    relatedToolsSub: "Core utilities for circuit design and hardware testing",
    backToMainCalc: "Back to Main Calculator",
    usingToolNotice: "You are currently using an extended electrical tool. Switch back anytime.",
    colorCodeTitle: "Resistor Color Code",
    colorCodeDesc: "Decode 4-band and 5-band standard and precision resistors",
    voltageDividerTitle: "Voltage Divider",
    voltageDividerDesc: "Calculate V_out bias voltage and current",
    powerCostTitle: "Power & Energy Cost",
    powerCostDesc: "Estimate daily/monthly kWh consumption and cost",
    ledResistorTitle: "LED Series Resistor",
    ledResistorDesc: "Calculate LED current-limiting protection resistor and rating",

    color4Band: "4-Band Resistor",
    color5Band: "5-Band Precision",
    band1Label: "Band 1 (1st Digit)",
    band2Label: "Band 2 (2nd Digit)",
    band3Label: "Band 3 (3rd Digit)",
    multiplierLabel: "Multiplier",
    toleranceLabel: "Tolerance",

    vInLabel: "Input Voltage V_in (V)",
    r1Label: "Upper Resistor R1 (Ω)",
    r2Label: "Lower Resistor R2 (Ω)",
    vOutResult: "Output Voltage V_out",
    throughCurrentResult: "Divider Current I",
    totalPowerResult: "Total Power P",

    appliancePowerLabel: "Appliance Power (P)",
    dailyHoursLabel: "Operating Hours (Hours/Day)",
    tariffLabel: "Electricity Tariff (Cost/kWh)",
    dailyKwh: "Daily Energy",
    monthlyKwh: "Monthly Energy (30 Days)",
    dailyCost: "Est. Daily Cost",
    monthlyCost: "Est. Monthly Cost",

    supplyVLabel: "Supply Voltage V_s (V)",
    ledDropVLabel: "LED Forward Drop V_f (V)",
    ledCurrentLabel: "LED Rated Current I_f (mA)",
    recommendedR: "Limiting Resistor R",
    resistorPowerRating: "Resistor Power Rating",

    footerText: "Ohm's Law Universal Calculator · Integrated Circuit Visualization & Physical Self-Consistency Engine",
  },

  zh: {
    appName: "欧姆定律全能计算器",
    appDesc: "专业级欧姆定律与电学计算工具，集成电路图动态可视化、分步公式推导、高精度单位换算、反算自洽校验及扩展工程小工具。",
    mainCalcNav: "主欧姆计算器",
    colorCodeNav: "色环电阻算查",
    voltageDividerNav: "电阻分压计算",
    powerCostNav: "用电功率与电费",
    ledResistorNav: "LED 限流电阻",
    precisionBtn: "精度设置",
    shareBtn: "分享链接",

    targetLabel: "选择待求解的未知参数",
    targetSub: "根据已知两个变量，自动求解其余电学物理量",
    current: "I (电流)",
    voltage: "U (电压)",
    resistance: "R (电阻)",
    power: "P (功率)",
    unknownTarget: "求解目标",

    inputSectionTitle: "参数输入与单位规范",
    resetBtn: "重置",
    voltageLabel: "电压 U (Voltage)",
    currentLabel: "电流 I (Current)",
    resistanceLabel: "电阻 R (Resistance)",
    powerLabel: "电功率 P (Power)",
    siEquivalent: "SI基准",
    invalidErrorTitle: "除零 / 参数无效",
    invalidErrorDesc: "在标准直流电学计算中，电压(U)、电流(I)、电阻(R)和功率(P)均为大于 0 的正数物理量。",

    circuitTitle: "直流电路动态可视化",
    switchOn: "开关：闭合 (ON)",
    switchOff: "开关：断开 (OFF)",
    openCircuit: "0 A (断路)",
    circuitUnavail: "电路图不可用",
    circuitUnavailSub: "请输入大于 0 的有效物理数值，系统将为您生成实时交互式电路示意图。",
    powerDissipation: "回路功耗 (Power P)",
    batteryU: "电源电压 U",
    resistorR: "负载电阻 R",
    ammeterI: "回路电流 I",

    formulaWheelTitle: "欧姆定律经典公式轮盘",
    formulaWheelSub: "点击轮盘扇区可快速定相推导与切换求解目标",
    applyTargetBtn: "应用此目标",
    wheelCenter: "欧姆定律",
    targetSelected: "目标",

    parserTitle: "算式与电学公式自由解析输入框",
    parserSub: "支持带单位与自然表达的算式（如 12V / 0.4ohm）",
    presetLabel: "预置快捷算式:",
    parserPlaceholder: "例如: 12V / 400mΩ 或 sqrt(100W * 50ohm)",
    syncToCalcBtn: "同步载入到主计算器",
    parsedResultLabel: "算式求值结果:",
    parserError: "解析失败，请检查表达式格式（支持 +, -, *, /, ^, sqrt 与单位）",

    stepsTitle: "公式推导与详细解题步骤",
    copyStepsBtn: "复制过程",
    copiedStepsBtn: "已复制推导",
    step1Title: "步骤 1：单位换算与已知量提取",
    step2Title: "步骤 2：核心公式代入与计算",
    step3Title: "步骤 3：功耗与等效参量推导",
    step4Title: "步骤 4：反算自洽校验（物理定理互检）",
    stepKnown: "已知变量",
    stepResult: "阶段结果",

    verificationTitle: "物理反算与自洽性校验",
    verificationPass: "自洽校验：100% 通过",
    verificationFail: "发现微小残差浮点偏差",
    verificationDesc: "将计算结果回代至 P = U·I、P = I²·R、P = U²/R 三条独立物理路径，验证物理自洽性。",
    path1Label: "路径 1: P = U × I",
    path2Label: "路径 2: P = I² × R",
    path3Label: "路径 3: P = U² / R",
    maxResidualLabel: "最大反算残差 (Max Residual Δ):",

    historyTitle: "计算历史记录",
    historyCount: "条记录",
    exportCSV: "导出 CSV",
    exportJSON: "导出 JSON",
    clearHistory: "清空",
    noHistory: "暂无计算历史记录。进行计算后，结果将自动保存在此处。",
    inputsPrefix: "输入:",
    outputsPrefix: "得出:",

    precisionTitle: "自定义计算精度与格式",
    precisionModeLabel: "精度模式",
    decimalMode: "保留小数位数",
    sigFigMode: "保留有效数字",
    decimalPlacesLabel: "小数位数 (0 ~ 12 位)",
    sigFigsLabel: "有效数字 (1 ~ 12 位)",
    scientificNotation: "强制使用科学计数法 (1.23e+3)",
    thousandsSeparator: "添加千位分隔符 (1,234.56)",
    applyPrecisionBtn: "确定应用",

    shareTitle: "分享当前计算参数链接",
    shareDesc: "该链接已将您当前的输入数值、单位及精度模式编码至 URL 参数中。同事打开后可直接复原相同的计算上下文。",
    copyLinkBtn: "复制链接",
    copiedLinkBtn: "已复制",

    relatedToolsTitle: "常用扩展电学工程小工具",
    relatedToolsSub: "专为硬件研发与维修精简保留 4 项核心工具",
    backToMainCalc: "返回主欧姆计算器",
    usingToolNotice: "当前正在使用扩展电学小工具，随时可切换回主欧姆计算器。",
    colorCodeTitle: "色环电阻算查识别器",
    colorCodeDesc: "4色环/5色环标准与精密阻值一键识别",
    voltageDividerTitle: "电阻串联分压计算器",
    voltageDividerDesc: "计算 V_out 分压偏置及回路微安贯穿电流",
    powerCostTitle: "用电功率与电费计算器",
    powerCostDesc: "根据设备功率评估每日/每月度数与电费金额",
    ledResistorTitle: "LED 限流保护电阻计算器",
    ledResistorDesc: "精确推导发光二极管降压串联限流电阻及功率",

    color4Band: "4 色环电阻",
    color5Band: "5 色环精密电阻",
    band1Label: "环 1 (第一有效数字)",
    band2Label: "环 2 (第二有效数字)",
    band3Label: "环 3 (第三有效数字)",
    multiplierLabel: "倍率乘数 (Multiplier)",
    toleranceLabel: "容差 (Tolerance)",

    vInLabel: "输入电压 V_in (V)",
    r1Label: "上偏置电阻 R1 (Ω)",
    r2Label: "下偏置电阻 R2 (Ω)",
    vOutResult: "输出分压 V_out",
    throughCurrentResult: "回路贯穿电流 I",
    totalPowerResult: "电路总功率 P",

    appliancePowerLabel: "用电设备功率 (P)",
    dailyHoursLabel: "每日运行时间 (小时/天)",
    tariffLabel: "电价单价 (元 / kWh 度)",
    dailyKwh: "每日耗电量",
    monthlyKwh: "每月耗电量 (30天)",
    dailyCost: "预估日电费",
    monthlyCost: "预估月电费",

    supplyVLabel: "电源电压 V_s (V)",
    ledDropVLabel: "LED 正向压降 V_f (V)",
    ledCurrentLabel: "LED 额定工作电流 I_f (mA)",
    recommendedR: "推荐限流电阻 R",
    resistorPowerRating: "电阻额定功率要求",

    footerText: "欧姆定律全能计算器 · 集成电路图动态可视化与物理反算自洽校验系统",
  },

  es: {
    appName: "Calculadora Universal de Ley de Ohm",
    appDesc: "Calculadora profesional de la Ley de Ohm y potencia eléctrica con visualización interactiva de circuitos, desglose paso a paso y verificación de autoconsistencia.",
    mainCalcNav: "Calculadora Principal",
    colorCodeNav: "Código de Colores",
    voltageDividerNav: "Divisor de Tensión",
    powerCostNav: "Costo de Energía",
    ledResistorNav: "Resistencia LED",
    precisionBtn: "Precisión",
    shareBtn: "Compartir",

    targetLabel: "SELECCIONE EL PARÁMETRO A CALCULAR",
    targetSub: "Calcule cualquier incógnita a partir de dos valores eléctricos conocidos",
    current: "I (Corriente)",
    voltage: "U (Voltaje)",
    resistance: "R (Resistencia)",
    power: "P (Potencia)",
    unknownTarget: "Objetivo",

    inputSectionTitle: "Parámetros y Unidades",
    resetBtn: "Reiniciar",
    voltageLabel: "Voltaje U",
    currentLabel: "Corriente I",
    resistanceLabel: "Resistencia R",
    powerLabel: "Potencia P",
    siEquivalent: "Base SI",
    invalidErrorTitle: "División por Cero / Parámetro Inválido",
    invalidErrorDesc: "En cálculos de CC estándar, Voltaje (U), Corriente (I), Resistencia (R) y Potencia (P) deben ser números positivos (> 0).",

    circuitTitle: "Visualización Dinámica de Circuito CC",
    switchOn: "Interruptor: CERRADO (ON)",
    switchOff: "Interruptor: ABIERTO (OFF)",
    openCircuit: "0 A (Circuito Abierto)",
    circuitUnavail: "Esquema no disponible",
    circuitUnavailSub: "Ingrese valores positivos para generar el diagrama esquemático interactivo.",
    powerDissipation: "Potencia Disipada",
    batteryU: "Voltaje de Fuente U",
    resistorR: "Resistencia de Carga R",
    ammeterI: "Corriente de Circuito I",

    formulaWheelTitle: "Rueda de Fórmulas de Ley de Ohm",
    formulaWheelSub: "Haga clic en un sector para seleccionar la fórmula y el objetivo",
    applyTargetBtn: "Aplicar Objetivo",
    wheelCenter: "Ley de Ohm",
    targetSelected: "Objetivo",

    parserTitle: "Analizador Libre de Expresiones y Fórmulas",
    parserSub: "Soporta expresiones naturales con unidades (ej. 12V / 0.4ohm)",
    presetLabel: "Preajustes Rápido:",
    parserPlaceholder: "ej. 12V / 400mOhm o sqrt(100W * 50ohm)",
    syncToCalcBtn: "Cargar en Calculadora Principal",
    parsedResultLabel: "Resultado Calculado:",
    parserError: "Error de sintaxis. Verifique unidades (+, -, *, /, ^, sqrt)",

    stepsTitle: "Sustitución de Fórmulas y Pasos Detallados",
    copyStepsBtn: "Copiar Pasos",
    copiedStepsBtn: "¡Copiado!",
    step1Title: "Paso 1: Normalización de Unidades SI",
    step2Title: "Paso 2: Sustitución en Fórmula Principal",
    step3Title: "Paso 3: Cálculo de Potencia y Métricas",
    step4Title: "Paso 4: Verificación de Autoconsistencia",
    stepKnown: "Valores Conocidos",
    stepResult: "Resultado Intermedio",

    verificationTitle: "Verificación Física de Autoconsistencia",
    verificationPass: "Verificación 100% Exitosa",
    verificationFail: "Residuo de Punto Flotante Detectado",
    verificationDesc: "Comprueba los resultados con tres leyes físicas independientes: P = U·I, P = I²·R y P = U²/R.",
    path1Label: "Ruta 1: P = U × I",
    path2Label: "Ruta 2: P = I² × R",
    path3Label: "Ruta 3: P = U² / R",
    maxResidualLabel: "Delta Residual Máximo (Δ):",

    historyTitle: "Historial de Cálculos",
    historyCount: "registros",
    exportCSV: "Exportar CSV",
    exportJSON: "Exportar JSON",
    clearHistory: "Borrar Todo",
    noHistory: "Sin historial aún. Los cálculos se guardarán automáticamente aquí.",
    inputsPrefix: "Entradas:",
    outputsPrefix: "Resultados:",

    precisionTitle: "Ajustes de Precisión y Formato",
    precisionModeLabel: "Modo de Precisión",
    decimalMode: "Decimales",
    sigFigMode: "Cifras Significativas",
    decimalPlacesLabel: "Lugares Decimales (0 - 12)",
    sigFigsLabel: "Cifras Significativas (1 - 12)",
    scientificNotation: "Forzar Notación Científica (1.23e+3)",
    thousandsSeparator: "Usar Separador de Miles (1,234.56)",
    applyPrecisionBtn: "Aplicar Ajustes",

    shareTitle: "Compartir Parámetros de Cálculo",
    shareDesc: "Esta URL codifica las entradas y unidades actuales para que sus colegas abran exactamente el mismo contexto.",
    copyLinkBtn: "Copiar Enlace",
    copiedLinkBtn: "¡Copiado!",

    relatedToolsTitle: "Herramientas de Ingeniería Eléctrica",
    relatedToolsSub: "Utilidades esenciales para diseño y pruebas de circuitos",
    backToMainCalc: "Volver a Calculadora Principal",
    usingToolNotice: "Está utilizando una herramienta extendida. Puede volver cuando desee.",
    colorCodeTitle: "Código de Colores de Resistencia",
    colorCodeDesc: "Decodifique resistencias de 4 y 5 bandas de precisión",
    voltageDividerTitle: "Divisor de Tensión",
    voltageDividerDesc: "Calcule el voltaje de salida V_out y corriente",
    powerCostTitle: "Consumo y Costo de Energía",
    powerCostDesc: "Estime el consumo diario/mensual en kWh y el costo",
    ledResistorTitle: "Resistencia para LED",
    ledResistorDesc: "Calcule la resistencia de protección para LED y su potencia",

    color4Band: "Resistencia de 4 Bandas",
    color5Band: "Precisión de 5 Bandas",
    band1Label: "Banda 1 (1er Dígito)",
    band2Label: "Banda 2 (2do Dígito)",
    band3Label: "Banda 3 (3er Dígito)",
    multiplierLabel: "Multiplicador",
    toleranceLabel: "Tolerancia",

    vInLabel: "Voltaje de Entrada V_in (V)",
    r1Label: "Resistencia Superior R1 (Ω)",
    r2Label: "Resistencia Inferior R2 (Ω)",
    vOutResult: "Voltaje de Salida V_out",
    throughCurrentResult: "Corriente de Circuito I",
    totalPowerResult: "Potencia Total P",

    appliancePowerLabel: "Potencia del Dispositivo (P)",
    dailyHoursLabel: "Horas de Uso (Horas/Día)",
    tariffLabel: "Tarifa Eléctrica (Costo/kWh)",
    dailyKwh: "Energía Diaria",
    monthlyKwh: "Energía Mensual (30 Días)",
    dailyCost: "Costo Diario Est.",
    monthlyCost: "Costo Mensual Est.",

    supplyVLabel: "Voltaje de Fuente V_s (V)",
    ledDropVLabel: "Caída de Voltaje LED V_f (V)",
    ledCurrentLabel: "Corriente Nominal LED I_f (mA)",
    recommendedR: "Resistencia Limitadora R",
    resistorPowerRating: "Potencia Requerida para Resistencia",

    footerText: "Calculadora Universal de Ley de Ohm · Visualización de Circuitos y Verificación Física",
  },

  fr: {
    appName: "Calculateur Universel de la Loi d'Ohm",
    appDesc: "Calculateur professionnel de la loi d'Ohm et de la puissance électrique avec visualisation interactive du circuit et vérification d'auto-cohérence.",
    mainCalcNav: "Calculateur Principal",
    colorCodeNav: "Code Couleur",
    voltageDividerNav: "Diviseur de Tension",
    powerCostNav: "Coût Énergétique",
    ledResistorNav: "Résistance LED",
    precisionBtn: "Précision",
    shareBtn: "Partager",

    targetLabel: "SÉLECTIONNEZ LE PARAMÈTRE À RÉSOUDRE",
    targetSub: "Calculez la valeur inconnue à partir de deux grandeurs électriques connues",
    current: "I (Courant)",
    voltage: "U (Tension)",
    resistance: "R (Résistance)",
    power: "P (Puissance)",
    unknownTarget: "Cible",

    inputSectionTitle: "Paramètres et Unités",
    resetBtn: "Réinitialiser",
    voltageLabel: "Tension U",
    currentLabel: "Courant I",
    resistanceLabel: "Résistance R",
    powerLabel: "Puissance P",
    siEquivalent: "Base SI",
    invalidErrorTitle: "Division par Zéro / Paramètre Invalide",
    invalidErrorDesc: "En calculs CC standards, la Tension (U), le Courant (I), la Résistance (R) et la Puissance (P) doivent être strictement positifs (> 0).",

    circuitTitle: "Visualisation Dynamique de Circuit CC",
    switchOn: "Interrupteur: FERMÉ (ON)",
    switchOff: "Interrupteur: OUVERT (OFF)",
    openCircuit: "0 A (Circuit Ouvert)",
    circuitUnavail: "Schéma Indisponible",
    circuitUnavailSub: "Veuillez saisir des valeurs positives pour générer le schéma interactif.",
    powerDissipation: "Puissance Dissipée",
    batteryU: "Tension d'Alimentation U",
    resistorR: "Résistance de Charge R",
    ammeterI: "Courant du Circuit I",

    formulaWheelTitle: "Roue des Formules de la Loi d'Ohm",
    formulaWheelSub: "Cliquez sur un secteur pour sélectionner la formule et l'objectif",
    applyTargetBtn: "Appliquer cet Objectif",
    wheelCenter: "Loi d'Ohm",
    targetSelected: "Cible",

    parserTitle: "Analyseur Libre d'Expressions et Formules",
    parserSub: "Prend en charge les expressions avec unités (ex. 12V / 0.4ohm)",
    presetLabel: "Préréglages Rapides:",
    parserPlaceholder: "ex. 12V / 400mOhm ou sqrt(100W * 50ohm)",
    syncToCalcBtn: "Charger dans le Calculateur Principal",
    parsedResultLabel: "Résultat Calculé:",
    parserError: "Erreur de syntaxe. Vérifiez les unités (+, -, *, /, ^, sqrt)",

    stepsTitle: "Substitution de Formule et Étapes Détallées",
    copyStepsBtn: "Copier les Étapes",
    copiedStepsBtn: "Copié !",
    step1Title: "Étape 1: Normalisation en Unités SI",
    step2Title: "Étape 2: Substitution dans la Formule",
    step3Title: "Étape 3: Calcul de Puissance et Métriques",
    step4Title: "Étape 4: Vérification d'Auto-cohérence",
    stepKnown: "Valeurs Connues",
    stepResult: "Résultat Intermédiaire",

    verificationTitle: "Vérification Physique d'Auto-cohérence",
    verificationPass: "Vérification 100% Validée",
    verificationFail: "Résidu en Point Flottant Détecté",
    verificationDesc: "Vérifie les résultats par rapport à trois lois physiques indépendantes: P = U·I, P = I²·R et P = U²/R.",
    path1Label: "Voie 1: P = U × I",
    path2Label: "Voie 2: P = I² × R",
    path3Label: "Voie 3: P = U² / R",
    maxResidualLabel: "Delta Résiduel Max (Δ):",

    historyTitle: "Historique des Calculs",
    historyCount: "enregistrements",
    exportCSV: "Exporter CSV",
    exportJSON: "Exporter JSON",
    clearHistory: "Tout Effacer",
    noHistory: "Aucun historique. Vos calculs seront automatiquement enregistrés ici.",
    inputsPrefix: "Entrées:",
    outputsPrefix: "Résultats:",

    precisionTitle: "Réglages de Précision et Format",
    precisionModeLabel: "Mode de Précision",
    decimalMode: "Décimales",
    sigFigMode: "Chiffres Significatifs",
    decimalPlacesLabel: "Nombre de Décimales (0 - 12)",
    sigFigsLabel: "Chiffres Significatifs (1 - 12)",
    scientificNotation: "Notation Scientifique (1.23e+3)",
    thousandsSeparator: "Séparateur de Milliers (1,234.56)",
    applyPrecisionBtn: "Appliquer les Réglages",

    shareTitle: "Partager les Paramètres de Calcul",
    shareDesc: "Cette URL encode vos réglages et valeurs actuels afin que vos collègues ouvrent exactement le même contexte.",
    copyLinkBtn: "Copier le Lien",
    copiedLinkBtn: "Lien Copié !",

    relatedToolsTitle: "Outils d'Ingénierie Électrique",
    relatedToolsSub: "Utilitaires essentiels pour la conception et le test de circuits",
    backToMainCalc: "Retour au Calculateur Principal",
    usingToolNotice: "Vous utilisez un outil étendu. Vous pouvez revenir à tout moment.",
    colorCodeTitle: "Code Couleur des Résistances",
    colorCodeDesc: "Décodez les résistances standards 4 et 5 anneaux",
    voltageDividerTitle: "Diviseur de Tension",
    voltageDividerDesc: "Calculez la tension de sortie V_out et le courant",
    powerCostTitle: "Consommation et Coût Énergétique",
    powerCostDesc: "Estimez la consommation en kWh et le coût mensuel",
    ledResistorTitle: "Résistance pour LED",
    ledResistorDesc: "Calculez la résistance de protection pour LED et sa puissance",

    color4Band: "Résistance 4 Anneaux",
    color5Band: "Précision 5 Anneaux",
    band1Label: "Anneau 1 (1er Chiffre)",
    band2Label: "Anneau 2 (2e Chiffre)",
    band3Label: "Anneau 3 (3e Chiffre)",
    multiplierLabel: "Multiplicateur",
    toleranceLabel: "Tolérance",

    vInLabel: "Tension d'Entrée V_in (V)",
    r1Label: "Résistance Supérieure R1 (Ω)",
    r2Label: "Résistance Inférieure R2 (Ω)",
    vOutResult: "Tension de Sortie V_out",
    throughCurrentResult: "Courant du Circuit I",
    totalPowerResult: "Puissance Totale P",

    appliancePowerLabel: "Puissance de l'Appareil (P)",
    dailyHoursLabel: "Heures d'Utilisation (Heures/Jour)",
    tariffLabel: "Tarif Électrique (Coût/kWh)",
    dailyKwh: "Énergie Quotidienne",
    monthlyKwh: "Énergie Mensuelle (30 Jours)",
    dailyCost: "Coût Journalier Estimé",
    monthlyCost: "Coût Mensuel Estimé",

    supplyVLabel: "Tension d'Alimentation V_s (V)",
    ledDropVLabel: "Chute de Tension LED V_f (V)",
    ledCurrentLabel: "Courant Nominal LED I_f (mA)",
    recommendedR: "Résistance Limitatrice R",
    resistorPowerRating: "Puissance Requise de la Résistance",

    footerText: "Calculateur Universel de la Loi d'Ohm · Visualisation de Circuit et Vérification Physique",
  },

  pt: {
    appName: "Calculadora Universal da Lei de Ohm",
    appDesc: "Calculadora profissional da Lei de Ohm e potência elétrica com visualização interativa de circuitos, passo a passo e verificação de autoconsistência.",
    mainCalcNav: "Calculadora Principal",
    colorCodeNav: "Código de Cores",
    voltageDividerNav: "Divisor de Tensão",
    powerCostNav: "Custo de Energia",
    ledResistorNav: "Resistor para LED",
    precisionBtn: "Precisão",
    shareBtn: "Compartilhar",

    targetLabel: "SELECIONE O PARÂMETRO A CALCULAR",
    targetSub: "Calcule a incógnita a partir de dois valores elétricos conhecidos",
    current: "I (Corrente)",
    voltage: "U (Tensão)",
    resistance: "R (Resistência)",
    power: "P (Potência)",
    unknownTarget: "Alvo",

    inputSectionTitle: "Parâmetros e Unidades",
    resetBtn: "Redefinir",
    voltageLabel: "Tensão U",
    currentLabel: "Corrente I",
    resistanceLabel: "Resistência R",
    powerLabel: "Potência P",
    siEquivalent: "Base SI",
    invalidErrorTitle: "Divisão por Zero / Parâmetro Inválido",
    invalidErrorDesc: "Em cálculos de CC padrão, Tensão (U), Corrente (I), Resistência (R) e Potência (P) devem ser valores positivos (> 0).",

    circuitTitle: "Visualização Dinâmica do Circuito CC",
    switchOn: "Interruptor: FECHADO (ON)",
    switchOff: "Interruptor: ABERTO (OFF)",
    openCircuit: "0 A (Circuito Aberto)",
    circuitUnavail: "Esquema Indisponível",
    circuitUnavailSub: "Insira valores positivos para gerar o diagrama esquemático interativo.",
    powerDissipation: "Potência Dissipada",
    batteryU: "Tensão da Fonte U",
    resistorR: "Resistência de Carga R",
    ammeterI: "Corrente do Circuito I",

    formulaWheelTitle: "Roda de Fórmulas da Lei de Ohm",
    formulaWheelSub: "Clique em um setor para selecionar a fórmula e o objetivo",
    applyTargetBtn: "Aplicar Objetivo",
    wheelCenter: "Lei de Ohm",
    targetSelected: "Alvo",

    parserTitle: "Analisador Livre de Expressões e Fórmulas",
    parserSub: "Suporta expressões naturais com unidades (ex. 12V / 0.4ohm)",
    presetLabel: "Atalhos Rápidos:",
    parserPlaceholder: "ex. 12V / 400mOhm ou sqrt(100W * 50ohm)",
    syncToCalcBtn: "Carregar na Calculadora Principal",
    parsedResultLabel: "Resultado Calculado:",
    parserError: "Erro de sintaxe. Verifique as unidades (+, -, *, /, ^, sqrt)",

    stepsTitle: "Substituição de Fórmulas e Passo a Passo",
    copyStepsBtn: "Copiar Passos",
    copiedStepsBtn: "Copiado!",
    step1Title: "Passo 1: Normalização de Unidades SI",
    step2Title: "Passo 2: Substituição na Fórmula Principal",
    step3Title: "Passo 3: Cálculo de Potência e Métricas",
    step4Title: "Passo 4: Verificação de Autoconsistência",
    stepKnown: "Valores Conhecidos",
    stepResult: "Resultado Intermediário",

    verificationTitle: "Verificação Física de Autoconsistência",
    verificationPass: "Verificação 100% Aprovada",
    verificationFail: "Resíduo de Ponto Flutuante Detectado",
    verificationDesc: "Compara os resultados com três leis físicas independentes: P = U·I, P = I²·R e P = U²/R.",
    path1Label: "Caminho 1: P = U × I",
    path2Label: "Caminho 2: P = I² × R",
    path3Label: "Caminho 3: P = U² / R",
    maxResidualLabel: "Delta Residual Máximo (Δ):",

    historyTitle: "Histórico de Cálculos",
    historyCount: "registros",
    exportCSV: "Exportar CSV",
    exportJSON: "Exportar JSON",
    clearHistory: "Limpar Tudo",
    noHistory: "Nenhum histórico ainda. Seus cálculos serão salvos automaticamente aqui.",
    inputsPrefix: "Entradas:",
    outputsPrefix: "Resultados:",

    precisionTitle: "Ajustes de Precisão e Formato",
    precisionModeLabel: "Modo de Precisão",
    decimalMode: "Casas Decimais",
    sigFigMode: "Algarismos Significativos",
    decimalPlacesLabel: "Casas Decimais (0 - 12)",
    sigFigsLabel: "Algarismos Significativos (1 - 12)",
    scientificNotation: "Forçar Notação Científica (1.23e+3)",
    thousandsSeparator: "Usar Separador de Milhares (1,234.56)",
    applyPrecisionBtn: "Aplicar Ajustes",

    shareTitle: "Compartilhar Parâmetros de Cálculo",
    shareDesc: "Esta URL codifica suas entradas e unidades atuais para que seus colegas abram exatamente o mesmo contexto.",
    copyLinkBtn: "Copiar Link",
    copiedLinkBtn: "Link Copiado!",

    relatedToolsTitle: "Ferramentas de Engenharia Elétrica",
    relatedToolsSub: "Utilitários essenciais para projeto e testes de circuitos",
    backToMainCalc: "Voltar à Calculadora Principal",
    usingToolNotice: "Você está usando uma ferramenta estendida. Volte quando quiser.",
    colorCodeTitle: "Código de Cores de Resistores",
    colorCodeDesc: "Decodifique resistores padrão de 4 e 5 faixas de precisão",
    voltageDividerTitle: "Divisor de Tensão",
    voltageDividerDesc: "Calcule a tensão de saída V_out e a corrente",
    powerCostTitle: "Consumo e Custo de Energia",
    powerCostDesc: "Estime o consumo diário/mensal em kWh e o custo",
    ledResistorTitle: "Resistor para LED",
    ledResistorDesc: "Calcule o resistor de proteção para LED e sua potência",

    color4Band: "Resistor de 4 Faixas",
    color5Band: "Precisão de 5 Faixas",
    band1Label: "Faixa 1 (1º Dígito)",
    band2Label: "Faixa 2 (2º Dígito)",
    band3Label: "Faixa 3 (3º Dígito)",
    multiplierLabel: "Multiplicador",
    toleranceLabel: "Tolerância",

    vInLabel: "Tensão de Entrada V_in (V)",
    r1Label: "Resistor Superior R1 (Ω)",
    r2Label: "Resistor Inferior R2 (Ω)",
    vOutResult: "Tensão de Saída V_out",
    throughCurrentResult: "Corrente do Circuito I",
    totalPowerResult: "Potência Total P",

    appliancePowerLabel: "Potência do Aparelho (P)",
    dailyHoursLabel: "Horas de Uso (Horas/Dia)",
    tariffLabel: "Tarifa Elétrica (Custo/kWh)",
    dailyKwh: "Energia Diária",
    monthlyKwh: "Energia Mensal (30 Dias)",
    dailyCost: "Custo Diário Est.",
    monthlyCost: "Custo Mensal Est.",

    supplyVLabel: "Tensão da Fonte V_s (V)",
    ledDropVLabel: "Queda de Tensão LED V_f (V)",
    ledCurrentLabel: "Corrente Nominal LED I_f (mA)",
    recommendedR: "Resistor Limitador R",
    resistorPowerRating: "Potência Requerida do Resistor",

    footerText: "Calculadora Universal da Lei de Ohm · Visualização de Circuitos e Verificação Física",
  },
};
