import { INVALID_SPAN_CONTEXT, logs, trace, type LogRecord } from '@opentelemetry/api';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { EMAIL_MASK, getLogger } from '../src/index';

// A test LoggerProvider that captures every record emitted through the global OpenTelemetry logs API.
const records: LogRecord[] = [];
beforeAll(() => {
  logs.setGlobalLoggerProvider({ getLogger: () => ({ emit: (record) => void records.push(record), enabled: () => true }) });
});
afterAll(() => logs.disable());
beforeEach(() => {
  records.length = 0;
});
afterEach(() => vi.restoreAllMocks());

const DATA_CLASSES = { 'tenant.id': 'internal', 'user.email': 'personal', body: 'public', password: 'public', note: 'public' };

describe('getLogger', () => {
  test('emits through the OpenTelemetry logs API with redacted attributes', () => {
    getLogger('tenants', { dataClasses: DATA_CLASSES }).info('tenant loaded', { 'tenant.id': 't-001', 'user.email': 'a@b.example', requestId: 'req-1' });
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({ severityText: 'INFO', body: 'tenant loaded', attributes: { 'tenant.id': 't-001', requestId: 'req-1' } });
    expect(records[0]?.attributes).not.toHaveProperty('user.email');
  });

  test('never emits a password or body attribute, even when they are classed public', () => {
    const log = getLogger('auth', { dataClasses: DATA_CLASSES });
    log.error('login failed', { password: 'synthetic-pass', body: '{"password":"synthetic-pass"}', 'tenant.id': 't-001' });
    log.info('saved', { body: { name: 'x' }, payload: 'x' });
    for (const record of records) {
      expect(Object.keys(record.attributes ?? {})).not.toContain('password');
      expect(Object.keys(record.attributes ?? {})).not.toContain('body');
      expect(JSON.stringify(record)).not.toContain('synthetic-pass');
    }
    expect(records.map((r) => r.severityText)).toEqual(['ERROR', 'INFO']);
  });

  test('drops every attribute that has no data class', () => {
    getLogger('x').info('m', { anything: 'v' });
    expect(records[0]?.attributes).toEqual({});
  });

  test('masks emails in the message and in kept free text', () => {
    getLogger('x', { dataClasses: DATA_CLASSES }).info('sent to a@b.example', { note: 'cc c@d.example' });
    expect(records[0]).toMatchObject({ body: `sent to ${EMAIL_MASK}`, attributes: { note: `cc ${EMAIL_MASK}` } });
  });

  test('adds a redacted event to the active span', () => {
    const span = trace.wrapSpanContext(INVALID_SPAN_CONTEXT);
    const addEvent = vi.spyOn(span, 'addEvent');
    vi.spyOn(trace, 'getActiveSpan').mockReturnValue(span);
    getLogger('x', { dataClasses: DATA_CLASSES }).error('boom', { 'tenant.id': 't-001', password: 'p', 'user.email': 'a@b.example' });
    expect(addEvent).toHaveBeenCalledWith('boom', { 'tenant.id': 't-001', 'log.severity': 'ERROR' });
  });
});
