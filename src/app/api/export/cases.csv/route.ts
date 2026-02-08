import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toCSV } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cases = await prisma.case.findMany({
    include: { applicant: true, documents: true },
    orderBy: { createdAt: 'desc' }
  });

  const headers = [
    'Title',
    'Application Date',
    'Operator',
    'Customer',
    'Customer:Phone',
    'Customer:Email',
    'Applicant Name',
    'Applicant Phone Number',
    'Applicant Email',
    'Appointment Date',
    'Applicant Type',
    'Visa Country',
    'Visa Type',
    'Embassy Fees',
    'Other Fees',
    'Empire Fees',
    'Status',
    'Passport',
    'Save Passport',
    'Attachments',
    'Calculated Cost',
    'Notes'
  ];
  const rows = cases.map((item) => {
    const passportCount = item.documents.filter((doc) => doc.docType === 'PASSPORT').length;
    const attachmentCount = item.documents.filter((doc) => doc.docType !== 'PASSPORT').length;
    return {
      'Title': item.caseId,
      'Application Date': item.applicationDate ? item.applicationDate.toISOString().slice(0, 10) : '',
      'Operator': item.operatorName ?? '',
      'Customer': item.customerName ?? '',
      'Customer:Phone': item.customerPhone ?? '',
      'Customer:Email': item.customerEmail ?? '',
      'Applicant Name': `${item.applicant.firstName} ${item.applicant.lastName}`.trim(),
      'Applicant Phone Number': item.applicant.phone ?? '',
      'Applicant Email': item.applicant.email ?? '',
      'Appointment Date': item.appointmentDate ? item.appointmentDate.toISOString().slice(0, 10) : '',
      'Applicant Type': item.applicantType ?? '',
      'Visa Country': item.visaCountry ?? '',
      'Visa Type': item.visaType ?? '',
      'Embassy Fees': item.embassyFees ?? '',
      'Other Fees': item.otherFees ?? '',
      'Empire Fees': item.empireFees ?? '',
      'Status': item.status,
      'Passport': passportCount ? `${passportCount} file(s)` : '',
      'Save Passport': passportCount ? 'True' : 'False',
      'Attachments': attachmentCount ? String(attachmentCount) : '0',
      'Calculated Cost': item.calculatedCost ?? '',
      'Notes': item.notes ?? ''
    };
  });

  const csv = toCSV(headers, rows);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="cases.csv"'
    }
  });
}
