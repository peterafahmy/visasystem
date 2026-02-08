import Link from 'next/link';
import { prisma } from '@/lib/db';

const STATUSES = ['Intake', 'In Review', 'Awaiting Docs', 'Approved', 'Rejected'];

export const dynamic = 'force-dynamic';

export default async function NewCasePage() {
  const applicants = await prisma.applicant.findMany({
    orderBy: { lastName: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">New Case</h2>
          <p className="text-sm text-slate-600">Create a visa case.</p>
        </div>
        <Link href="/cases" className="btn-secondary">Back</Link>
      </div>

      <form action="/api/cases" method="post" className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="applicantId">Applicant</label>
          <select id="applicantId" name="applicantId" required>
            <option value="">Select an applicant</option>
            {applicants.map((applicant) => (
              <option key={applicant.id} value={applicant.id}>
                {applicant.firstName} {applicant.lastName} — {applicant.passportNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="Intake">
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="submittedAt">Submitted date</label>
          <input id="submittedAt" name="submittedAt" type="date" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={4} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn-primary">Create Case</button>
          <Link href="/cases" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
