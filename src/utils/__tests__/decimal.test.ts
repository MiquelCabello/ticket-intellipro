import { describe, it, expect } from 'vitest';
import {
  toDecimal,
  formatCurrency,
  addDecimal,
  subtractDecimal,
  multiplyDecimal,
  divideDecimal,
  calculateVAT,
  calculateTotalWithVAT,
} from '../decimal';

describe('Decimal utilities', () => {
  it('should round to 4 decimal places', () => {
    expect(toDecimal(1.123456)).toBe(1.1235);
    expect(toDecimal(1.123444)).toBe(1.1234);
  });

  it('should format currency correctly', () => {
    expect(formatCurrency(123.45, 'EUR')).toBe('123,45 €');
    expect(formatCurrency(1234.5, 'EUR')).toBe('1.234,50 €');
  });

  it('should perform safe arithmetic operations', () => {
    expect(addDecimal(1.1111, 2.2222)).toBe(3.3333);
    expect(subtractDecimal(5.5555, 2.2222)).toBe(3.3333);
    expect(multiplyDecimal(2.5, 3.2)).toBe(8.0);
    expect(divideDecimal(10, 3)).toBe(3.3333);
  });

  it('should calculate VAT correctly', () => {
    const base = 100;
    const rate = 21; // 21% VAT
    const vatAmount = calculateVAT(base, rate);
    const total = calculateTotalWithVAT(base, vatAmount);
    
    expect(vatAmount).toBe(21);
    expect(total).toBe(121);
  });

  it('should throw error on division by zero', () => {
    expect(() => divideDecimal(10, 0)).toThrow('Division by zero');
  });
});