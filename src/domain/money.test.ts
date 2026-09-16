import { describe, expect, it } from 'vitest';
import { formatMoney, money, pct, splitMoney } from './money';

describe('money', () => {
  it('guarda en céntimos enteros', () => {
    expect(money(298720)).toBe(29872000);
    expect(money(12.345)).toBe(1235);
  });

  it('formatea como el diseño: menos tipográfico y miles con coma', () => {
    expect(formatMoney(money(298720))).toBe('₡298,720');
    expect(formatMoney(money(-142800))).toBe('−₡142,800');
    expect(formatMoney(money(298720), { signed: true })).toBe('+₡298,720');
    expect(formatMoney(money(20000), { decimals: true })).toBe('₡20,000.00');
    expect(formatMoney(money(1755000), { compact: true })).toBe('₡1.8M');
  });

  it('reparte sin perder céntimos', () => {
    expect(splitMoney(money(1000.01), [1, 1])).toEqual([50001, 50000]);
    expect(splitMoney(money(100), [70, 30])).toEqual([7000, 3000]);
    const parts = splitMoney(money(33.33), [1, 1, 1]);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(money(33.33));
  });

  it('el sobrante va a quien se indique', () => {
    expect(splitMoney(money(0.01), [1, 1], 1)).toEqual([0, 1]);
  });

  it('acota los porcentajes y tolera divisor cero', () => {
    expect(pct(5, 10)).toBe(50);
    expect(pct(15, 10)).toBe(100);
    expect(pct(5, 0)).toBe(0);
  });
});
