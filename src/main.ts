import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

/**
 * Deprecated initialisation example
 */
// import { bakeEnv } from '@elemental-concept/env-bakery';
//
// bakeEnv(() => import('./environments/environment')).then((_environment: unknown) => {
//   platformBrowserDynamic()
//     .bootstrapModule(AppModule)
//     .catch(err => console.error(err));
// });

/**
 * Preferred initialisation example - no change needed here
 */
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
