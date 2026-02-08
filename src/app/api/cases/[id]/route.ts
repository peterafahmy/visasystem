import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const visaCase = await prisma.case.findUnique({
    where: { id: params.id },
    include: { applicant: true, documents: true }
  });

  if (!visaCase) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(visaCase);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const status = String(form.get('status') || '').trim();
  const submittedAt = String(form.get('submittedAt') || '').trim();
  const notes = String(form.get('notes') || '').trim();

  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  await prisma.case.update({
    where: { id: params.id },
    data: {
      status,
      submittedAt: submittedAt ? new Date(submittedAt) : null,
      notes: notes || null,
      updatedById: user.id
    }
  });

  return NextResponse.redirect(new URL(`/cases/${params.id}`, req.url));
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const form = await req.formData();
  const method = String(form.get('_method') || '').toLowerCase();
  if (method === 'put') {
    return PUT(req, ctx);
  }
  return NextResponse.json({ error: 'Unsupported' }, { status: 405 });
}
