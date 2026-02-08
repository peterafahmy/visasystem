import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(applicants);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const firstName = String(form.get('firstName') || '').trim();
  const lastName = String(form.get('lastName') || '').trim();
  const passportNumber = String(form.get('passportNumber') || '').trim();
  const nationality = String(form.get('nationality') || '').trim();
  const dateOfBirth = String(form.get('dateOfBirth') || '').trim();
  const phone = String(form.get('phone') || '').trim();
  const email = String(form.get('email') || '').trim();
  const address = String(form.get('address') || '').trim();

  if (!firstName || !lastName || !passportNumber || !nationality) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await prisma.applicant.create({
    data: {
      firstName,
      lastName,
      passportNumber,
      nationality,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      createdById: user.id,
      updatedById: user.id
    }
  });

  return NextResponse.redirect(new URL('/applicants', req.url));
}
