import { readTenant, type Persona } from '@admin/tenants';
import Link from 'next/link';

function personaFrom(value: string | undefined): Persona {
  return value === 'no-access' ? 'no-access' : 'staff';
}

export default async function TenantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ tenantId: string }>;
  searchParams: Promise<{ persona?: string }>;
}) {
  const { tenantId } = await params;
  const persona = personaFrom((await searchParams).persona);
  const result = await readTenant(persona, tenantId);
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <Link href={persona === 'no-access' ? '/tenants?persona=no-access' : '/tenants'}>Tenants</Link>
      {result.kind === 'denied' ? <p>You do not have access to tenants.</p> : null}
      {result.kind === 'not-found' ? <p>Tenant not found.</p> : null}
      {result.kind === 'ok' ? (
        <section>
          <h1 className="text-2xl font-semibold">{result.tenant.name}</h1>
          <p>{result.tenant.status}</p>
        </section>
      ) : null}
    </main>
  );
}
