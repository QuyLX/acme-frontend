import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';

// The fixture stands in for the backend: it reads scenarios from the contract, not from the module's generated code.
const spec = parse(readFileSync(new URL('../../../packages/api-codegen/fixtures/tenants.openapi.yaml', import.meta.url), 'utf8'));
const scenarios = {
  listTenants: spec.paths['/v1/tenants'].get['x-scenarios'],
  getTenant: spec.paths['/v1/tenants/{tenantId}'].get['x-scenarios'],
};

const known = scenarios.getTenant.default.body.id as string;
const secondPageId = '7c4d2e1f-3a5b-4c6d-8e9f-0a1b2c3d4e5f';
const port = Number(process.env.TENANTS_FIXTURE_PORT ?? 3099);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/v1/tenants') {
    const s = url.searchParams.get('cursor') === 'page-2' ? scenarios.listTenants.secondPage : scenarios.listTenants.firstPage;
    send(res, s.status, s.body);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/v1/tenants/00000000-0000-4000-8000-000000000503') {
    send(res, 503, { type: 'about:blank', title: 'Unavailable', status: 503 });
    return;
  }
  const detail = /^\/v1\/tenants\/([^/]+)$/.exec(url.pathname);
  if (req.method === 'GET' && detail) {
    if (detail[1] === secondPageId) {
      send(res, 200, { ...scenarios.getTenant.default.body, id: secondPageId, name: 'Contoso Synthetic', status: 'suspended' });
      return;
    }
    const found = detail[1] === known;
    const scenario = found ? scenarios.getTenant.default : scenarios.getTenant.notFound;
    send(res, scenario.status, scenario.body);
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(port, '127.0.0.1', () => {
  console.log(`fixture listening on ${port}`);
});

function send(res: import('node:http').ServerResponse, status: number, body: unknown) {
  const problem = status >= 400;
  res.writeHead(status, { 'content-type': problem ? 'application/problem+json' : 'application/json' });
  res.end(JSON.stringify(body));
}
