// OpenAPI 3.1 → server-only client, zod schemas, TS types, MSW handlers and data-class map (tech-design 05 §2–3;
// FE-API-001, FE-NEXT-001, FE-TEST-004). Supports a defined subset and fails loudly on anything else.
import { createHash } from 'node:crypto';

type Json = null | boolean | number | string | Json[] | { [k: string]: Json };
interface Schema {
  type?: string | string[];
  format?: string;
  enum?: string[];
  items?: Schema;
  properties?: Record<string, Schema>;
  required?: string[];
  $ref?: string;
  'x-data-class'?: 'public' | 'internal' | 'personal' | 'sensitive';
  [k: string]: unknown;
}
interface Parameter { name: string; in: 'path' | 'query' | 'header' | 'cookie'; required?: boolean; schema: Schema }
interface MediaType { schema: Schema }
interface OperationObject {
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: { required?: boolean; content: Record<string, MediaType> };
  responses: Record<string, { content?: Record<string, MediaType> }>;
  'x-scenarios'?: Record<string, { status: number; body?: Json }>;
}
export interface OpenAPI31Document {
  openapi: string;
  paths: Record<string, Partial<Record<'get' | 'post' | 'put' | 'patch' | 'delete', OperationObject>>>;
  components?: { schemas?: Record<string, Schema> };
}

const UNSUPPORTED = ['oneOf', 'anyOf', 'allOf', 'not', 'discriminator', 'patternProperties', 'if', 'then', 'else', 'prefixItems', 'additionalProperties'];
const FORMATS = new Set([undefined, 'uuid', 'email', 'date-time', 'date', 'int32', 'int64', 'uri']);
const METHODS = ['get', 'post', 'put', 'patch', 'delete'] as const;

export class UnsupportedOpenApiError extends Error {}
const fail = (at: string, what: string): never => {
  throw new UnsupportedOpenApiError(`Unsupported OpenAPI construct "${what}" at ${at} (tech-design 05 §3)`);
};

function refName(ref: string, at: string): string {
  const m = /^#\/components\/schemas\/([A-Za-z][A-Za-z0-9]*)$/.exec(ref);
  return m ? m[1]! : fail(at, `$ref ${ref}`);
}

function check(s: Schema, at: string): void {
  for (const k of UNSUPPORTED) if (k in s) fail(at, k);
  if (s.$ref) return void refName(s.$ref, at);
  if (!FORMATS.has(s.format)) fail(at, `format: ${s.format}`);
  const types = Array.isArray(s.type) ? s.type : [s.type];
  const base = types.filter((t) => t !== 'null');
  if (base.length !== 1) fail(at, `type: ${JSON.stringify(s.type)}`);
  if (!['object', 'array', 'string', 'integer', 'number', 'boolean'].includes(base[0]!)) fail(at, `type: ${base[0]}`);
  if (base[0] === 'array') check(s.items ?? fail(at, 'array without items'), `${at}/items`);
  for (const [p, ps] of Object.entries(s.properties ?? {})) check(ps, `${at}/properties/${p}`);
}

const nullable = (s: Schema) => Array.isArray(s.type) && s.type.includes('null');
const baseType = (s: Schema) => (Array.isArray(s.type) ? s.type.find((t) => t !== 'null') : s.type);

function tsType(s: Schema): string {
  if (s.$ref) return refName(s.$ref, '');
  let t: string;
  const b = baseType(s);
  if (s.enum) t = s.enum.map((v) => JSON.stringify(v)).join(' | ');
  else if (b === 'string') t = 'string';
  else if (b === 'integer' || b === 'number') t = 'number';
  else if (b === 'boolean') t = 'boolean';
  else if (b === 'array') t = `Array<${tsType(s.items!)}>`;
  else t = `{ ${Object.entries(s.properties ?? {}).map(([k, v]) => `${k}${s.required?.includes(k) ? '' : '?'}: ${tsType(v)}`).join('; ')} }`;
  return nullable(s) ? `${t} | null` : t;
}

function zodExpr(s: Schema): string {
  if (s.$ref) return `${refName(s.$ref, '')}Schema`;
  let z: string;
  const b = baseType(s);
  if (s.enum) z = `z.enum([${s.enum.map((v) => JSON.stringify(v)).join(', ')}])`;
  else if (b === 'string') z = s.format === 'uuid' ? 'z.uuid()' : s.format === 'email' ? 'z.email()' : s.format === 'date-time' ? 'z.iso.datetime()' : s.format === 'date' ? 'z.iso.date()' : s.format === 'uri' ? 'z.url()' : 'z.string()';
  else if (b === 'integer') z = 'z.int()';
  else if (b === 'number') z = 'z.number()';
  else if (b === 'boolean') z = 'z.boolean()';
  else if (b === 'array') z = `z.array(${zodExpr(s.items!)})`;
  else z = `z.object({ ${Object.entries(s.properties ?? {}).map(([k, v]) => `${k}: ${zodExpr(v)}${s.required?.includes(k) ? '' : '.optional()'}`).join(', ')} })`;
  return nullable(s) ? `${z}.nullable()` : z;
}

function refsOf(s: Schema, out = new Set<string>()): Set<string> {
  if (s.$ref) out.add(refName(s.$ref, ''));
  if (s.items) refsOf(s.items, out);
  for (const v of Object.values(s.properties ?? {})) refsOf(v, out);
  return out;
}

/** Topological order so every zod schema is declared before use; recursive schemas are unsupported. */
function order(schemas: Record<string, Schema>): string[] {
  const done: string[] = [];
  const visiting = new Set<string>();
  const visit = (n: string) => {
    if (done.includes(n)) return;
    if (visiting.has(n)) fail(`#/components/schemas/${n}`, 'recursive schema');
    if (!schemas[n]) fail(`#/components/schemas/${n}`, 'missing $ref target');
    visiting.add(n);
    for (const r of refsOf(schemas[n]!)) visit(r);
    visiting.delete(n);
    done.push(n);
  };
  Object.keys(schemas).sort().forEach(visit);
  return done;
}

interface Op { id: string; method: (typeof METHODS)[number]; path: string; op: OperationObject; success: { status: number; schema?: Schema } }

function operations(doc: OpenAPI31Document): Op[] {
  const ops: Op[] = [];
  for (const [path, item] of Object.entries(doc.paths).sort(([a], [b]) => a.localeCompare(b))) {
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      const at = `#/paths/${path}/${method}`;
      if (!op.operationId) fail(at, 'missing operationId');
      for (const p of op.parameters ?? []) {
        if (p.in !== 'path' && p.in !== 'query') fail(`${at}/parameters/${p.name}`, `parameter in ${p.in}`);
        check(p.schema, `${at}/parameters/${p.name}`);
      }
      if (op.requestBody) {
        const media = Object.keys(op.requestBody.content);
        if (media.length !== 1 || media[0] !== 'application/json') fail(`${at}/requestBody`, `content ${media.join(', ')}`);
        const bodySchema = op.requestBody.content['application/json']!.schema;
        if (!bodySchema.$ref) fail(`${at}/requestBody`, 'inline request schema (use a $ref to components)');
        check(bodySchema, `${at}/requestBody`);
      }
      const ok = Object.keys(op.responses).filter((s) => /^2\d\d$/.test(s)).sort();
      if (ok.length !== 1) fail(`${at}/responses`, 'exactly one 2xx response is supported');
      const okRes = op.responses[ok[0]!]!;
      const schema = okRes.content?.['application/json']?.schema;
      if (schema && !schema.$ref) fail(`${at}/responses/${ok[0]}`, 'inline response schema (use a $ref to components)');
      if (schema) check(schema, `${at}/responses/${ok[0]}`);
      ops.push({ id: op.operationId!, method, path, op, success: { status: Number(ok[0]), schema } });
    }
  }
  return ops;
}

const pascal = (s: string) => s.replace(/(^|[-_ ])(\w)/g, (_, __, c: string) => c.toUpperCase());

/** Generates the files for one service. Deterministic: same spec text → byte-identical output. */
export function generate(doc: OpenAPI31Document, o: { service: string; specText: string; specName: string }): Record<'types.ts' | 'schemas.ts' | 'client.ts' | 'msw.ts' | 'data-classes.ts', string> {
  if (!/^3\.1\./.test(doc.openapi)) fail('#/openapi', `openapi ${doc.openapi} (3.1 only)`);
  const schemas = doc.components?.schemas ?? {};
  for (const [n, s] of Object.entries(schemas)) check(s, `#/components/schemas/${n}`);
  const ops = operations(doc);
  const digest = createHash('sha256').update(o.specText).digest('hex').slice(0, 16);
  const header = `// GENERATED by @platform/api-codegen from ${o.specName} (sha256:${digest}). Do not edit: regenerate (FE-TEST-004).\n`;
  const names = order(schemas);

  const types = `${header}\n${names.map((n) => (schemas[n]!.type === 'object' ? `export interface ${n} ${tsType(schemas[n]!).replace(/; /g, ';\n  ').replace(/^\{ /, '{\n  ').replace(/ \}$/, ';\n}')}\n` : `export type ${n} = ${tsType(schemas[n]!)};\n`)).join('\n')}`;

  const zodSchemas = `${header}import { z } from 'zod';\nimport type * as T from './types';\n\n${names.map((n) => `export const ${n}Schema: z.ZodType<T.${n}> = ${zodExpr(schemas[n]!)};\n`).join('')}`;

  const clientFns = ops.map(({ id, method, path, op, success }) => {
    const pathParams = (op.parameters ?? []).filter((p) => p.in === 'path');
    const queryParams = (op.parameters ?? []).filter((p) => p.in === 'query');
    const body = op.requestBody?.content['application/json']!.schema;
    const fields = [
      pathParams.length ? `path: { ${pathParams.map((p) => `${p.name}: ${tsType(p.schema).replace(/(\w+)/g, (w) => (schemas[w] ? `T.${w}` : w))}`).join('; ')} }` : '',
      queryParams.length ? `query?: { ${queryParams.map((p) => `${p.name}?: ${tsType(p.schema).replace(/(\w+)/g, (w) => (schemas[w] ? `T.${w}` : w))}`).join('; ')} }` : '',
      body ? `body: T.${refName(body.$ref!, '')}` : '',
    ].filter(Boolean);
    const argType = fields.length ? `{ ${fields.join('; ')} }` : 'Record<string, never>';
    const optional = !pathParams.length && !body;
    const urlPath = path.slice(1).replace(/\{(\w+)\}/g, (_, p: string) => `\${encodeURIComponent(params.path.${p})}`);
    const parse = success.schema ? `(raw) => S.${refName(success.schema.$ref!, '')}Schema.parse(raw)` : '() => undefined';
    const ret = success.schema?.$ref ? `T.${refName(success.schema.$ref, '')}` : 'void';
    const opFields = [`method: '${method.toUpperCase()}'`, `path: \`${urlPath}\``];
    if (queryParams.length) opFields.push('query: params.query');
    if (body) opFields.push(`body: S.${refName(body.$ref!, '')}Schema.parse(params.body)`);
    return `    /** ${method.toUpperCase()} ${path} */\n    ${id}: async (ctx: RequestContext, params: ${argType}${optional ? ' = {}' : ''}): Promise<${ret}> =>\n      call(ctx, { ${opFields.join(', ')} }, ${parse}),`;
  });
  const client = `${header}import 'server-only';\nimport type { RequestContext, ServiceCall } from '@platform/server';\nimport * as S from './schemas';\nimport type * as T from './types';\n\n/** Server-only client for ${o.service} (FE-API-001, FE-NEXT-001). Request bodies and responses are validated. */\nexport function create${pascal(o.service)}Client(call: ServiceCall) {\n  return {\n${clientFns.join('\n')}\n  };\n}\n`;

  const scenarios: Record<string, Record<string, { status: number; body?: Json }>> = {};
  for (const { id, op, success } of ops) scenarios[id] = op['x-scenarios'] ?? { default: { status: success.status } };
  const handlers = ops.map(({ id, method, path }) => `    http.${method}(\`\${baseUrl}${path.replace(/\{(\w+)\}/g, ':$1')}\`, () => respond('${id}', scenario)),`);
  const msw = `${header}import { http, HttpResponse } from 'msw';\n\n/** Named scenarios per operation (x-scenarios). Changing an existing scenario counts as an expected-value edit. */\nexport const scenarios = ${JSON.stringify(scenarios, null, 2)} as const;\n\ntype OperationId = keyof typeof scenarios;\n\nfunction respond(op: OperationId, scenario: string) {\n  const all = scenarios[op] as Record<string, { status: number; body?: unknown }>;\n  const s = all[scenario] ?? all.default!;\n  const problem = s.status >= 400;\n  return s.body === undefined ? new HttpResponse(null, { status: s.status }) : HttpResponse.json(s.body as object, { status: s.status, headers: { 'content-type': problem ? 'application/problem+json' : 'application/json' } });\n}\n\n/** MSW handlers for every operation; \`scenario\` falls back to \`default\` per operation. */\nexport function handlers(baseUrl: string, scenario = 'default') {\n  return [\n${handlers.join('\n')}\n  ];\n}\n`;

  const classes: Record<string, string> = {};
  for (const n of names) for (const [p, ps] of Object.entries(schemas[n]!.properties ?? {})) classes[`${n}.${p}`] = ps.$ref ? 'internal' : (ps['x-data-class'] ?? 'unknown');
  const dataClasses = `${header}\n/** Data class per field (FE §18.2/§19.7): personal → confidential, sensitive → restricted, unknown → restricted. */\nexport const dataClasses = ${JSON.stringify(classes, null, 2)} as const;\n`;

  return { 'types.ts': types, 'schemas.ts': zodSchemas, 'client.ts': client, 'msw.ts': msw, 'data-classes.ts': dataClasses };
}
