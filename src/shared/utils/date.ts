/**
 * Formats a Date object to a YYYY-MM-DD string
 */
export function formatDateToYYYYMMDD(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Creates a new Date object that is the specified number of days from the provided date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(date.getDate() + days)
  return result
}
