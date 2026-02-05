import { NgModule, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { bakeEnv } from '@elemental-concept/env-bakery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/**
 * Preferred initialisation example
 */
function initializeApp() {
  return bakeEnv(() => import('../environments/environment'), '/assets/env.properties');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideAppInitializer(() => {
      const initializerFn = (() => initializeApp)();
      return initializerFn();
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
