import { prisma } from '@/lib/db';

const STATUSES = ['Intake', 'In Review', 'Awaiting Docs', 'Approved', 'Rejected'];

export default async function DashboardPage() {
  const counts = await prisma.case.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });

  const stats = STATUSES.map((status) => {
    const match = counts.find((item) => item.status === status);
    return {
      status,
      count: match?._count.status ?? 0
    };
  });

  const total = stats.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      <section className="card">
        <h2 className="text-xl font-semibold mb-1">Dashboard</h2>
        <p className="text-sm text-slate-600">Total cases: {total}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.status} className="card">
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.status}</p>
            <p className="text-2xl font-semibold mt-2">{stat.count}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
