// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { getEnv } from '@elemental-concept/env-bakery';

export const environment = () => ({
  production: getEnv('PRODUCTION').boolean(),
  firebase: {
    apiKey: getEnv('FIREBASE_API_KEY').string(),
    authDomain: getEnv('FIREBASE_AUTH_DOMAIN').string(),
    projectId: getEnv('FIREBASE_PROJECT_ID').string(),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET').string(),
    messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID').string(),
    appId: getEnv('FIREBASE_APP_ID').string(),
    measurementId: getEnv('FIREBASE_MEASUREMENT_ID').string()
  }
});

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
