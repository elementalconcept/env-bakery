import { bakedEnv } from './baked-env';

export function getEnv(key: string): EnvConverter {
  return new EnvConverter(bakedEnv[key]);
}

export class EnvConverter {
  constructor(private readonly value: any) {
  }

  raw = () => this.value;

  number = (defaultValue = 0): number => {
    switch (typeof this.value) {
      case 'number':
        return this.value;

      case 'string':
        const result = parseFloat(this.value);
        return Number.isNaN(result) ? defaultValue : result;

      default:
        return defaultValue;
    }
  };

  string = (defaultValue = ''): string => {
    switch (typeof this.value) {
      case 'number':
        return this.value.toString(10);

      case 'string':
        return this.value;

      default:
        return defaultValue;
    }
  };

  array = (separator = ',', defaultValue: string[] = []): string[] => {
    if (typeof this.value === 'string') {
      return this.value.split(separator);
    }

    return defaultValue;
  };

  boolean = (
    truthyValues = ['true', 't', '1', 'on', 'enable', 'enabled', 'yes'],
    defaultValue = false
  ): boolean => {
    if (typeof this.value !== 'string') {
      return defaultValue;
    }

    return truthyValues.includes(this.value.toLowerCase());
  };
}
