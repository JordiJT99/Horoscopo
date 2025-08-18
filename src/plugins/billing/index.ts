import { registerPlugin } from '@capacitor/core';
import type { GooglePlayBillingPlugin } from './definitions';

const GooglePlayBilling = registerPlugin<GooglePlayBillingPlugin>('GooglePlayBilling', {
  web: () => import('./web').then(m => new m.GooglePlayBillingWeb()),
});

export * from './definitions';
export { GooglePlayBilling };
