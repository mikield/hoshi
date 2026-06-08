import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from '@/lib/db';
import { createSessionCookie } from '@/lib/session';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
  }

  const user = findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }

  await createSessionCookie({ userId: user.id, email: user.email });
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
