import { bakedEnv } from './baked-env';
import { parse } from './dotenv-parse';

export type EnvironmentFactory<T> = {
  environment: () => T;
};

export async function bakeEnv<T>(
  envProvider: () => Promise<EnvironmentFactory<T>>,
  envUrl = '/assets/.env'
): Promise<T> {
  const result = parse(await (await fetch(envUrl)).text());
  Object.assign(bakedEnv, result);
  const environment = (await envProvider()).environment();

  return environment;
}
