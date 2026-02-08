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
    const passportNumber = (row.passportNumber || '').trim();
    if (!passportNumber) continue;

    await prisma.applicant.upsert({
      where: { passportNumber },
      update: {
        firstName: (row.firstName || '').trim(),
        lastName: (row.lastName || '').trim(),
        nationality: (row.nationality || '').trim(),
        dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
        phone: row.phone ? row.phone.trim() : null,
        email: row.email ? row.email.trim() : null,
        address: row.address ? row.address.trim() : null,
        updatedById: user.id
      },
      create: {
        firstName: (row.firstName || '').trim(),
        lastName: (row.lastName || '').trim(),
        nationality: (row.nationality || '').trim(),
        passportNumber,
        dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : null,
        phone: row.phone ? row.phone.trim() : null,
        email: row.email ? row.email.trim() : null,
        address: row.address ? row.address.trim() : null,
        createdById: user.id,
        updatedById: user.id
      }
    });
  }

  return NextResponse.redirect(new URL('/import-export', req.url));
}
