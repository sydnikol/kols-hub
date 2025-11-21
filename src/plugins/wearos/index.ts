import { registerPlugin } from '@capacitor/core';
import type { WearOSPlugin } from './definitions';

const WearOS = registerPlugin<WearOSPlugin>('WearOS', {
  web: () => import('./web').then(m => new m.WearOSWeb()),
});

export * from './definitions';
export { WearOS };
