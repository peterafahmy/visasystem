import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

const STATUSES = ['Intake', 'In Review', 'Awaiting Docs', 'Approved', 'Rejected'];

export default async function CaseDetailPage({
  params
}: {
  params: { id: string };
}) {
  const visaCase = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      applicant: true,
      documents: true
    }
  });

  if (!visaCase) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{visaCase.caseId}</h2>
          <p className="text-sm text-slate-600">
            {visaCase.applicant.firstName} {visaCase.applicant.lastName} — {visaCase.applicant.passportNumber}
          </p>
        </div>
        <Link href="/cases" className="btn-secondary">Back</Link>
      </div>

      <form action={`/api/cases/${visaCase.id}`} method="post" className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="hidden" name="_method" value="put" />
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={visaCase.status}>
            {STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="submittedAt">Submitted date</label>
          <input
            id="submittedAt"
            name="submittedAt"
            type="date"
            defaultValue={visaCase.submittedAt ? visaCase.submittedAt.toISOString().slice(0, 10) : ''}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" rows={4} defaultValue={visaCase.notes ?? ''} />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>

      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Documents</h3>
        </div>
        <form action={`/api/cases/${visaCase.id}/documents`} method="post" encType="multipart/form-data" className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="file">Upload document</label>
            <input id="file" name="file" type="file" required />
          </div>
          <button type="submit" className="btn-primary">Upload</button>
        </form>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {visaCase.documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.originalName}</td>
                  <td>{doc.mimeType}</td>
                  <td>{(doc.size / 1024).toFixed(1)} KB</td>
                  <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {visaCase.documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-slate-500 py-6">No documents uploaded.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
