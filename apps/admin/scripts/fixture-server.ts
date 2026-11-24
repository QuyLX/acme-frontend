import { createServer } from 'node:http';
import { scenarios } from '../src/domains/tenants/server/__generated__/tenants/msw.ts';

const known = (scenarios.getTenant.default.body as { id: string }).id;
const port = Number(process.env.TENANTS_FIXTURE_PORT ?? 3099);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (req.method === 'GET' && url.pathname === '/v1/tenants') {
    send(res, scenarios.listTenants.default.status, scenarios.listTenants.default.body);
    return;
  }
  const detail = /^\/v1\/tenants\/([^/]+)$/.exec(url.pathname);
  if (req.method === 'GET' && detail) {
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
