import { bakedEnv } from './baked-env';
import { EnvConverter, getEnv } from './get-env';

describe('get-env.ts', () => {
  beforeEach(() => {
    Object.keys(bakedEnv).forEach(key => delete bakedEnv[ key ]);
  });

  describe('getEnv', () => {
    it('should bind EnvConverter to environment variable', () => {
      Object.assign(bakedEnv, { test: 'Test', abc: 'xyz' });
      expect(getEnv('test').raw()).toBe('Test');
      expect(getEnv('abc').raw()).toBe('xyz');
      expect(getEnv('xyz').raw()).toBeUndefined();
    });
  });

  describe('EnvConverter', () => {
    describe('raw', () => {
      it('should return raw values', () => {
        expect(new EnvConverter(123).raw()).toBe(123);
        expect(new EnvConverter('123').raw()).toBe('123');
        expect(new EnvConverter(undefined).raw()).toBeUndefined();
      });
    });

    describe('number', () => {
      it('should return correct numeric values', () => {
        expect(new EnvConverter(123).number()).toBe(123);
        expect(new EnvConverter('321').number()).toBe(321);
      });

      it('should return defaultValue on incorrect values', () => {
        expect(new EnvConverter(undefined).number()).toBe(0);
        expect(new EnvConverter(undefined).number(10)).toBe(10);

        expect(new EnvConverter({}).number()).toBe(0);
        expect(new EnvConverter({}).number(10)).toBe(10);

        expect(new EnvConverter('{abc}').number()).toBe(0);
        expect(new EnvConverter('{abc}').number(10)).toBe(10);
      });
    });

    describe('string', () => {
      it('should return correct string values', () => {
        expect(new EnvConverter(123).string()).toBe('123');
        expect(new EnvConverter('321').string()).toBe('321');
      });

      it('should return defaultValue on incorrect values', () => {
        expect(new EnvConverter(undefined).string()).toBe('');
        expect(new EnvConverter(undefined).string('10')).toBe('10');

        expect(new EnvConverter({}).string()).toBe('');
        expect(new EnvConverter({}).string('10')).toBe('10');
      });
    });

    describe('array', () => {
      it('should return correct array values', () => {
        expect(new EnvConverter('123,234,345').array()).toEqual([ '123', '234', '345' ]);
        expect(new EnvConverter('').array()).toEqual([ '' ]);
        expect(new EnvConverter('111-222-333').array('-')).toEqual([ '111', '222', '333' ]);
      });

      it('should return defaultValue on incorrect values', () => {
        expect(new EnvConverter(undefined).array()).toEqual([]);
        expect(new EnvConverter(undefined).array(',', [ '10' ])).toEqual([ '10' ]);
      });
    });

    describe('boolean', () => {
      it('should return TRUE', () => {
        expect(new EnvConverter('true').boolean()).toBeTrue();
        expect(new EnvConverter('TRUE').boolean()).toBeTrue();
        expect(new EnvConverter('TrUe').boolean()).toBeTrue();
        expect(new EnvConverter('t').boolean()).toBeTrue();
        expect(new EnvConverter('1').boolean()).toBeTrue();
        expect(new EnvConverter('on').boolean()).toBeTrue();
        expect(new EnvConverter('enable').boolean()).toBeTrue();
        expect(new EnvConverter('enabled').boolean()).toBeTrue();
        expect(new EnvConverter('yes').boolean()).toBeTrue();
      });

      it('should return FALSE', () => {
        expect(new EnvConverter('false').boolean()).toBeFalse();
        expect(new EnvConverter('FALSE').boolean()).toBeFalse();
        expect(new EnvConverter('FaLsE').boolean()).toBeFalse();
        expect(new EnvConverter('f').boolean()).toBeFalse();
        expect(new EnvConverter('0').boolean()).toBeFalse();
        expect(new EnvConverter('off').boolean()).toBeFalse();
        expect(new EnvConverter('disable').boolean()).toBeFalse();
        expect(new EnvConverter('disabled').boolean()).toBeFalse();
        expect(new EnvConverter('no').boolean()).toBeFalse();
        expect(new EnvConverter('xxx').boolean()).toBeFalse();
        expect(new EnvConverter('yyy').boolean()).toBeFalse();
      });
    });
  });
});
