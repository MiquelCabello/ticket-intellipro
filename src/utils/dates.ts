/**
 * Date utilities with ISO 8601 support
 */

/**
 * Format date to ISO 8601 string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format datetime to ISO 8601 string
 */
export function formatDateTimeISO(date: Date): string {
  return date.toISOString();
}

/**
 * Parse ISO date string to Date object
 */
export function parseISODate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format date for UI display
 */
export function formatDateForUI(date: Date, locale = 'es-ES'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Format datetime for UI display
 */
export function formatDateTimeForUI(date: Date, locale = 'es-ES'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get current date in ISO format
 */
export function getCurrentDateISO(): string {
  return formatDateISO(new Date());
}

/**
 * Get current datetime in ISO format
 */
export function getCurrentDateTimeISO(): string {
  return formatDateTimeISO(new Date());
}

/**
 * Check if date is valid
 */
export function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}