'use client';
import { useState } from 'react';
import { Badge, Button, Checkbox, Dialog, DialogTrigger, Select, TextField } from '@platform/ds-react';

const regions = [
  { id: 'region-a', label: 'Region A' },
  { id: 'region-b', label: 'Region B' },
];

/** Design System smoke screen for the console app (synthetic data only). */
export function DsShowcase() {
  const [dark, setDark] = useState(false);
  return (
    <section className="flex max-w-md flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create instance</h2>
        <Badge tone="info">Preview</Badge>
      </div>
      <TextField label="Instance name" description="Lowercase letters, digits and hyphens." />
      <Select label="Region" options={regions} />
      <Checkbox>Enable monitoring</Checkbox>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          onPress={() => {
            document.documentElement.dataset.theme = dark ? 'light' : 'dark';
            setDark(!dark);
          }}
        >
          {dark ? 'Light theme' : 'Dark theme'}
        </Button>
        <DialogTrigger>
          <Button>Create</Button>
          <Dialog title="Instance requested">
            {(close) => (
              <>
                <p className="text-sm text-fg-muted">This is a design-system preview; nothing was created.</p>
                <div className="flex justify-end">
                  <Button onPress={close}>Close</Button>
                </div>
              </>
            )}
          </Dialog>
        </DialogTrigger>
      </div>
    </section>
  );
}
