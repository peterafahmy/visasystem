import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const applicant = await prisma.applicant.findUnique({
    where: { id: params.id }
  });

  if (!applicant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(applicant);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

  await prisma.applicant.update({
    where: { id: params.id },
    data: {
      firstName,
      lastName,
      passportNumber,
      nationality,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      updatedById: user.id
    }
  });

  return NextResponse.redirect(new URL('/applicants', req.url));
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const form = await req.formData();
  const method = String(form.get('_method') || '').toLowerCase();
  if (method === 'put') {
    return PUT(req, ctx);
  }
  return NextResponse.json({ error: 'Unsupported' }, { status: 405 });
}
