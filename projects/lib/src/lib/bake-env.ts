import { parse } from './dotenv-parse';
import { bakedEnv } from './baked-env';

export async function bakeEnv<T>(envProvider: () => Promise<any>, envUrl = '/assets/.env'): Promise<T> {
  const result = parse<Record<string, string>>(await (await fetch(envUrl)).text());
  Object.assign(bakedEnv, result);
  const environment = (await envProvider()).environment();

  return environment;
}
