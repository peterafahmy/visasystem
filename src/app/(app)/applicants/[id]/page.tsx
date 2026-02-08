import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ApplicantDetailPage({
  params
}: {
  params: { id: string };
}) {
  const applicant = await prisma.applicant.findUnique({
    where: { id: params.id }
  });

  if (!applicant) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Edit Applicant</h2>
          <p className="text-sm text-slate-600">Update applicant details.</p>
        </div>
        <Link href="/applicants" className="btn-secondary">Back</Link>
      </div>

      <form action={`/api/applicants/${applicant.id}`} method="post" className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="hidden" name="_method" value="put" />
        <div>
          <label htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" defaultValue={applicant.firstName} required />
        </div>
        <div>
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" defaultValue={applicant.lastName} required />
        </div>
        <div>
          <label htmlFor="passportNumber">Passport number</label>
          <input id="passportNumber" name="passportNumber" defaultValue={applicant.passportNumber} required />
        </div>
        <div>
          <label htmlFor="nationality">Nationality</label>
          <input id="nationality" name="nationality" defaultValue={applicant.nationality} required />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of birth</label>
          <input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={applicant.dateOfBirth ? applicant.dateOfBirth.toISOString().slice(0, 10) : ''} />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" defaultValue={applicant.phone ?? ''} />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" defaultValue={applicant.email ?? ''} />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" defaultValue={applicant.address ?? ''} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn-primary">Save Changes</button>
          <Link href="/applicants" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
