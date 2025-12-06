/**
 * KOL CORE - Unified System Exports
 *
 * Central export point for all core system functionality
 */

// Main unified system
export { kolSystem, initializeKolSystem, type SystemState, type FeatureIdea, type LearningEvent, type CrossSystemConnection } from './UnifiedKolSystem';

// Seed data loader
export { seedLoader, loadAllSeeds, type SeedStats, type UnifiedIdea } from './UnifiedSeedLoader';

// Feature evolution
export { evolutionEngine, startEvolution, type GeneratedFeature, type UsagePattern, type EvolutionMetrics } from './FeatureEvolutionEngine';

// Convenience function to initialize everything
export async function initializeCore(): Promise<{
  system: any;
  seeds: any;
  evolution: any;
}> {
  const { initializeKolSystem } = await import('./UnifiedKolSystem');
  const { loadAllSeeds } = await import('./UnifiedSeedLoader');
  const { startEvolution } = await import('./FeatureEvolutionEngine');

  const system = await initializeKolSystem();
  const seeds = await loadAllSeeds();
  await startEvolution();

  return {
    system,
    seeds,
    evolution: null
  };
}

export default {
  kolSystem: () => import('./UnifiedKolSystem').then(m => m.kolSystem),
  seedLoader: () => import('./UnifiedSeedLoader').then(m => m.seedLoader),
  evolutionEngine: () => import('./FeatureEvolutionEngine').then(m => m.evolutionEngine)
};
