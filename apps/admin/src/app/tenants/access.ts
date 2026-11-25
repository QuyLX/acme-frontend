import 'server-only';
import { cookies } from 'next/headers';
import { accessFrom, type Access } from '../../server/access';

export async function currentAccess(): Promise<Access | null> {
  return accessFrom(await cookies());
}
