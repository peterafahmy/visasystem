import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import type { Prisma } from '@prisma/client';

const STATUSES = ['Intake', 'In Review', 'Awaiting Docs', 'Approved', 'Rejected'];

export const dynamic = 'force-dynamic';

export default async function CaseDetailPage({
  params
}: {
  params: { id: string };
}) {
  const visaCase: Prisma.CaseGetPayload<{
    include: { applicant: true; documents: true };
  }> | null = await prisma.case.findUnique({
    where: { id: params.id },
    include: {
      applicant: true,
      documents: true
    }
  });

  if (!visaCase) return notFound();

  const passportDocs = visaCase.documents.filter((doc) => doc.docType === 'PASSPORT');
  const otherDocs = visaCase.documents.filter((doc) => doc.docType !== 'PASSPORT');

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
          <label htmlFor="applicationDate">Application date</label>
          <input
            id="applicationDate"
            name="applicationDate"
            type="date"
            defaultValue={visaCase.applicationDate ? visaCase.applicationDate.toISOString().slice(0, 10) : ''}
          />
        </div>
        <div>
          <label htmlFor="operatorName">Operator</label>
          <input id="operatorName" name="operatorName" defaultValue={visaCase.operatorName ?? ''} />
        </div>
        <div>
          <label htmlFor="customerName">Customer</label>
          <input id="customerName" name="customerName" defaultValue={visaCase.customerName ?? ''} />
        </div>
        <div>
          <label htmlFor="customerPhone">Customer phone</label>
          <input id="customerPhone" name="customerPhone" defaultValue={visaCase.customerPhone ?? ''} />
        </div>
        <div>
          <label htmlFor="customerEmail">Customer email</label>
          <input id="customerEmail" name="customerEmail" type="email" defaultValue={visaCase.customerEmail ?? ''} />
        </div>
        <div>
          <label htmlFor="appointmentDate">Appointment date</label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            defaultValue={visaCase.appointmentDate ? visaCase.appointmentDate.toISOString().slice(0, 10) : ''}
          />
        </div>
        <div>
          <label htmlFor="applicantType">Applicant type</label>
          <select id="applicantType" name="applicantType" defaultValue={visaCase.applicantType ?? ''}>
            <option value="">Select type</option>
            <option value="Adult">Adult</option>
            <option value="Child">Child</option>
            <option value="Infant">Infant</option>
          </select>
        </div>
        <div>
          <label htmlFor="visaCountry">Visa country</label>
          <input id="visaCountry" name="visaCountry" defaultValue={visaCase.visaCountry ?? ''} />
        </div>
        <div>
          <label htmlFor="visaType">Visa type</label>
          <input id="visaType" name="visaType" defaultValue={visaCase.visaType ?? ''} />
        </div>
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
        <div>
          <label htmlFor="embassyFees">Embassy fees</label>
          <input id="embassyFees" name="embassyFees" defaultValue={visaCase.embassyFees ?? ''} />
        </div>
        <div>
          <label htmlFor="otherFees">Other fees</label>
          <input id="otherFees" name="otherFees" defaultValue={visaCase.otherFees ?? ''} />
        </div>
        <div>
          <label htmlFor="empireFees">Empire fees</label>
          <input id="empireFees" name="empireFees" defaultValue={visaCase.empireFees ?? ''} />
        </div>
        <div>
          <label htmlFor="calculatedCost">Calculated cost</label>
          <input id="calculatedCost" name="calculatedCost" defaultValue={visaCase.calculatedCost ?? ''} />
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
          <h3 className="text-lg font-semibold">Passport Copies</h3>
        </div>
        <form action={`/api/cases/${visaCase.id}/documents`} method="post" encType="multipart/form-data" className="flex flex-col md:flex-row gap-3 items-end">
          <input type="hidden" name="docType" value="PASSPORT" />
          <div className="flex-1">
            <label htmlFor="passportFile">Upload passport copy</label>
            <input id="passportFile" name="file" type="file" required />
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
              {passportDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.originalName}</td>
                  <td>{doc.mimeType}</td>
                  <td>{(doc.size / 1024).toFixed(1)} KB</td>
                  <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {passportDocs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-slate-500 py-6">No documents uploaded.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Attachments</h3>
        </div>
        <form action={`/api/cases/${visaCase.id}/documents`} method="post" encType="multipart/form-data" className="flex flex-col md:flex-row gap-3 items-end">
          <input type="hidden" name="docType" value="ATTACHMENT" />
          <div className="flex-1">
            <label htmlFor="attachmentFile">Upload attachment</label>
            <input id="attachmentFile" name="file" type="file" required />
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
              {otherDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.originalName}</td>
                  <td>{doc.mimeType}</td>
                  <td>{(doc.size / 1024).toFixed(1)} KB</td>
                  <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {otherDocs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-slate-500 py-6">No attachments uploaded.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
