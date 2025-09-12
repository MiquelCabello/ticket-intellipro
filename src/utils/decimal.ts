/**
 * Financial decimal utilities - DECIMAL(18,4) precision
 * Calculate with 4 decimal places, display with 2
 */

export type DecimalValue = number;

/**
 * Round to 4 decimal places for calculations
 */
export function toDecimal(value: number): DecimalValue {
  return Math.round(value * 10000) / 10000;
}

/**
 * Format for UI display (2 decimal places)
 */
export function formatCurrency(value: DecimalValue, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format for display without currency symbol
 */
export function formatDecimal(value: DecimalValue, decimals = 2): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Safe addition with decimal precision
 */
export function addDecimal(a: DecimalValue, b: DecimalValue): DecimalValue {
  return toDecimal(a + b);
}

/**
 * Safe subtraction with decimal precision
 */
export function subtractDecimal(a: DecimalValue, b: DecimalValue): DecimalValue {
  return toDecimal(a - b);
}

/**
 * Safe multiplication with decimal precision
 */
export function multiplyDecimal(a: DecimalValue, b: DecimalValue): DecimalValue {
  return toDecimal(a * b);
}

/**
 * Safe division with decimal precision
 */
export function divideDecimal(a: DecimalValue, b: DecimalValue): DecimalValue {
  if (b === 0) throw new Error('Division by zero');
  return toDecimal(a / b);
}

/**
 * Calculate VAT amount from base and rate
 */
export function calculateVAT(base: DecimalValue, rate: DecimalValue): DecimalValue {
  return multiplyDecimal(base, divideDecimal(rate, 100));
}

/**
 * Calculate total with VAT
 */
export function calculateTotalWithVAT(base: DecimalValue, vatAmount: DecimalValue): DecimalValue {
  return addDecimal(base, vatAmount);
}