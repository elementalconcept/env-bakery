# EnvBakery

[![npm version](https://badge.fury.io/js/%40elemental-concept%2Fenv-bakery.svg)](https://badge.fury.io/js/%40elemental-concept%2Fenv-bakery)
[![Build Status](https://travis-ci.com/elementalconcept/env-bakery.svg?branch=master)](https://travis-ci.com/elementalconcept/env-bakery)

EnvBakery is an extension for Angular framework that loads environment variables from an `.env` file (located
in `/assets`) into Angular *environment* on application start-up. Normally Angular environment is baked in into the
application during build stage and all Angular environments are part of source code which
breaks [The Twelve-Factor App](http://12factor.net/config) methodology.

EnvBakery also provides direct access to variables specified in an `.env` file.

Some environments might now allow file injection and will instead rely on build process to consume environment variables
from OS. `parbake` CLI utility is included for such cases.

EnvBakery is using `.env` parser extracted from [dotenv](https://github.com/motdotla/dotenv) by Scott Motte. Sadly,
dotenv tries to access Nodejs APIs even when only using its parser. This obviously fails when used in a browser
environment. So the parser code had to be extracted to avoid dotenv dependency entirely.

## Installation

### Install the library

```shell
# With npm
$ npm i @elemental-concept/env-bakery

# With Yarn
$ yarn add @elemental-concept/env-bakery
```

### Create .env file inside /assets

Create an `.env` file in the `/assets` folder of your application. Usually `.env` file is created in the root folder of
the project, but a single Angular project might contain multiple applications, thus it is important to have per
application `.env` file located inside `/assets` folder of each application. Make sure to add `.env` files
to `.gitignore` - environment files should NEVER be submitted to the code repo!

Add environment-specific variables on new lines in the form of `NAME=VALUE`. You can also use comments.

```dotenv
# Angular production flag
PRODUCTION=false

# Sample Firebase config
FIREBASE_API_KEY=api-key
FIREBASE_AUTH_DOMAIN=my-cool-app.firebaseapp.com
FIREBASE_PROJECT_ID=my-cool-app
FIREBASE_STORAGE_BUCKET=my-cool-app.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:000:web:999
FIREBASE_MEASUREMENT_ID=G-ABCDEF

```

### Convert Angular environment into function

Due to the way modules are bundled and imported, it is required to convert Angular *environment* from a static constant
into a function. Open your `src/environments/environment.ts` and do the following change (don't worry about your
`environment.prod.ts` at the moment):

```typescript
export const environment = () => (
  {
    production: false,
    firebase: {
      apiKey: 'api-key',
      authDomain: 'my-cool-app.firebaseapp.com',
      projectId: 'my-cool-app',
      storageBucket: 'my-cool-app.appspot.com',
      messagingSenderId: '123456789',
      appId: '1:000:web:999',
      measurementId: 'G-ABCDEF'
    }
  }
);
```

Make sure to update all of your code which uses `environment` as a constant to use it as a function. Don't change
your `main.ts` yet though.

### Inject .env variables into Angular environment

Import `getEnv()` from `@elemental-concept/env-bakery` and replace static *environment* property values with `getEnv()`
calls:

```typescript
import { getEnv } from '@elemental-concept/env-bakery';

export const environment = () => (
  {
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
  }
);
```

Check API section below on how to use `getEnv()`.

### Update main.ts

Application bootstrap sequence should be modified to be able to set Angular production mode correctly. Direct
environment import should be removed and bootstrap sequence should be wrapped into Promise returned by `bakeEnv()`:

```typescript
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
```

### Remove environment.prod.ts

You don't need `environment.prod.ts` anymore when using `@elemental-concept/env-bakery`. Open `angular.json` and remove
`environment.prod.ts` and `environment.ts` replacement. You can then remove `environment.prod.ts` file from your project
entirely.

```json
{
  "configurations": {
    ...
    "production": {
      ...
      // Remove environment.prod.ts replacement from this array
      "fileReplacements": []
    }
    ...
  }
}
```

### Set up your deployment system

Your deployment system should be aware of these changes. Please refer to the documentation of your deployment system for
exact steps on how to inject custom files into your project.

If using Docker, then volumes are usually used for that:

```shell
$ docker run -v $(pwd)/.env:/root/app/dist/assets/.env my_docker_image
```

## parbake CLI utility

Some deployment environments might now allow file injection and will instead rely on build process to consume
environment variables from OS. [Netlify](https://www.netlify.com/) is a good example of such deployment environment. It
only allows to specify environment through its web interface and then it runs `$ npm build` on each deploy. `parbake`
CLI utility is included for such cases.

The easiest way to use `parbake` is to create a build hook in your `package.json`:

```json
{
  "scripts": {
    "prebuild": "parbake src/assets/.env PRODUCTION,API_BASE_URL,FB_API_KEY,FB_API_SECRET",
    "build": "ng build lib --prod"
  }
}
```

It will consume environment variables defined in a host OS and will create an `.env` with their contents. To avoid
exposing the whole of OS environment to the public, `parbake` requires a whitelist, which can either be specified as a
command line argument or loaded from a JSON configuration file.

Usage:

```shell
$ parbake [output] [whitelist]
$ parbake [output] --config=[filename]
```

Whitelist is a comma-separated list of environment variable names.

Configuration file must be in JSON format, should contain a single object with a single property called `whitelist`,
which in turn should contain a list of strings. For example:

```json
{
  "whitelist": [
    "PRODUCTION",
    "API_BASE_URL",
    "FB_API_KEY",
    "FB_API_SECRET"
  ]
}
```

You can also install EnvBakery as a global package and use `parbake` locally to dump your environment into a file.

## API

`.env` variables should be accessed through `getEnv()` after successful bootstrap. You can either inject them into you
Angular `environment` or use `getEnv()` directly if needed.

### getEnv()

`getEnv(key: string): EnvConverter` - returns an instance of `EnvConverter` bound to an environment variable specified
by `key`.

### EnvConverter

Provides a set of wrapper functions to access environment variables as strings, numbers, booleans and arrays of strings.
If environment variable is not specified, default value will be returned. If you need to access an environment variable
without any modifications, use `raw()` method.

`raw(): any` - returns environment variable as-is without any modifications. If environment variable is not present
in `.env` file then `undefined` will be returned.

`number(defaultValue = 0): number` - returns environment variable as a `number` primitive. String values will be
converted using `parseFloat()`. `defaultValue` will be returned instead of non-numeric values (including `undefined`)
and `NaN`.

`string(defaultValue = ''): string` - returns environment variable as a `string` primitive. `defaultValue` will be
returned instead of non-string values (including `undefined`).

`array(separator = ',', defaultValue: string[] = []): string[]` - returns environment variable as an array of strings.
Environment variable will be split by `separator`. `defaultValue` will be returned in case of any errors.

`boolean(truthyValues = [ 'true', 't', '1', 'on', 'enable', 'enabled', 'yes' ], defaultValue = false): boolean` -
returns environment variable as a boolean. Any string value present in `truthyValues` will return `true`, any other
string value will return `false`. Non-string values will return `defaultValue`.
