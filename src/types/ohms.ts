export type TargetParameter = 'I' | 'U' | 'R' | 'P';

export type PrecisionMode = 'decimal' | 'sigfig';

export type VoltageUnit = 'V' | 'mV' | 'uV' | 'kV' | 'MV';
export type CurrentUnit = 'A' | 'mA' | 'uA' | 'kA';
export type ResistanceUnit = 'ohm' | 'mOhm' | 'kOhm' | 'MOhm' | 'GOhm';
export type PowerUnit = 'W' | 'mW' | 'uW' | 'kW' | 'MW';

export interface UnitDefinition<T extends string> {
  symbol: T;
  label: string;
  multiplier: number; // Multiplier to reach SI base unit (V, A, Ohm, W)
}

export interface PrecisionConfig {
  mode: PrecisionMode;
  decimalPlaces: number; // 0 to 12
  significantFigures: number; // 1 to 12
  useScientific: boolean;
  useThousandsSeparator: boolean;
}

export interface FormulaStep {
  title: string;
  formulaStr: string;
  substitutionStr: string;
  resultStr: string;
  note?: string;
}

export interface CalculationResult {
  isValid: boolean;
  errorMessage?: string;
  
  // SI Base values
  u_volts: number;
  i_amps: number;
  r_ohms: number;
  p_watts: number;

  // Selected display values & units
  u_display: number;
  u_unit: VoltageUnit;
  i_display: number;
  i_unit: CurrentUnit;
  r_display: number;
  r_unit: ResistanceUnit;
  p_display: number;
  p_unit: PowerUnit;

  target: TargetParameter;
  steps: FormulaStep[];
  
  // Self-consistency verification metrics
  verification: {
    p_from_ui: number;
    p_from_i2r: number;
    p_from_u2r: number;
    u_from_ir: number;
    maxResidual: number;
    isConsistent: boolean;
  };
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  target: TargetParameter;
  inputsStr: string;
  outputsStr: string;
  u_val: number;
  u_unit: VoltageUnit;
  i_val: number;
  i_unit: CurrentUnit;
  r_val: number;
  r_unit: ResistanceUnit;
  p_val: number;
  p_unit: PowerUnit;
}

export type RelatedToolId = 'color-code' | 'voltage-divider' | 'power-cost' | 'led-resistor';
