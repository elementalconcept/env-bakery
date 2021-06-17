const fs = require('fs');

export function parbakeRunner(): void {
  if (process.argv.length !== 4) {
    console.log('ERROR: output file name and environment variable whitelist were not specified.\n');
    printHelp();
    process.exit(1);
  }

  const args = getArguments();
  const env = collectEnvironment(args.whitelist);
  const result = recordToEnvFile(env);

  fs.writeFileSync(args.output, result);
}

const configArgPrefix = '--config=';

interface Arguments {
  output: string;
  whitelist: string[];
}

function recordToEnvFile(record: Record<string, string>): string {
  return Object.keys(record)
    .map(key => `${ key }=${ record[ key ] }`)
    .join('\n') + '\n';
}

function collectEnvironment(whitelist: string[]): Record<string, string> {
  return whitelist.reduce(
    (acc, key) => {
      const env = process.env[ key ];

      if (env !== undefined) {
        acc[ key ] = env;
      }

      return acc;
    },
    {} as Record<string, string>);
}

function getArguments(): Arguments {
  return {
    output: process.argv[ 2 ],
    whitelist: getWhitelist(process.argv[ 3 ])
  };
}

function getWhitelist(wh: string): string[] {
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

function printHelp(): void {
  console.log('Usage:');
  console.log('    parbake [output] [whitelist]');
  console.log('    or');
  console.log('    parbake [output] --config=[filename]\n');
  console.log('Examples:\n');
  console.log('    parbake src/assets/.env PRODUCTION,API_BASE_URL,FB_API_KEY,FB_API_SECRET\n');
  console.log('    parbake src/assets/.env --config=parbake.json\n');
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
}`);
}

if (process.argv.length > 1 && process.argv[ 1 ].endsWith('parbake-runner.js')) {
  parbakeRunner();
}
