export default function ImportExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Import / Export</h2>
        <p className="text-sm text-slate-600">Manage CSV imports and exports.</p>
      </div>

      <section className="card space-y-4">
        <h3 className="text-lg font-semibold">Export</h3>
        <div className="flex flex-col md:flex-row gap-3">
          <a className="btn-secondary" href="/api/export/applicants.csv">Download Applicants CSV</a>
          <a className="btn-secondary" href="/api/export/cases.csv">Download Cases CSV</a>
        </div>
      </section>

      <section className="card space-y-4">
        <h3 className="text-lg font-semibold">Import</h3>
        <form action="/api/import/applicants" method="post" encType="multipart/form-data" className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="applicantCsv">Applicants CSV</label>
            <input id="applicantCsv" name="file" type="file" accept=".csv" required />
          </div>
          <button type="submit" className="btn-primary">Import Applicants</button>
        </form>
        <form action="/api/import/cases" method="post" encType="multipart/form-data" className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <label htmlFor="caseCsv">Cases CSV</label>
            <input id="caseCsv" name="file" type="file" accept=".csv" required />
          </div>
          <button type="submit" className="btn-primary">Import Cases</button>
        </form>
        <div className="text-xs text-slate-500">
          Applicants CSV columns: firstName,lastName,dateOfBirth,nationality,passportNumber,phone,email,address
          <br />
          Cases CSV columns: caseId,applicantPassportNumber,status,submittedAt,notes
        </div>
      </section>
    </div>
  );
}
