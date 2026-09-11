import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  JOURNAL_MAX,
  createJournalEntry,
  makeJournalCaption,
  prependJournalEntry,
} from './journal.ts';

describe('p8 scrapbook journal', () => {
  it('builds a readable caption from vista outfit and weather', () => {
    const caption = makeJournalCaption('westlake', 'moonlight', 'mushroom_pin', 'dusk', 1);
    assert.match(caption, /西湖/);
    assert.match(caption, /暮色/);
    assert.match(caption, /月夜裙/);
    assert.match(caption, /蘑菇胸针/);
  });

  it('prepends newest pages and caps length', () => {
    const first = createJournalEntry({
      vista: 'westlake',
      outfit: 'raincoat',
      accessory: 'none',
      atmosphere: 'clear',
      now: 1000,
    });
    const second = createJournalEntry({
      vista: 'guilin',
      outfit: 'picnic',
      accessory: 'flower_crown',
      atmosphere: 'soft_rain',
      now: 2000,
    });
    const pages = prependJournalEntry([first], second, 2);
    assert.equal(pages[0].id, second.id);
    assert.equal(pages.length, 2);

    let many = [];
    for (let i = 0; i < JOURNAL_MAX + 3; i += 1) {
      many = prependJournalEntry(
        many,
        createJournalEntry({
          vista: 'westlake',
          outfit: 'witch',
          accessory: 'none',
          atmosphere: 'clear',
          now: 3000 + i,
        }),
      );
    }
    assert.equal(many.length, JOURNAL_MAX);
  });
});
