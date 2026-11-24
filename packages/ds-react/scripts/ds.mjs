#!/usr/bin/env node
// DS CLI for agents and people (FE §5.3 item 2; MCP later): reads dist/agent-manifest.json of THIS package version.
//   node scripts/ds.mjs list               name, status, contract status, summary
//   node scripts/ds.mjs show <Name>        summary, props (typed), do/don't, contract clauses, stories
//   node scripts/ds.mjs search <text>      components whose name, summary or props mention <text>
import { existsSync, readFileSync } from 'node:fs';

if (!existsSync('dist/agent-manifest.json')) {
  console.error('dist/agent-manifest.json missing: run `pnpm --filter @platform/ds-react build` first');
  process.exit(2);
}
const { package: pkg, version, components } = JSON.parse(readFileSync('dist/agent-manifest.json', 'utf8'));
const [cmd, arg] = process.argv.slice(2);

if (cmd === 'list') {
  console.log(`${pkg}@${version} — ${components.length} components`);
  for (const c of components) console.log(`${c.name.padEnd(14)} ${c.status.padEnd(12)} ${c.contract.status.padEnd(9)} ${c.summary}`);
} else if (cmd === 'show' && arg) {
  const c = components.find((x) => x.name.toLowerCase() === arg.toLowerCase());
  if (!c) {
    console.error(`no component ${arg}; try: node scripts/ds.mjs list`);
    process.exit(1);
  }
  console.log(`${c.name} (${c.status}) — ${c.summary}\nPattern: ${c.a11yPattern}\nContract: ${c.contract.id} ${c.contract.status} (${c.contract.path})\n\nProps:`);
  for (const [name, t] of Object.entries(c.propTypes)) if (c.props[name]) console.log(`  ${name}${t.optional ? '?' : ''}: ${t.type}\n      ${c.props[name]}`);
  console.log(`  (+ ${Object.keys(c.propTypes).length - Object.keys(c.props).length} inherited React Aria props; see api/ds-react.api.json)`);
  console.log(`\nDo:\n${c.do.map((d) => `  - ${d}`).join('\n')}\nDon't:\n${c.dont.map((d) => `  - ${d}`).join('\n')}`);
  console.log(`\nContract clauses:\n${c.clauses.map((k) => `  ${k.id}: ${k.invariant}`).join('\n')}\n\nStories: ${c.stories.join(', ')}`);
} else if (cmd === 'search' && arg) {
  const q = arg.toLowerCase();
  for (const c of components) {
    const hit = [c.name, c.summary, ...Object.keys(c.props), ...Object.values(c.props)].some((t) => String(t).toLowerCase().includes(q));
    if (hit) console.log(`${c.name.padEnd(14)} ${c.summary}`);
  }
} else {
  console.log('Usage: node scripts/ds.mjs <list | show <Name> | search <text>>');
  process.exit(cmd ? 2 : 0);
}
