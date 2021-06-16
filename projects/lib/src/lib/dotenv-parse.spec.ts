import { parse } from './dotenv-parse';

describe('parse', () => {
  it('should parse simple key/value pairs', () => {
    expect(parse('ABC=xyz\nXYZ=abc test')).toEqual({ ABC: 'xyz', XYZ: 'abc test' });
  });

  it('should ignore comments', () => {
    expect(parse('# Sample line 1\nABC=xyz\n# Sample line 2\nXYZ=abc test')).toEqual({ ABC: 'xyz', XYZ: 'abc test' });
  });
});
