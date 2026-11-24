#!/usr/bin/env node
// api-codegen --spec <openapi.yaml> --service <name> --out <dir containing __generated__>
// Writes <out>/<service>/{types,schemas,client,msw,data-classes}.ts. Output must live under a __generated__ directory
// so hand edits are caught by integrity.self-mocking (FE-TEST-004).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';
import { parse } from 'yaml';
import { generate } from '../src/generate.ts';

const { values } = parseArgs({ options: { spec: { type: 'string' }, service: { type: 'string' }, out: { type: 'string' } } });
if (!values.spec || !values.service || !values.out) {
  console.error('Usage: api-codegen --spec <openapi.yaml> --service <name> --out <.../__generated__>');
  process.exit(2);
}
if (!/(^|\/)__generated__(\/|$)/.test(values.out)) {
  console.error('--out must be inside a __generated__ directory (FE-TEST-004)');
  process.exit(2);
}
const specText = readFileSync(values.spec, 'utf8');
try {
  const files = generate(parse(specText), { service: values.service, specText, specName: basename(values.spec) });
  const dir = join(values.out, values.service);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
  console.log(`✓ ${Object.keys(files).length} files → ${dir}`);
} catch (err) {
  console.error(`✗ ${err.message}`);
  process.exit(1);
}
