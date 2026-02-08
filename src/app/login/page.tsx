import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';

export default async function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const user = await getSessionUser();
  if (user) {
    redirect('/');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Visa Case Database</h1>
        <p className="text-sm text-slate-600 mb-6">Sign in to continue.</p>
        {searchParams?.error ? (
          <p className="text-sm text-red-600 mb-4">{searchParams.error}</p>
        ) : null}
        <form action="/api/auth/login" method="post" className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
      </div>
    </main>
  );
}
