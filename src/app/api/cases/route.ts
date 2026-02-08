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
  const applicationDate = String(form.get('applicationDate') || '').trim();
  const operatorName = String(form.get('operatorName') || '').trim();
  const customerName = String(form.get('customerName') || '').trim();
  const customerPhone = String(form.get('customerPhone') || '').trim();
  const customerEmail = String(form.get('customerEmail') || '').trim();
  const appointmentDate = String(form.get('appointmentDate') || '').trim();
  const applicantType = String(form.get('applicantType') || '').trim();
  const visaCountry = String(form.get('visaCountry') || '').trim();
  const visaType = String(form.get('visaType') || '').trim();
  const embassyFees = String(form.get('embassyFees') || '').trim();
  const otherFees = String(form.get('otherFees') || '').trim();
  const empireFees = String(form.get('empireFees') || '').trim();
  const calculatedCost = String(form.get('calculatedCost') || '').trim();

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

  return NextResponse.redirect(new URL('/cases', req.url));
}
