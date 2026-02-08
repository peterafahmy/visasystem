import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { toCSV } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const headers = ['firstName','lastName','dateOfBirth','nationality','passportNumber','phone','email','address'];
  const rows = applicants.map((applicant) => ({
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    dateOfBirth: applicant.dateOfBirth ? applicant.dateOfBirth.toISOString().slice(0, 10) : '',
    nationality: applicant.nationality,
    passportNumber: applicant.passportNumber,
    phone: applicant.phone ?? '',
    email: applicant.email ?? '',
    address: applicant.address ?? ''
  }));

  const csv = toCSV(headers, rows);

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="applicants.csv"'
    }
  });
}
