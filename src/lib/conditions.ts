import type { Condition } from '../types';

// Backend acepta: Mint, Near Mint, Light Play, Moderately Played, Heavily Played, Damaged
// Frontend usa: mint, near_mint, excellent, good, light_plaid, plaid, poor

export type BackendCondition = 'Mint' | 'Near Mint' | 'Light Play' | 'Moderately Played' | 'Heavily Played' | 'Damaged';

// Frontend -> Backend
export const conditionToBackend: Record<Condition, BackendCondition> = {
  mint: 'Mint',
  near_mint: 'Near Mint',
  excellent: 'Moderately Played',
  good: 'Moderately Played',
  light_plaid: 'Light Play',
  plaid: 'Moderately Played',
  poor: 'Damaged',
};

// Backend -> Frontend
export const backendToCondition: Record<string, Condition> = {
  'Mint': 'mint',
  'Near Mint': 'near_mint',
  'Light Play': 'light_plaid',
  'Moderately Played': 'plaid',
  'Heavily Played': 'poor',
  'Damaged': 'poor',
};

// Labels de display para codigos de backend
const backendConditionLabels: Record<string, string> = {
  'Mint': 'Mint',
  'Near Mint': 'Near Mint',
  'Light Play': 'Light Play',
  'Moderately Played': 'Moderately Played',
  'Heavily Played': 'Heavily Played',
  'Damaged': 'Damaged',
  // Posibles variaciones que pueda devolver el backend
  'NM': 'Near Mint',
  'LP': 'Light Play',
  'MP': 'Moderately Played',
  'HP': 'Heavily Played',
};

// Convertir condicion del frontend a formato del backend
export function toBackendCondition(condition: Condition): string {
  return conditionToBackend[condition];
}

// Convertir condicion del backend a formato del frontend
export function fromBackendCondition(code: string): Condition {
  return backendToCondition[code] || 'near_mint';
}

// Formatear condicion del backend para display
export function formatBackendCondition(code: string): string {
  return backendConditionLabels[code] || code;
}