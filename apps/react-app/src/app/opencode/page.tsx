import { redirect } from 'next/navigation';
import { findUserById } from '@/lib/db';
import { getSession } from '@/lib/session';
import OpenCodeClient from './opencode-client';

export default async function OpenCodePage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = findUserById(session.userId);
  if (!user) redirect('/login');

  return <OpenCodeClient user={{ id: user.id, email: user.email, name: user.name }} />;
}
