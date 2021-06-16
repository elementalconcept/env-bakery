import { DotenvParseOutput, parse } from './dotenv-parse';
import { bakedEnv } from './baked-env';

export async function bakeEnv<T extends DotenvParseOutput = DotenvParseOutput>(envUrl = '/assets/.env'): Promise<T> {
  const result = parse<T>(await (await fetch(envUrl)).text());
  Object.assign(bakedEnv, result);
  return result;
}
