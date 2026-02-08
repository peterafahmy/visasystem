import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const docs = await prisma.document.findMany({
    where: { caseId: params.id },
    orderBy: { uploadedAt: 'desc' }
  });
  return NextResponse.json(docs);
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  const uploadRoot = process.env.UPLOAD_DIR || '/data/uploads';
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const caseDir = path.join(uploadRoot, params.id);
  await fs.mkdir(caseDir, { recursive: true });

  const filename = `${Date.now()}-${safeName}`;
  const storagePath = path.join(caseDir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(storagePath, buffer);

  await prisma.document.create({
    data: {
      caseId: params.id,
      filename,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      storagePath,
      uploadedById: user.id
    }
  });

  return NextResponse.redirect(new URL(`/cases/${params.id}`, req.url));
}
