import { CalendarDate } from "@internationalized/date";

/**
 * Coerce Date, ISO string, or CalendarDate to CalendarDate for HeroUI DateInput.
 * DateInput expects CalendarDate and throws "Invalid granularity" for raw Date.
 *
 * @param value - Date, ISO string, CalendarDate, or null/undefined
 * @returns CalendarDate or null
 */
export function toCalendarDateValue(value: unknown): CalendarDate | null {
  if (value === null || value === undefined) {
    return null;
  }

  // Already a CalendarDate (has year, month, day as numbers)
  if (
    typeof value === "object" &&
    "year" in value &&
    "month" in value &&
    "day" in value &&
    typeof (value as { year: unknown }).year === "number"
  ) {
    return value as CalendarDate;
  }

  // Date object
  if (value instanceof Date) {
    return new CalendarDate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  // ISO string (YYYY-MM-DD or full ISO)
  if (typeof value === "string") {
    const d = new Date(value);

    if (!isNaN(d.getTime())) {
      return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }
  }

  return null;
}
