import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function ApplicantsPage({
  searchParams
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q?.trim() ?? '';

  const applicants = await prisma.applicant.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { passportNumber: { contains: q, mode: 'insensitive' } }
          ]
        }
      : undefined,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Applicants</h2>
          <p className="text-sm text-slate-600">Manage applicant profiles.</p>
        </div>
        <Link href="/applicants/new" className="btn-primary">New Applicant</Link>
      </div>

      <form className="card flex gap-3 items-end" method="get">
        <div className="flex-1">
          <label htmlFor="q">Search</label>
          <input id="q" name="q" placeholder="Name or passport number" defaultValue={q} />
        </div>
        <button className="btn-secondary" type="submit">Search</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Passport #</th>
              <th>Nationality</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.id}>
                <td>{applicant.firstName} {applicant.lastName}</td>
                <td>{applicant.passportNumber}</td>
                <td>{applicant.nationality}</td>
                <td>{new Date(applicant.createdAt).toLocaleDateString()}</td>
                <td className="text-right">
                  <Link className="text-slate-700 hover:text-slate-900" href={`/applicants/${applicant.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
            {applicants.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-500 py-6">No applicants found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
