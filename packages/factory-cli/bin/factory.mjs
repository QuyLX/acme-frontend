#!/usr/bin/env node
// Factory CLI v0 — standard commands (FE §7.6). Exit codes: 0 pass, 1 check failure, 2 infrastructure error.
// Schemas, check definitions and runners live in the policy repo (CORE-VER-05); this CLI only locates and calls them.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';

const repo = process.cwd();
const policyDir = resolve(process.env.FACTORY_POLICY_DIR ?? join(repo, '..', 'acme-policy'));
const policyBin = join(policyDir, 'bin', 'acme-policy.mjs');

function policy(args, input) {
  return spawnSync(process.execPath, [policyBin, ...args], { cwd: repo, encoding: 'utf8', input, maxBuffer: 64 * 1024 * 1024 });
}

function apps() {
  const dir = join(repo, 'apps');
  return existsSync(dir) ? readdirSync(dir).filter((d) => existsSync(join(dir, d, 'package.json'))) : [];
}

function doctor() {
  if (!existsSync(policyBin)) {
    console.error(`✗ policy repo not found at ${policyDir} (set FACTORY_POLICY_DIR)`);
    return 2;
  }
  const results = [];
  const add = (level, item, detail = '') => results.push({ level, item, detail });

  const nvmrc = join(repo, '.nvmrc');
  if (existsSync(nvmrc)) {
    const want = readFileSync(nvmrc, 'utf8').trim().replace(/^v/, '').split('.')[0];
    const have = process.versions.node.split('.')[0];
    add(want === have ? 'ok' : 'fail', `Node.js ${process.versions.node}`, `.nvmrc pins major ${want}; run \`nvm use\``);
  }

  for (const req of ['AGENTS.md', 'README.md']) add(existsSync(join(repo, req)) ? 'ok' : 'fail', req);
  add(existsSync(join(repo, 'CODEOWNERS')) || existsSync(join(repo, '.github', 'CODEOWNERS')) ? 'ok' : 'warn', 'CODEOWNERS', 'missing — needs owner identities on the Git platform (D-01)');

  for (const app of apps()) {
    const base = join('apps', app);
    const descriptor = join(base, 'factory.yaml');
    if (!existsSync(join(repo, descriptor))) {
      add('fail', descriptor, 'missing (FE §7.2, DV-02)');
      continue;
    }
    const v = policy(['validate', '--schema', 'factory-config', descriptor]);
    add(v.status === 0 ? 'ok' : 'fail', `${descriptor} schema`, v.status === 0 ? '' : v.stderr.trim());
    const cfg = parseYaml(readFileSync(join(repo, descriptor), 'utf8'));
    if (cfg.application !== app) add('fail', `${descriptor} application`, `"${cfg.application}" ≠ folder "${app}"`);
    const backups = (cfg.backupOwners ?? []).filter((o) => o !== cfg.owner);
    add(backups.length ? 'ok' : 'fail', `${descriptor} owners`, backups.length ? '' : 'no backup owner distinct from owner (CORE-KNW-03)');
    add((cfg.autonomy?.zeroHumanOptIn ?? []).length === 0 ? 'ok' : 'fail', `${descriptor} autonomy`, 'zero-human merge must stay off in pilot mode');
    if (!cfg.surfaces?.length) add('warn', `${descriptor} surfaces`, 'none declared (pending D-12); every path is High');
    if (cfg.apiVersion !== 'aisf/4.0') add('warn', `${descriptor} apiVersion`, `"${cfg.apiVersion}" (D-13 open)`);
    for (const f of ['AGENTS.md', 'REVIEW.md']) {
      const p = join(repo, base, f);
      if (!existsSync(p)) add('fail', join(base, f), 'missing');
      else if (f === 'REVIEW.md' && /DRAFT/.test(readFileSync(p, 'utf8'))) add('warn', join(base, f), 'still a DRAFT: must be written by code owners (CORE-KNW-02)');
      else add('ok', join(base, f));
    }
  }

  const sync = policy(['sync', '--repo', repo, '--check']);
  add(sync.status === 0 ? 'ok' : 'fail', 'generated config in sync with the pinned presets', (sync.stdout + sync.stderr).trim().replace(/\n/g, '; ') + ' — run `pnpm factory sync`');

  // Knowledge records and descriptors: the policy repo's checks, not a second implementation here.
  const k = policy(['run', '--repo', repo, '--base', baseRef(), '--checks', 'knowledge.record-schema,meta.descriptor-drift']);
  if (!k.stdout) add('fail', 'knowledge records and descriptors', k.stderr.trim());
  else {
    for (const c of JSON.parse(k.stdout).checks) {
      const loud = c.findings.filter((f) => f.severity !== 'INFO' || c.checkId === 'knowledge.record-schema');
      const label = c.checkId === 'knowledge.record-schema' ? `knowledge records (${c.extensions?.['x-invalid'] ?? 0} invalid)` : 'descriptors match the repository';
      add(c.status !== 'PASS' || (c.checkId === 'knowledge.record-schema' && loud.length) ? 'fail' : 'ok', label, loud.map((f) => `${f.location}: ${f.message}`).join('; '));
    }
  }

  const icon = { ok: '✓', warn: '⚠', fail: '✗' };
  for (const r of results) console.log(`${icon[r.level]} ${r.item}${r.detail && r.level !== 'ok' ? ` — ${r.detail}` : ''}`);
  const fails = results.filter((r) => r.level === 'fail').length;
  const warns = results.filter((r) => r.level === 'warn').length;
  console.log(`\n${fails} failing, ${warns} warnings. Policy: ${policyDir}`);
  return fails ? 1 : 0;
}

function baseRef() {
  const EMPTY_TREE = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
  return process.env.FACTORY_BASE ?? (hasHead() ? 'HEAD' : EMPTY_TREE);
}

function hasHead() {
  return spawnSync('git', ['rev-parse', '--verify', 'HEAD'], { cwd: repo }).status === 0;
}

function verify(command) {
  if (!existsSync(policyBin)) {
    console.error(`✗ policy repo not found at ${policyDir} (set FACTORY_POLICY_DIR)`);
    return 2;
  }
  const base = baseRef();
  const sodInput = process.env.FACTORY_SOD_INPUT;
  // The policy repo decides which checks a standard command runs (registry/commands.yaml); the CLI only names it.
  const args = ['run', '--repo', repo, '--base', base, '--command', command];
  if (sodInput) args.push('--sod-input', resolve(sodInput));
  const r = policy(args);
  if (!r.stdout) {
    console.error(r.stderr);
    return 2;
  }
  const run = JSON.parse(r.stdout);
  for (const c of run.checks) {
    console.log(`${c.status.padEnd(12)} ${c.checkId} (${c.enforcement}, ${c.durationMs} ms)${c.reason ? `\n             ${c.reason.split('\n')[0]}` : ''}`);
    for (const f of c.findings ?? []) console.log(`             · [${f.ruleId ?? f.source}] ${f.location ?? ''} ${f.message}`);
  }
  console.log(`\nexecutor: ${run.environment.executor} · verifier: ${run.provenance.verifierRef}`);
  if (!sodInput) console.log('note: policy.sod needs PR event input; it runs in the mandatory pipeline (set FACTORY_SOD_INPUT to run it locally).');
  if (run.environment.executor === 'local') console.log('note: evidence from a local executor never satisfies a required check (CORE-VER-14); CI must re-run.');
  return r.status ?? 2;
}

function sync(args) {
  if (!existsSync(policyBin)) {
    console.error(`✗ policy repo not found at ${policyDir} (set FACTORY_POLICY_DIR)`);
    return 2;
  }
  const r = policy(['sync', '--repo', repo, ...args]);
  process.stdout.write(r.stdout);
  process.stderr.write(r.stderr);
  return r.status ?? 2;
}

function passthrough(args) {
  if (!existsSync(policyBin)) {
    console.error(`✗ policy repo not found at ${policyDir} (set FACTORY_POLICY_DIR)`);
    return 2;
  }
  const r = policy(args);
  process.stdout.write(r.stdout);
  process.stderr.write(r.stderr);
  return r.status ?? 2;
}

const command = process.argv[2];
const code =
  command === 'doctor' ? doctor()
  : command === 'sync' ? sync(process.argv.slice(3))
  : command === 'generate' ? passthrough(['generate', ...process.argv.slice(3), '--repo', repo])
  : command === 'verify:fast' || command === 'verify' ? verify(command)
  : (console.log('Usage: factory <doctor | sync [--check] | generate <package|ds-component> <name> [...] | verify:fast | verify>'), command ? 2 : 0);
process.exitCode = code;
