import { prisma } from './db';

export async function generateCaseId() {
  const year = new Date().getFullYear();
  const prefix = `CASE-${year}-`;
  const count = await prisma.case.count({
    where: {
      caseId: {
        startsWith: prefix
      }
    }
  });

  const nextNumber = String(count + 1).padStart(4, '0');
  return `${prefix}${nextNumber}`;
}
