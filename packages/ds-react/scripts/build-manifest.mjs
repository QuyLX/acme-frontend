// Builds dist/agent-manifest.json (FE §5.6): docs, stories and contract per component, bundled with the package
// so agents read documentation matching the version in their lockfile. Node strips TypeScript types natively.
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
// Public API snapshot (ds.api-compat) gives agents the exact prop types of this version.
const api = JSON.parse(readFileSync('api/ds-react.api.json', 'utf8'));
const clausesOf = (contract) =>
  [...(contract.split('## Behavioral contract')[1]?.split('\n## ')[0] ?? '').matchAll(/^\| ([A-Z]+-\d+) \| (.+?) \| (.+?) \|$/gm)].map((m) => ({ id: m[1], invariant: m[2], basis: m[3] }));
const components = [];
for (const dir of readdirSync('src', { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const files = readdirSync(join('src', dir.name));
  const docFile = files.find((f) => f.endsWith('.doc.ts'));
  if (!docFile) continue;
  const { default: doc } = await import(pathToFileURL(join('src', dir.name, docFile)).href);
  const storyFile = files.find((f) => f.endsWith('.stories.tsx'));
  const stories = storyFile ? [...readFileSync(join('src', dir.name, storyFile), 'utf8').matchAll(/^export const (\w+)/gm)].map((m) => m[1]) : [];
  const contractPath = `docs/components/${doc.name}.contract.md`;
  const contract = readFileSync(contractPath, 'utf8');
  components.push({
    ...doc,
    contract: { id: doc.contract, status: /^status:\s*(\S+)/m.exec(contract)?.[1], path: contractPath },
    stories,
    clauses: clausesOf(contract),
    propTypes: api[`${doc.name}Props`]?.props ?? {},
    source: `src/${dir.name}/${doc.name}.tsx`,
  });
}
mkdirSync('dist', { recursive: true });
writeFileSync('dist/agent-manifest.json', `${JSON.stringify({ package: pkg.name, version: pkg.version, components }, null, 2)}\n`);
console.log(`agent-manifest: ${components.length} components`);
