// @platform/telemetry — OpenTelemetry facade with attribute redaction by data class; never logs bodies (FE-SEC-002, §19.7).
export { redact, maskFreeText, isForbiddenKey, isEmittable, EMITTABLE_DATA_CLASSES, FORBIDDEN_KEY_SUFFIXES, EMAIL_MASK, TOKEN_MASK } from './redact';
export type { DataClass } from './redact';
export { getLogger, BASE_DATA_CLASSES } from './logger';
export type { LoggerOptions, PlatformLogger } from './logger';
