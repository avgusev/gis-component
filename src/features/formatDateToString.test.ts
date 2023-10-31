import { formatDateToString } from './formatDateToString';

describe('formatDateToString', () => {
  test('должна вернуть строку вида год-месяц-день', () => {
    // тк в js месяц от 0 до 11, а в postrg от 1 до 12
    const date = new Date(2023, 10, 19);
    expect(formatDateToString(date)).toBe('2023-11-19');
  });

  test('должна вернуть строку вида год-месяц-день, где месяц записан с 0', () => {
    const date = new Date(2023, 5, 19);
    // тк в js месяц от 0 до 11, а в postrg от 1 до 12
    expect(formatDateToString(date)).toBe('2023-06-19');
  });

  test('должна вернуть строку вида год-месяц-день, где день записан с 0', () => {
    // тк в js месяц от 0 до 11, а в postrg от 1 до 12
    const date = new Date(2023, 11, 6);
    expect(formatDateToString(date)).toBe('2023-12-06');
  });
});
