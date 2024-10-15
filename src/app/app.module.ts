import { APP_INITIALIZER, NgModule } from '@angular/core';
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
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeApp,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
