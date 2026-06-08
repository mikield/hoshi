import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (typeof email !== 'string' || typeof password !== 'string' || !email.includes('@') || password.length < 8) {
    return NextResponse.json({ error: 'Enter a valid email and a password with at least 8 characters.' }, { status: 400 });
  }

  if (findUserByEmail(email)) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = createUser(email, passwordHash, typeof name === 'string' && name.trim() ? name.trim() : null);

  await createSessionCookie({ userId: user.id, email: user.email });
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
