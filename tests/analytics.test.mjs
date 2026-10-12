import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReport } from '../src/lib/analytics/aggregate.ts';
import { parseEventKind } from '../src/lib/analytics/events.ts';
import { trackEvent } from '../src/lib/analytics/client.ts';

const now = new Date('2026-10-12T06:00:00Z');
const base = { ts: '2026-10-12T01:00:00Z', path: '/services/ai-consulting', ref: 'google.com', visitor: 'v1', session: 's1', entry: true, device: 'desktop', country: 'JP' };
const action = (kind, extra = {}) => ({...base, kind, path: '/', entry: false, ts: '2026-10-12T02:00:00Z', ...extra});

test('legacy views remain views; conversion actions do not inflate page, session, or daily totals', () => {
  const events = [base, {...base, path: '/', entry: false}, action('contact_click'), action('contact_start'), action('contact_success')];
  const report = buildReport(events, base.ts, now);
  assert.equal(report.month.views, 2);
  assert.equal(report.month.sessions, 1);
  assert.equal(report.today.views, 2);
  assert.equal(report.grid.reduce((n, r) => n + r.views, 0), 2);
  assert.deepEqual(report.month.conversions, { clicks: 1, starts: 1, successes: 1, landings: [{path: base.path, clicks: 1, starts: 1, successes: 1}] });
});

test('entry outside 7-day period is retained when attribution evidence exists in 30-day fetch', () => {
  const report = buildReport([{...base, ts: '2026-10-01T01:00:00Z'}, action('contact_success')], base.ts, now);
  assert.equal(report.week.views, 0);
  assert.equal(report.week.conversions.landings[0].path, base.path);
});

test('unknown entry and future entry are not assigned to an invented landing page', () => {
  const report = buildReport([action('contact_success'), {...base, ts: '2026-10-12T03:00:00Z'}, action('contact_start', {session: 's2'})], null, now);
  assert.deepEqual(report.month.conversions.landings, [{path:'（入口不明）', clicks:0, starts:1, successes:1}]);
});

test('actions before the month and in the future are excluded', () => {
  const report = buildReport([action('contact_click', {ts:'2026-08-01T01:00:00Z'}), action('contact_success', {ts:'2026-10-13T01:00:00Z'})], null, now);
  assert.equal(report.month.conversions.clicks, 0);
  assert.equal(report.month.conversions.successes, 0);
});

test('event kind allowlist accepts legacy clients and rejects unknown values', () => {
  assert.equal(parseEventKind(undefined), 'page_view');
  for (const kind of ['page_view','contact_click','contact_start','contact_success']) assert.equal(parseEventKind(kind), kind);
  for (const kind of [null, {}, [], 'email', '']) assert.equal(parseEventKind(kind), null);
});

test('preview does not send; production sends only safe event fields without query or form data', async () => {
  const originalWindow = globalThis.window, originalDocument = globalThis.document, originalFetch = globalThis.fetch;
  const local = new Map(), session = new Map();
  const storage = map => ({getItem: key => map.get(key), setItem: (key,value) => map.set(key,value)});
  const sent = [];
  globalThis.window = { location: {hostname:'127.0.0.1', pathname:'/'}, localStorage:storage(local), sessionStorage:storage(session) };
  globalThis.document = {referrer:'https://www.google.com/search?q=private'};
  globalThis.fetch = async (url, options) => { sent.push(JSON.parse(options.body)); return {}; };
  try {
    trackEvent('contact_start');
    assert.equal(sent.length, 0);
    window.location.hostname = 'www.allovv.com';
    trackEvent('page_view', '/guides?email=secret#contact');
    trackEvent('contact_success');
    assert.equal(sent[0].path, '/guides');
    assert.equal(sent[0].ref, 'https://www.google.com');
    assert.equal(sent[0].entry, true);
    assert.equal(sent[1].entry, false);
    assert.equal(sent[0].session, sent[1].session);
    assert.deepEqual(Object.keys(sent[1]).sort(), ['entry','kind','path','ref','session','visitor']);
  } finally {
    globalThis.window = originalWindow; globalThis.document = originalDocument; globalThis.fetch = originalFetch;
  }
});
