import { redirect } from 'next/navigation';
import { findUserById } from '@/lib/db';
import { getSession } from '@/lib/session';
import ProjectsClient from './projects-client';

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = findUserById(session.userId);
  if (!user) redirect('/login');

  return <ProjectsClient user={{ id: user.id, email: user.email, name: user.name }} />;
}
