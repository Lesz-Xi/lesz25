import test from 'node:test';
import assert from 'node:assert/strict';
import { COPY } from '../templates/quiet/copy.js';
import { entryPeriod, entryGreeting } from '../templates/quiet/entry-greeting.js';

const expected = {
  morning: { text: 'Magandang umaga!', key: 'entryMorning' },
  afternoon: { text: 'Magandang hapon!', key: 'entryAfternoon' },
  evening: { text: 'Magandang gabi!', key: 'entryEvening' },
};

test('device-local greeting periods cover every hour with exact 05/12/18 boundaries', () => {
  for (let hour = 0; hour < 24; hour++) {
    const period = hour < 5 || hour >= 18 ? 'evening' : hour < 12 ? 'morning' : 'afternoon';
    assert.equal(entryPeriod(hour), period, `${hour}:00`);
    assert.equal(entryGreeting('en', hour).text, expected[period].text);
  }
});

test('all six locales pair each Filipino greeting with a complete translated welcome', () => {
  for (const [locale, copy] of Object.entries(COPY)) {
    for (const [hour, period] of [[5, 'morning'], [12, 'afternoon'], [18, 'evening']]) {
      assert.deepEqual(entryGreeting(locale, hour), { period, text: expected[period].text, description: copy[expected[period].key] });
      assert.ok(copy[expected[period].key].length > 0);
    }
  }
  assert.equal(entryGreeting('en', 5).description, 'Good morning. Welcome.');
  assert.equal(entryGreeting('en', 12).description, 'Good afternoon. Welcome.');
  assert.equal(entryGreeting('en', 18).description, 'Good evening. Welcome.');
  assert.deepEqual(entryGreeting('unknown', 5), entryGreeting('en', 5));
});

test('invalid clock values keep the generic fallback; greeting selection has no shared mutable state', () => {
  for (const hour of [-1, 24, 4.5, NaN, Infinity, null, '7']) {
    assert.equal(entryPeriod(hour), 'day');
    for (const locale of Object.keys(COPY)) assert.deepEqual(entryGreeting(locale, hour), {
      period: 'day', text: 'Magandang araw!', description: COPY[locale].entryDescription,
    });
  }
  const first = entryGreeting('en', 7);
  first.text = 'Changed by caller';
  assert.equal(entryGreeting('en', 7).text, 'Magandang umaga!');
  assert.equal(entryGreeting('en', 13).text, 'Magandang hapon!');
});
