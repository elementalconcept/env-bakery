export interface DotenvParseOptions {
  debug?: boolean;
}

export type DotenvParseOutput = Record<string, string>;

const NEWLINE = '\n';
const RE_INI_KEY_VAL = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;
const RE_NEWLINES = /\\n/g;
const NEWLINES_MATCH = /\r\n|\n|\r/;

// Parses src into an Object
export function parse<T extends DotenvParseOutput = DotenvParseOutput>(src: string, options?: DotenvParseOptions): T {
  const debug = Boolean(options && options.debug);
  const obj: T = {} as T;

  // convert Buffers before splitting into lines and processing
  src.toString().split(NEWLINES_MATCH).forEach((line, idx) => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    const keyValueArr = line.match(RE_INI_KEY_VAL);

    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];
      // default undefined or missing values to empty string
      let val = keyValueArr[2] || '';
      const end = val.length - 1;
      const isDoubleQuoted = val[0] === '"' && val[end] === '"';
      const isSingleQuoted = val[0] === '\'' && val[end] === '\'';

      // if single or double quoted, remove quotes
      if (isSingleQuoted || isDoubleQuoted) {
        val = val.substring(1, end);

        // if double quoted, expand newlines
        if (isDoubleQuoted) {
          val = val.replace(RE_NEWLINES, NEWLINE);
        }
      } else {
        // remove surrounding whitespace
        val = val.trim();
      }

      // @ts-ignore
      obj[key] = val;
    } else if (debug) {
      console.log(`did not match key and value when parsing line ${idx + 1}: ${line}`);
    }
  });

  return obj;
}
