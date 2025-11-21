import { registerPlugin } from '@capacitor/core';
import type { GoogleHomePlugin } from './definitions';

const GoogleHome = registerPlugin<GoogleHomePlugin>('GoogleHome', {
  web: () => import('./web').then(m => new m.GoogleHomeWeb()),
});

export * from './definitions';
export { GoogleHome };
