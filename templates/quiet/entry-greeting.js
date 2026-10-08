// Visitor-device local time only: no geolocation, IP lookup, network or live clock.
import { copyFor } from './copy.js';

const GREETINGS = Object.freeze({
  morning: 'Magandang umaga!',
  afternoon: 'Magandang hapon!',
  evening: 'Magandang gabi!',
  day: 'Magandang araw!',
});
const DESCRIPTION_KEYS = Object.freeze({
  morning: 'entryMorning', afternoon: 'entryAfternoon', evening: 'entryEvening', day: 'entryDescription',
});

export function entryPeriod(hour) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) return 'day';
  if (hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

// Called once per eligible welcome. An explicit invalid hour selects the static fallback.
export function entryGreeting(locale = 'en', hour = new Date().getHours()) {
  const period = entryPeriod(hour);
  return { period, text: GREETINGS[period], description: copyFor(locale)[DESCRIPTION_KEYS[period]] };
}
