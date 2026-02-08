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

  if (!status) {
    return NextResponse.json({ error: 'Missing status' }, { status: 400 });
  }

  await prisma.case.update({
    where: { id: params.id },
    data: {
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
