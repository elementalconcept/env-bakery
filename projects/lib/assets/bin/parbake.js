#!/usr/bin/env node

'use strict';

const fs = require('fs');

const configArgPrefix = '--config=';

const jsonArgPrefix = '--json=';

function parbakeRunner() {
  if (process.argv.length !== 4) {
    console.log('ERROR: output file name and environment variable whitelist were not specified.\n');
    printHelp();
    process.exit(1);
  }

  const args = getArguments();
  const env = args.json !== undefined ? args.json : collectEnvironment(args.whitelist);
  const result = recordToEnvFile(env);

  fs.writeFileSync(args.output, result);
}

function recordToEnvFile(record) {
  return Object.keys(record)
    .map(key => `${ key }=${ record[ key ] }`)
    .join('\n') + '\n';
}

function collectEnvironment(whitelist) {
  return whitelist.reduce(
    (acc, key) => {
      const env = process.env[ key ];

      if (env !== undefined) {
        acc[ key ] = env;
      }

      return acc;
    },
    {});
}

function getArguments() {
  const optionalArg = process.argv[ 3 ];

  if (optionalArg.startsWith(jsonArgPrefix)) {
    return {
      output: process.argv[ 2 ],
      json: getJSONEnv(optionalArg)
    };
  }

  return {
    output: process.argv[ 2 ],
    whitelist: getWhitelist(optionalArg)
  };
}

function getJSONEnv(wh) {
  const json = wh.replace(jsonArgPrefix, '');
  return JSON.parse(json);
}

function getWhitelist(wh) {
  if (wh.startsWith(configArgPrefix)) {
    const configName = wh.replace(configArgPrefix, '');

    if (!fs.existsSync(configName)) {
      console.log(`ERROR: config "${ configName }" does not exist!`);
      process.exit(2);
    }

    const contents = fs.readFileSync(configName, 'utf8');
    const config = JSON.parse(contents);

    if (!(config.whitelist instanceof Array)) {
      console.log(`ERROR: config is missing whitelist!`);
      process.exit(3);
    }

    return config.whitelist;
  }

  return wh.split(',');
}

function printHelp() {
  console.log('Usage:');
  console.log('    npx @elemental-concept/env-bakery [output] [whitelist]');
  console.log('    or');
  console.log('    npx @elemental-concept/env-bakery [output] --config=[filename]');
  console.log('    or');
  console.log('    npx @elemental-concept/env-bakery [output] --json=[environmentJson]\n');
  console.log('Examples:\n');
  console.log('    npx @elemental-concept/env-bakery src/assets/.env PRODUCTION,API_BASE_URL,FB_API_KEY,FB_API_SECRET\n');
  console.log('    npx @elemental-concept/env-bakery src/assets/.env --config=parbake.json\n');
  console.log('    npx @elemental-concept/env-bakery src/assets/.env --json=\'{\\"PRODUCTION\\": \\"true\\"}\'\n');
  console.log('Configuration file must be in JSON format, should contain a single object with');
  console.log('a single property called "whitelist", which in turn should contain a list of strings.\n');
  console.log('Example:\n');
  console.log(`{
  "whitelist": [
    "PRODUCTION",
    "API_BASE_URL",
    "FB_API_KEY",
    "FB_API_SECRET"
  ]
}\n`);
  console.log('Alternatively you can specify required environment variables as a single JSON string');
  console.log('using --json argument. Make sure to escape double quotes correctly!');
}

parbakeRunner();
