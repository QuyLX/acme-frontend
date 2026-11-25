// Refuse to start a production server in fixture session mode (spec 16 FL1-3).
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { sessionMode } = await import('./server/access');
  sessionMode();
}
