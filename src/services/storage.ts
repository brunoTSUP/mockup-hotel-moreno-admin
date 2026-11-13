import type { Database } from '../domain/types';
import { createSeed } from '../data/seed';
const KEY = 'hotel-moreno-demo-v1';
export const localRepository = {
  load(): Database { try { const raw = localStorage.getItem(KEY); if (raw) { const data = JSON.parse(raw); if (data.rooms && data.stays && data.checkins && data.settings) return data; } } catch { /* Dados inválidos usam a demonstração inicial. */ } return createSeed(); },
  save(data: Database) { try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; } },
  reset: createSeed,
};
