import { DsShowcase } from './_demo/ds-showcase';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Acme Console</h1>
      <DsShowcase />
    </main>
  );
}
