// Drift checks of FE §5.6 for this package: every public component has doc, stories, tests and a Contract Spec;
// the doc references its contract by id; every verification-map clause has a test.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { describe, expect, test } from 'vitest';

const root = process.cwd(); // vitest runs from the package root
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const exported = [...read('src/index.ts').matchAll(/^export \{ (\w+)/gm)].map((m) => m[1]!);
const dirs = readdirSync(join(root, 'src'), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

describe.each(dirs)('component folder %s', (dir) => {
  const files = readdirSync(join(root, 'src', dir));
  const name = files.find((f) => f.endsWith('.doc.ts'))?.replace('.doc.ts', '') ?? '(missing .doc.ts)';

  test('has component, doc, stories and test files', () => {
    for (const suffix of ['.tsx', '.doc.ts', '.stories.tsx', '.test.tsx']) expect(files).toContain(`${name}${suffix}`);
  });

  test('is exported from the package entry point', () => {
    expect(exported).toContain(name);
  });

  test('doc references an existing Contract Spec with the same id', () => {
    const contractPath = `docs/components/${name}.contract.md`;
    expect(existsSync(join(root, contractPath)), contractPath).toBe(true);
    const contractId = /^id:\s*(\S+)/m.exec(read(contractPath))?.[1];
    const docContract = /contract:\s*'([^']+)'/.exec(read(`src/${dir}/${name}.doc.ts`))?.[1];
    expect(docContract).toBe(contractId);
  });

  test('every verification-map clause has a test', () => {
    const contract = read(`docs/components/${name}.contract.md`);
    const map = contract.split('## Verification map')[1]?.split('\n## ')[0] ?? '';
    const clauses = [...map.matchAll(/^\| ([A-Z]+-\d+) \|/gm)].map((m) => m[1]!);
    expect(clauses.length, 'verification map has no clauses').toBeGreaterThan(0);
    const tests = read(`src/${dir}/${name}.test.tsx`);
    for (const clause of clauses) expect(tests, `no test for ${clause}`).toContain(clause);
  });
});
