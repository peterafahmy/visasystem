import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';

export default async function AppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Visa Department</p>
            <h1 className="text-lg font-semibold">Case Database</h1>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-700 hover:text-slate-900">Dashboard</Link>
            <Link href="/applicants" className="text-slate-700 hover:text-slate-900">Applicants</Link>
            <Link href="/cases" className="text-slate-700 hover:text-slate-900">Cases</Link>
            <Link href="/import-export" className="text-slate-700 hover:text-slate-900">Import/Export</Link>
            <form action="/api/auth/logout" method="post">
              <button className="btn-secondary">Sign Out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
