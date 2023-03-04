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
