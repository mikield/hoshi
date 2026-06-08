import { NextResponse } from 'next/server';
import { findUserById } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = findUserById(session.userId);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
