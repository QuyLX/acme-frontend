// Attribute redaction by data class (FE-SEC-002, FE §19.7). Only `public` and `internal` attributes survive; anything
// else, including a key that has no data class, is treated as restricted and dropped. String values that survive are
// masked for emails and token-like secrets.

/** Data classes defined by FE §19.7. Any other value is treated as restricted. */
export type DataClass = 'public' | 'internal' | 'personal' | 'sensitive';

/** Data classes whose attributes may be emitted. */
export const EMITTABLE_DATA_CLASSES: readonly DataClass[] = ['public', 'internal'];

/** Keys that are never emitted, whatever their data class: request/response bodies and credentials. */
export const FORBIDDEN_KEY_SUFFIXES = ['body', 'payload', 'password', 'token', 'secret'] as const;

/** Replacement text for a masked email address. */
export const EMAIL_MASK = '[email]';
/** Replacement text for a masked token or secret. */
export const TOKEN_MASK = '[token]';

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}/gi;
const JWT = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*/g;
const AUTH_SCHEME = /\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]+/gi;
const SECRET_CANDIDATE = /[A-Za-z0-9+/_=-]{32,}/g;
const HEX = /^[0-9a-f]+$/i;

const looksLikeSecret = (candidate: string): boolean => {
  if (HEX.test(candidate)) return true;
  // Random base64/base64url material mixes all three character classes; paths and identifiers rarely do.
  return /[a-z]/.test(candidate) && /[A-Z]/.test(candidate) && /\d/.test(candidate);
};

/**
 * Whether an attribute key names a body or a credential (e.g. `body`, `request.body`, `responseBody`, `accessToken`,
 * `client_secret`). Such keys are dropped even when the data-class map says otherwise.
 */
export function isForbiddenKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  return FORBIDDEN_KEY_SUFFIXES.some((suffix) => normalized.endsWith(suffix));
}

/**
 * Masks email addresses and token-like secrets (JWTs, `Bearer`/`Basic` credentials, long hex or base64 strings) in
 * free text.
 */
export function maskFreeText(text: string): string {
  return text
    .replace(EMAIL, EMAIL_MASK)
    .replace(JWT, TOKEN_MASK)
    .replace(AUTH_SCHEME, (_match, scheme: string) => `${scheme} ${TOKEN_MASK}`)
    .replace(SECRET_CANDIDATE, (candidate) => (looksLikeSecret(candidate) ? TOKEN_MASK : candidate));
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;

const maskValue = (value: unknown): unknown => {
  if (typeof value === 'string') return maskFreeText(value);
  if (Array.isArray(value)) return value.map(maskValue);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      if (!isForbiddenKey(key)) out[key] = maskValue(nested);
    }
    return out;
  }
  return value;
};

/** Whether a data class allows the attribute to be emitted (`public` or `internal`); unknown classes are restricted. */
export function isEmittable(dataClass: string | undefined): boolean {
  return dataClass !== undefined && (EMITTABLE_DATA_CLASSES as readonly string[]).includes(dataClass);
}

/**
 * Returns a copy of `attributes` that keeps only keys whose data class in `dataClasses` is `public` or `internal`.
 * Keys classed `personal`, `sensitive`, anything else, or missing from the map (unknown, so restricted) are dropped,
 * as are body and credential keys (see {@link isForbiddenKey}). Strings in kept values are masked with
 * {@link maskFreeText}.
 */
export function redact(attributes: Record<string, unknown>, dataClasses: Record<string, string>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attributes)) {
    const dataClass = Object.hasOwn(dataClasses, key) ? dataClasses[key] : undefined;
    if (!isEmittable(dataClass) || isForbiddenKey(key)) continue;
    out[key] = maskValue(value);
  }
  return out;
}
