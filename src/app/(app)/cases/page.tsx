import Link from 'next/link';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

const STATUSES = ['Intake', 'In Review', 'Awaiting Docs', 'Approved', 'Rejected'];

export default async function CasesPage({
  searchParams
}: {
  searchParams?: { q?: string; status?: string };
}) {
  const q = searchParams?.q?.trim() ?? '';
  const status = searchParams?.status?.trim() ?? '';

  const cases: Prisma.CaseGetPayload<{ include: { applicant: true } }>[] =
    await prisma.case.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { caseId: { contains: q, mode: 'insensitive' } },
              { applicant: { passportNumber: { contains: q, mode: 'insensitive' } } },
              { applicant: { firstName: { contains: q, mode: 'insensitive' } } },
              { applicant: { lastName: { contains: q, mode: 'insensitive' } } }
            ]
          }
        : {})
    },
    include: {
      applicant: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Cases</h2>
          <p className="text-sm text-slate-600">Track visa case progress.</p>
        </div>
        <Link href="/cases/new" className="btn-primary">New Case</Link>
      </div>

      <form className="card grid grid-cols-1 md:grid-cols-3 gap-4" method="get">
        <div>
          <label htmlFor="q">Search</label>
          <input id="q" name="q" placeholder="Case ID, name, or passport" defaultValue={q} />
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={status}>
            <option value="">All</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-3">
          <button className="btn-secondary" type="submit">Filter</button>
          <Link className="btn-secondary" href="/cases">Reset</Link>
        </div>
      </form>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Applicant</th>
              <th>Passport #</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cases.map((item) => (
              <tr key={item.id}>
                <td>{item.caseId}</td>
                <td>{item.applicant.firstName} {item.applicant.lastName}</td>
                <td>{item.applicant.passportNumber}</td>
                <td>{item.status}</td>
                <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                <td className="text-right">
                  <Link href={`/cases/${item.id}`} className="text-slate-700 hover:text-slate-900">View</Link>
                </td>
              </tr>
            ))}
            {cases.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-slate-500 py-6">No cases found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
