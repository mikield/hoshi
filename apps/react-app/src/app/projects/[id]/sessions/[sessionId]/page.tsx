import { redirect } from 'next/navigation';
import { findUserById } from '@/lib/db';
import { getSession } from '@/lib/session';
import WorkspaceClient from './workspace-client';

export default async function ProjectSessionPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = findUserById(session.userId);
  if (!user) redirect('/login');

  const { id, sessionId } = await params;
  return (
    <WorkspaceClient
      user={{ id: user.id, email: user.email, name: user.name }}
      projectId={id}
      sessionId={sessionId}
    />
  );
}
