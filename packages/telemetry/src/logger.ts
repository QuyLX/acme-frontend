// Logger facade over the OpenTelemetry API (FE-SEC-002). Every record goes through `redact`; there is no parameter for
// request or response bodies, and body/credential keys are dropped before anything reaches OpenTelemetry.
import { logs, SeverityNumber, trace, type Attributes } from '@opentelemetry/api';
import { maskFreeText, redact } from './redact';

/**
 * Data classes of attributes that every logger may emit without a per-call map. Product code adds its own map (for
 * example the `data-classes.ts` emitted by `@platform/api-codegen`) through {@link LoggerOptions.dataClasses}.
 */
export const BASE_DATA_CLASSES: Readonly<Record<string, string>> = {
  requestId: 'internal',
  service: 'internal',
  operation: 'internal',
  status: 'internal',
  durationMs: 'internal',
};

/** Options for {@link getLogger}. */
export interface LoggerOptions {
  /** Attribute key → data class (`public` | `internal` | `personal` | `sensitive`); merged over {@link BASE_DATA_CLASSES}. */
  dataClasses?: Record<string, string>;
}

/** A scoped logger. Attributes are always redacted; messages are masked for emails and tokens. */
export interface PlatformLogger {
  /** Emits an INFO record and an event on the active span. */
  info(msg: string, attrs?: object): void;
  /** Emits an ERROR record and an event on the active span. */
  error(msg: string, attrs?: object): void;
}

/**
 * Returns a logger for `scope` that emits through the global OpenTelemetry `LoggerProvider` and adds an event to the
 * active span, if any. Without a registered provider both are no-ops.
 */
export function getLogger(scope: string, options: LoggerOptions = {}): PlatformLogger {
  const dataClasses = { ...BASE_DATA_CLASSES, ...options.dataClasses };
  const otelLogger = logs.getLogger(scope);

  const emit = (severityNumber: SeverityNumber, severityText: string, msg: string, attrs: object | undefined): void => {
    const attributes: Attributes = redact({ ...attrs }, dataClasses);
    const message = maskFreeText(msg);
    otelLogger.emit({ severityNumber, severityText, body: message, attributes });
    trace.getActiveSpan()?.addEvent(message, { ...attributes, 'log.severity': severityText });
  };

  return {
    info: (msg, attrs) => emit(SeverityNumber.INFO, 'INFO', msg, attrs),
    error: (msg, attrs) => emit(SeverityNumber.ERROR, 'ERROR', msg, attrs),
  };
}
