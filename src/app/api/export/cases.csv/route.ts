import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toCSV } from '@/lib/csv';

export async function GET() {
  const cases = await prisma.case.findMany({
    include: { applicant: true },
    orderBy: { createdAt: 'desc' }
  });

  const headers = ['caseId','applicantPassportNumber','status','submittedAt','notes'];
  const rows = cases.map((item) => ({
    caseId: item.caseId,
    applicantPassportNumber: item.applicant.passportNumber,
    status: item.status,
    submittedAt: item.submittedAt ? item.submittedAt.toISOString().slice(0, 10) : '',
    notes: item.notes ?? ''
  }));

  const csv = toCSV(headers, rows);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="cases.csv"'
    }
  });
}
