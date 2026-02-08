import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { generateCaseId } from '@/lib/caseId';

export async function GET() {
  const cases = await prisma.case.findMany({
    include: { applicant: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(cases);
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const applicantId = String(form.get('applicantId') || '').trim();
  const status = String(form.get('status') || 'Intake').trim();
  const submittedAt = String(form.get('submittedAt') || '').trim();
  const notes = String(form.get('notes') || '').trim();

  if (!applicantId) {
    return NextResponse.json({ error: 'Missing applicant' }, { status: 400 });
  }

  const caseId = await generateCaseId();

  await prisma.case.create({
    data: {
      caseId,
      applicantId,
      status,
      submittedAt: submittedAt ? new Date(submittedAt) : null,
      notes: notes || null,
      createdById: user.id,
      updatedById: user.id
    }
  });

  return NextResponse.redirect(new URL('/cases', req.url));
}
