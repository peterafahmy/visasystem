import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseCSV } from '@/lib/csv';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';

function getValue(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
      return String(row[key]).trim();
    }
  }
  return '';
}

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
    const caseId = getValue(row, ['caseId', 'Title']).trim();
    const passportNumber = getValue(row, ['applicantPassportNumber', 'Passport Number', 'PassportNumber', 'Passport']).trim();
    if (!caseId || !passportNumber) continue;

    const applicant = await prisma.applicant.findUnique({
      where: { passportNumber }
    });

    if (!applicant) continue;

    const status = getValue(row, ['status', 'Status']) || 'Intake';
    const submittedAt = getValue(row, ['submittedAt', 'Submitted Date', 'SubmittedAt']);
    const notes = getValue(row, ['notes', 'Notes']);
    const applicationDate = getValue(row, ['Application Date', 'applicationDate']);
    const operatorName = getValue(row, ['Operator', 'operatorName']);
    const customerName = getValue(row, ['Customer', 'customerName']);
    const customerPhone = getValue(row, ['Customer:Phone', 'customerPhone']);
    const customerEmail = getValue(row, ['Customer:Email', 'customerEmail']);
    const appointmentDate = getValue(row, ['Appointment Date', 'appointmentDate']);
    const applicantType = getValue(row, ['Applicant Type', 'applicantType']);
    const visaCountry = getValue(row, ['Visa Country', 'visaCountry']);
    const visaType = getValue(row, ['Visa Type', 'visaType']);
    const embassyFees = getValue(row, ['Embassy Fees', 'embassyFees']);
    const otherFees = getValue(row, ['Other Fees', 'otherFees']);
    const empireFees = getValue(row, ['Empire Fees', 'empireFees']);
    const calculatedCost = getValue(row, ['Calculated Cost', 'calculatedCost']);

    await prisma.case.upsert({
      where: { caseId },
      update: {
        applicantId: applicant.id,
        status,
        submittedAt: submittedAt ? new Date(submittedAt) : null,
        notes: notes || null,
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        operatorName: operatorName || null,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
        applicantType: applicantType || null,
        visaCountry: visaCountry || null,
        visaType: visaType || null,
        embassyFees: embassyFees || null,
        otherFees: otherFees || null,
        empireFees: empireFees || null,
        calculatedCost: calculatedCost || null,
        updatedById: user.id
      },
      create: {
        caseId,
        applicantId: applicant.id,
        status,
        submittedAt: submittedAt ? new Date(submittedAt) : null,
        notes: notes || null,
        applicationDate: applicationDate ? new Date(applicationDate) : null,
        operatorName: operatorName || null,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        customerEmail: customerEmail || null,
        appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
        applicantType: applicantType || null,
        visaCountry: visaCountry || null,
        visaType: visaType || null,
        embassyFees: embassyFees || null,
        otherFees: otherFees || null,
        empireFees: empireFees || null,
        calculatedCost: calculatedCost || null,
        createdById: user.id,
        updatedById: user.id
      }
    });
  }

  return NextResponse.redirect(new URL('/import-export', req.url));
}
