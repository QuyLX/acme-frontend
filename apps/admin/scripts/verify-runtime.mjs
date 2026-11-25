// Boots the tenants fixture and the Admin app, then checks the journey scenarios (FE §7.6 verify:runtime).
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const app = dirname(dirname(fileURLToPath(import.meta.url)));
const node = process.execPath;
const nodeOpts = ['--conditions=react-server', '--experimental-strip-types'];

const journey = await new Promise((resolve) => {
  const child = spawn('pnpm', ['exec', 'vitest', 'run', 'src/domains/tenants/server/read.journey.test.ts'], { cwd: app, stdio: 'inherit' });
  child.on('exit', (code) => resolve(code ?? 1));
});
if (journey !== 0) process.exit(journey);

// Production guard (FL1-3): a production build with fixture mode must fail with the guard's message.
// (access.ts cannot be imported from a bare node process: the workspace packages use extensionless imports.)
const guard = spawnSync('pnpm', ['exec', 'next', 'build'], { cwd: app, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'production', ADMIN_SESSION_MODE: 'fixture' } });
if (guard.status === 0 || !/ADMIN_SESSION_MODE=fixture/.test(`${guard.stdout}${guard.stderr}`)) {
  console.error('verify:runtime: fixture mode starts in production (FL1-3)');
  process.exit(1);
}

// Start-time guard (FL1-3): build once without fixture mode, then a production server in fixture mode must refuse to start.
const clean = spawnSync('pnpm', ['exec', 'next', 'build'], { cwd: app, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'production', ADMIN_SESSION_MODE: '' } });
if (clean.status !== 0) {
  console.error(`verify:runtime: production build without fixture mode failed\n${clean.stdout}${clean.stderr}`);
  process.exit(1);
}
// Next 16.4 keeps the process alive when register() throws and answers every request with 500, so accept either an
// exit with a non-zero code or: the message naming the variable is printed and no request is served successfully.
const startGuard = await new Promise((resolve) => {
  const child = spawn('pnpm', ['exec', 'next', 'start', '--port', '3021'], {
    cwd: app,
    detached: true,
    env: { ...process.env, NODE_ENV: 'production', ADMIN_SESSION_MODE: 'fixture', TENANTS_BASE_URL: 'http://127.0.0.1:3099' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let out = '';
  let done = false;
  const finish = (value) => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    clearInterval(poll);
    try { process.kill(-child.pid, 'SIGKILL'); } catch {}
    resolve({ ...value, out });
  };
  const timer = setTimeout(() => finish({ ok: false, why: 'timed out without the guard message' }), 30000);
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { out += d; });
  child.on('exit', (code) => finish({ ok: code !== 0, why: `exited with code ${code}` }));
  const poll = setInterval(async () => {
    if (!/ADMIN_SESSION_MODE=fixture/.test(out)) return;
    const res = await fetch('http://127.0.0.1:3021/tenants', { headers: { cookie: 'fixture_persona=staff' }, redirect: 'manual' }).catch(() => null);
    finish({ ok: !res || res.status >= 500, why: `still running; /tenants answered ${res?.status}` });
  }, 500);
});
if (!startGuard.ok || !/ADMIN_SESSION_MODE=fixture/.test(startGuard.out)) {
  console.error(`verify:runtime: production server in fixture mode was not refused, or the message did not name the variable (FL1-3): ${startGuard.why}\n${startGuard.out}`);
  process.exit(1);
}

const fixture = spawn(node, [...nodeOpts, 'scripts/fixture-server.ts'], {
  cwd: app,
  env: { ...process.env, TENANTS_FIXTURE_PORT: '3099' },
  stdio: 'inherit',
});
const next = spawn('pnpm', ['exec', 'next', 'dev', '--port', '3011'], {
  cwd: app,
  env: { ...process.env, TENANTS_BASE_URL: 'http://127.0.0.1:3099', ADMIN_SESSION_MODE: 'fixture' },
  stdio: 'inherit',
});

const stop = () => {
  fixture.kill('SIGTERM');
  next.kill('SIGTERM');
};
process.on('exit', stop);

// INTERIM (tech-design 16 §2.10 FL-X4): replaced in DC-3 by the central Playwright + axe lane.
async function get(path, persona) {
  const headers = persona ? { cookie: `fixture_persona=${persona}` } : {};
  const res = await fetch(`http://127.0.0.1:3011${path}`, { headers, redirect: 'manual' });
  return { status: res.status, headers: res.headers, html: await res.text() };
}
const fail = (msg) => { console.error(`verify:runtime: ${msg}`); stop(); process.exit(1); };
const REQUIRED = ['content-security-policy', 'strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy', 'cross-origin-opener-policy', 'x-frame-options', 'x-robots-tag'];

try {
  let r = { status: 0, html: '' };
  for (let i = 0; i < 60 && !r.html.includes('Northwind Synthetic'); i += 1) {
    await new Promise((res) => setTimeout(res, 1000));
    r = await get('/tenants', 'staff').catch(() => ({ status: 0, html: '' }));
  }
  if (r.status !== 200 || !r.html.includes('Northwind Synthetic')) fail('staff list did not render (AC-TN-1)');
  for (const h of REQUIRED) if (!r.headers.get(h)) fail(`missing header ${h}`);
  if (/unsafe-inline/.test(r.headers.get('content-security-policy'))) fail("CSP contains 'unsafe-inline'");
  if (!r.html.includes('href="/tenants?cursor=page-2"')) fail('first page has no next-page link (FL2)');
  const p2 = await get('/tenants?cursor=page-2', 'staff');
  if (!p2.html.includes('Contoso Synthetic') || p2.html.includes('Northwind Synthetic')) fail('second page is wrong (FL2-1)');
  if (/href="[^"]*cursor=/.test(p2.html)) fail('last page shows a next link (FL2-2)');
  for (const persona of ['no-access', 'root', undefined]) {
    const d = await get('/tenants', persona);
    if (d.status !== 403 || d.html.includes('Northwind Synthetic')) fail(`persona ${persona ?? '(none)'} not denied with 403 (AC-TN-2, FL1-1)`);
  }
  const legacy = await get('/tenants?persona=staff');
  if (legacy.status !== 403) fail('?persona= still grants access (FL1-2)');
  const missing = await get('/tenants/00000000-0000-4000-8000-000000000099', 'staff');
  if (missing.status !== 404) fail(`unknown id returned ${missing.status}, expected 404 (AC-TN-3, FL4-1)`);
  const broken = await get('/tenants/00000000-0000-4000-8000-000000000503', 'staff');
  // Visible text only: `next dev` serialises the error message into the RSC payload (scripts) by design; production redacts it.
  const visible = broken.html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  if (broken.status === 200 || /Unavailable|503/.test(visible)) fail('upstream failure not surfaced as an error, or its text leaks into the page (FL4-4)');
  const malformed = await get('/tenants/not-a-uuid', 'staff');
  if (malformed.status !== 404) fail(`malformed id returned ${malformed.status}, expected 404`);
  const detail = await get('/tenants/0b9e2f4c-1d1a-4a49-9a51-2f2c3d6e7a10', 'staff');
  if (detail.status !== 200 || !detail.html.includes('Northwind Synthetic')) fail('detail did not render');
  const root = await get('/', 'staff');
  if (root.status < 300 || root.status >= 400) fail('/ does not redirect (FL6-1)');
  console.log('verify:runtime PASS admin/tenants.list (interim assertions)');
} finally {
  stop();
}
