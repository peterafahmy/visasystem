import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const [email, password, name] = process.argv.slice(2);

if (!email || !password) {
  console.error('Usage: npm run create-user -- <email> <password> [name]');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

await prisma.user.upsert({
  where: { email },
  update: {
    passwordHash: hash,
    name: name || null
  },
  create: {
    email,
    passwordHash: hash,
    name: name || null
  }
});

console.log(`User ready: ${email}`);
await prisma.$disconnect();
