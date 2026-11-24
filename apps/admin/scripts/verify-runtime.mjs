// Boots the tenants fixture and the Admin app, then checks the three journey scenarios (FE §7.6 verify:runtime).
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const app = dirname(dirname(fileURLToPath(import.meta.url)));
const node = process.execPath;
const nodeOpts = ['--conditions=react-server', '--experimental-strip-types'];

function run(args, cwd) {
  return new Promise((resolve) => {
    const child = spawn(node, args, { cwd, stdio: 'inherit' });
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

const journey = await new Promise((resolve) => {
  const child = spawn('pnpm', ['exec', 'vitest', 'run', 'src/domains/tenants/server/read.journey.test.ts'], { cwd: app, stdio: 'inherit' });
  child.on('exit', (code) => resolve(code ?? 1));
});
if (journey !== 0) process.exit(journey);

const fixture = spawn(node, [...nodeOpts, 'scripts/fixture-server.ts'], {
  cwd: app,
  env: { ...process.env, TENANTS_FIXTURE_PORT: '3099' },
  stdio: 'inherit',
});
const next = spawn('pnpm', ['exec', 'next', 'dev', '--port', '3011'], {
  cwd: app,
  env: { ...process.env, TENANTS_BASE_URL: 'http://127.0.0.1:3099' },
  stdio: 'inherit',
});

const stop = () => {
  fixture.kill('SIGTERM');
  next.kill('SIGTERM');
};
process.on('exit', stop);

async function text(path) {
  const res = await fetch(`http://127.0.0.1:3011${path}`);
  return res.text();
}

try {
  let html = '';
  for (let i = 0; i < 60 && !html.includes('Northwind Synthetic'); i += 1) {
    await new Promise((r) => setTimeout(r, 1000));
    html = await text('/tenants').catch(() => '');
  }
  if (!html.includes('Northwind Synthetic')) {
    console.error('verify:runtime: staff list did not render the synthetic tenant');
    process.exit(1);
  }
  const denied = await text('/tenants?persona=no-access');
  if (!denied.includes('do not have access') || denied.includes('Northwind Synthetic')) {
    console.error('verify:runtime: no-access still shows a tenant');
    process.exit(1);
  }
  const missing = await text('/tenants/00000000-0000-4000-8000-000000000099');
  if (!missing.includes('Tenant not found')) {
    console.error('verify:runtime: unknown id did not show not-found');
    process.exit(1);
  }
  const detail = await text('/tenants/0b9e2f4c-1d1a-4a49-9a51-2f2c3d6e7a10');
  if (!detail.includes('Northwind Synthetic')) {
    console.error('verify:runtime: detail did not render the tenant');
    process.exit(1);
  }
  console.log('verify:runtime PASS admin/tenants.list');
} finally {
  stop();
}
