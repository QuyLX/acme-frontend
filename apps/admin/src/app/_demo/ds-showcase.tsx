'use client';
import { Badge, Button, Dialog, DialogTrigger } from '@platform/ds-react';

const tenants = [
  { id: 't-001', name: 'Tenant Alpha', status: 'Active', tone: 'success' },
  { id: 't-002', name: 'Tenant Beta', status: 'Suspended', tone: 'danger' },
  { id: 't-003', name: 'Tenant Gamma', status: 'Pending review', tone: 'warning' },
] as const;

/** Design System smoke screen for the admin app (synthetic data only; no PII). */
export function DsShowcase() {
  return (
    <section className="flex max-w-xl flex-col gap-3 rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Tenants</h2>
      <ul className="divide-y divide-border">
        {tenants.map((t) => (
          <li key={t.id} className="flex items-center justify-between py-2 text-sm">
            <span>{t.name}</span>
            <Badge tone={t.tone}>{t.status}</Badge>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <DialogTrigger>
          <Button variant="danger" size="sm">Suspend tenant</Button>
          <Dialog title="Suspend tenant?" isDismissable={false}>
            {(close) => (
              <>
                <p className="text-sm text-fg-muted">Preview only. The real flow needs step-up auth and four-eyes approval (FE §6.2).</p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onPress={close}>Cancel</Button>
                  <Button variant="danger" onPress={close}>Suspend</Button>
                </div>
              </>
            )}
          </Dialog>
        </DialogTrigger>
      </div>
    </section>
  );
}
