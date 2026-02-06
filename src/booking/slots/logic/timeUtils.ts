// src/booking/slots/logic/timeUtils.ts
import { DateTime } from 'luxon';

/**
 * Converts time string (HH:mm) to total minutes
 * @param timeStr - Time in format "HH:mm"
 * @returns Total minutes (e.g., "14:30" -> 870)
 */
export const toMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Converts local date and time to UTC ISO string
 * @param dateStr - Date in format "yyyy-MM-dd"
 * @param timeStr - Time in format "HH:mm"
 * @param timezone - Business timezone (e.g., "Europe/Rome")
 * @returns UTC ISO string with 'Z' suffix, or null if conversion fails
 */
export const localToUTCISO = (
  dateStr: string,
  timeStr: string,
  timezone: string
): string | null => {
  try {
    const result = DateTime.fromFormat(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', { zone: timezone })
      .toUTC()
      .toISO();
    
    return result;
  } catch (error) {
    console.error('Error converting local time to UTC:', error);
    return null;
  }
};

/**
 * Formats minutes into HH:mm string
 * @param minutes - Total minutes
 * @returns Time string in format "HH:mm"
 */
export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};