import { redirect } from 'next/navigation';
import { findUserById } from '@/lib/db';
import { getSession } from '@/lib/session';
import ProjectHomeClient from './project-home-client';

export default async function ProjectHomePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = findUserById(session.userId);
  if (!user) redirect('/login');

  const { id } = await params;
  return <ProjectHomeClient user={{ id: user.id, email: user.email, name: user.name }} projectId={id} />;
}
