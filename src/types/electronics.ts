/**
 * Type definitions for Ohm's Law and Electric Power Application
 */

export type QuantityType = 'voltage' | 'current' | 'resistance' | 'power';

export interface UnitOption {
  symbol: string;
  label: string;
  multiplier: number; // to SI base unit (V, A, Ohm, W)
}

export interface PhysicalQuantityState {
  rawInput: string;
  value: number | null; // in SI base unit
  unit: string;
  isLockedOrCalculated?: boolean;
}

export interface DerivationStep {
  target: QuantityType;
  formulaLatex: string;
  formulaPlain: string;
  explanation: string;
  substitution: string;
  resultWithUnit: string;
  alternateVerification?: string;
}

export interface ResistorItem {
  id: string;
  name: string;
  resistance: number; // in Ohms
  unit: string;
  ratingWatts: number; // e.g. 0.25 (1/4W), 0.5, 1, 2, 5
  tolerancePct: number; // e.g. 1, 5
  // Calculated outputs
  voltageDrop?: number;
  current?: number;
  powerDissipated?: number;
  isOverloaded?: boolean;
}

export interface ResistorColorBand {
  name: string;
  colorHex: string;
  textColor: string;
  digit?: number;
  multiplier?: number;
  tolerance?: number;
}

export interface AppliancePreset {
  id: string;
  name: string;
  category: '生活家电' | '数码办公' | '大功率厨卫' | '照明散热';
  typicalWatts: number;
  defaultDailyHours: number;
  description: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: '基础' | '进阶' | '竞赛';
}
