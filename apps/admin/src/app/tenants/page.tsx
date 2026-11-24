import { readTenantList, type Persona } from '@admin/tenants';
import Link from 'next/link';

function personaFrom(value: string | undefined): Persona {
  return value === 'no-access' ? 'no-access' : 'staff';
}

export default async function TenantsPage({ searchParams }: { searchParams: Promise<{ persona?: string }> }) {
  const params = await searchParams;
  const persona = personaFrom(params.persona);
  const result = await readTenantList(persona);
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Tenants</h1>
      {result.kind === 'denied' ? (
        <p>You do not have access to tenants.</p>
      ) : result.items.length === 0 ? (
        <p>No tenants.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {result.items.map((tenant) => (
            <li key={tenant.id}>
              <Link href={`/tenants/${tenant.id}${persona === 'no-access' ? '?persona=no-access' : ''}`}>{tenant.name}</Link>
              <span> {tenant.status}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
