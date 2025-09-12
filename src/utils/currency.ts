/**
 * Currency utilities with ISO 4217 support
 */

export const SUPPORTED_CURRENCIES = {
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
} as const;

export type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

/**
 * Validate ISO 4217 currency code
 */
export function isValidCurrencyCode(code: string): code is CurrencyCode {
  return code in SUPPORTED_CURRENCIES;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[code].symbol;
}

/**
 * Get currency name
 */
export function getCurrencyName(code: CurrencyCode): string {
  return SUPPORTED_CURRENCIES[code].name;
}

/**
 * Format amount with currency
 */
export function formatWithCurrency(amount: number, currencyCode: CurrencyCode): string {
  const locale = currencyCode === 'EUR' ? 'es-ES' : 
                 currencyCode === 'USD' ? 'en-US' : 'en-GB';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}