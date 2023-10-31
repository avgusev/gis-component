import { cutString } from './cutString';

describe('cutString', () => {
  test('should return cut 4 symbols string with ...', () => {
    expect(cutString('string', 4)).toBe('stri...');
  });

  test('should return first argument if string.length > limit', () => {
    expect(cutString('string', 6)).toBe('string');
  });

  test(`should return '' if first argument equals ''`, () => {
    expect(cutString('', 2)).toBe('');
  });

  test(`should return first argument if limit = 0`, () => {
    expect(cutString('string', 0)).toBe('string');
  });
});
