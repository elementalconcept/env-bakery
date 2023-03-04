import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { bakeEnv } from '@elemental-concept/env-bakery';

import { AppModule } from './app/app.module';

bakeEnv(() => import('./environments/environment')).then((_environment: unknown) => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
