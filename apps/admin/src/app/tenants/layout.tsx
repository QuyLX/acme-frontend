import { ForbiddenError } from '@platform/server';
import { requireTenantsRead } from '@admin/tenants';
import { forbidden } from 'next/navigation';
import type { ReactNode } from 'react';
import { currentAccess } from './access';

export default async function TenantsLayout({ children }: { children: ReactNode }) {
  try {
    await requireTenantsRead(await currentAccess());
  } catch (err) {
    if (err instanceof ForbiddenError) forbidden();
    throw err;
  }
  return <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-8">{children}</main>;
}
