import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { bakeEnv } from '@elemental-concept/env-bakery';

import { AppModule } from './app/app.module';

bakeEnv(() => import('./environments/environment')).then((environment: any) => {
  if (environment.production) {
    enableProdMode();
  }

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
