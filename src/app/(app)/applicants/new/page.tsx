import Link from 'next/link';

export default function NewApplicantPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">New Applicant</h2>
          <p className="text-sm text-slate-600">Create a new applicant profile.</p>
        </div>
        <Link href="/applicants" className="btn-secondary">Back</Link>
      </div>

      <form action="/api/applicants" method="post" className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName">First name</label>
          <input id="firstName" name="firstName" required />
        </div>
        <div>
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" name="lastName" required />
        </div>
        <div>
          <label htmlFor="passportNumber">Passport number</label>
          <input id="passportNumber" name="passportNumber" required />
        </div>
        <div>
          <label htmlFor="nationality">Nationality</label>
          <input id="nationality" name="nationality" required />
        </div>
        <div>
          <label htmlFor="dateOfBirth">Date of birth</label>
          <input id="dateOfBirth" name="dateOfBirth" type="date" />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" />
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input id="address" name="address" />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn-primary">Create Applicant</button>
          <Link href="/applicants" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
