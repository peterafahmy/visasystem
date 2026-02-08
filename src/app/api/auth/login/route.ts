import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSession, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get('email') || '').toLowerCase();
  const password = String(form.get('password') || '');

  if (!email || !password) {
    return NextResponse.redirect(new URL('/login?error=Missing%20credentials', req.url));
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return NextResponse.redirect(new URL('/login?error=Invalid%20credentials', req.url));
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.redirect(new URL('/login?error=Invalid%20credentials', req.url));
  }

  await createSession(user.id);
  return NextResponse.redirect(new URL('/', req.url));
}
