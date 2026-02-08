import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseCSV } from '@/lib/csv';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const content = Buffer.from(await file.arrayBuffer()).toString('utf-8');
  const rows = parseCSV(content);

  for (const row of rows) {
    const caseId = (row.caseId || '').trim();
    const passportNumber = (row.applicantPassportNumber || '').trim();
    if (!caseId || !passportNumber) continue;

    const applicant = await prisma.applicant.findUnique({
      where: { passportNumber }
    });

    if (!applicant) continue;

    await prisma.case.upsert({
      where: { caseId },
      update: {
        applicantId: applicant.id,
        status: (row.status || 'Intake').trim(),
        submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
        notes: row.notes ? row.notes.trim() : null,
        updatedById: user.id
      },
      create: {
        caseId,
        applicantId: applicant.id,
        status: (row.status || 'Intake').trim(),
        submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
        notes: row.notes ? row.notes.trim() : null,
        createdById: user.id,
        updatedById: user.id
      }
    });
  }

  return NextResponse.redirect(new URL('/import-export', req.url));
}
